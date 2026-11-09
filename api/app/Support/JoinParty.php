<?php

namespace App\Support;

use App\Party;
use App\PartyActivity;
use App\PartyInvitation;
use App\User;
use App\Events\PartyInvitationAccepted;
use App\Events\PartyInvitationDeclined;
use App\Events\PartyLogEvent;
use App\Events\PartyMemberJoined;
use App\Events\UserInvitationsResolved;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class JoinParty
{
    public function join(User $user, Party $party, PartyInvitation $invitation = null)
    {
        list($member, $log, $accepted, $declined) = DB::transaction(function () use ($user, $party, $invitation) {
            // Both entry paths and invitation sending lock this recipient first.
            User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            if ($invitation) {
                $invitation = $invitation->fresh();
                abort_unless($invitation->action === 'pending' && Carbon::parse($invitation->expires_at)->isFuture(), 403);
            }

            $pending = PartyInvitation::where('recipient_id', $user->id)->pending()->orderBy('id')->lockForUpdate()->get();
            $accepted = $pending->filter(function ($item) use ($party) { return $item->party_id === (int) $party->id; })->values();
            $declined = $pending->diff($accepted)->values();
            foreach ($pending as $item) {
                $item->fill(['action' => $item->party_id === (int) $party->id ? 'accepted' : 'declined'])->save();
            }

            $member = $party->members()->where('user_id', $user->id)->first();
            $log = null;
            if (!$member) {
                $party->members()->attach($user->id, ['is_active' => false]);
                $member = $party->members()->where('user_id', $user->id)->first();
                $activity = PartyActivity::create([
                    'user_id' => $user->id,
                    'party_id' => $party->id,
                    'text' => $invitation ? 'joined the room' : 'joined the room with the code',
                    'kind' => $invitation ? 'joined' : 'joined_code'
                ]);
                $log = $party->logs()->create([
                    'loggable_type' => PartyActivity::class,
                    'loggable_id' => $activity->id
                ]);
            }

            return [$member, $log, $accepted, $declined];
        });

        // Emit only after the membership, log, and invitation changes commit together.
        if ($log) {
            broadcast(new PartyMemberJoined($party, $member))->toOthers();
            broadcast(new PartyLogEvent($party, $log));
        }
        foreach ($accepted as $item) {
            broadcast(new PartyInvitationAccepted($party, $item, $member))->toOthers();
        }
        foreach ($declined as $item) {
            broadcast(new PartyInvitationDeclined($item->party, $item))->toOthers();
        }
        $resolved = array_merge($accepted->modelKeys(), $declined->modelKeys());
        if ($resolved) {
            broadcast(new UserInvitationsResolved($user->id, $resolved))->toOthers();
        }

        return array_merge($party->fresh()->load('invitations', 'creator')->makeVisible('join_code')->toArray(), [
            'accepted_invitation_ids' => $accepted->modelKeys(),
            'declined_invitation_ids' => $declined->modelKeys()
        ]);
    }
}
