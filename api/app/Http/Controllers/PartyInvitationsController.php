<?php

namespace App\Http\Controllers;

use App\User;
use App\Party;
use App\PartyInvitation;
use App\PartyActivity;
use App\Support\Helper;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Events\PartyInvitationSent;
use App\Events\UserInvitationReceived;
use App\Events\UserInvitationCancelled;
use App\Events\PartyInvitationAccepted;
use App\Events\PartyInvitationDeclined;
use App\Events\PartyInvitationCancelled;
use App\Events\PartyLogEvent;

class PartyInvitationsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Party $party)
    {
        return $party->invitations;
    }

    /**
     * Search for users to invite
     *
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request, Party $party)
    {
        $search = $request->get('search');

        return User::when($request->has('search'), function($query) use ($search) {
                $query->search($search);
            }, function($query) use($party) {
                $query->select(
                    'users.*',
                    'party_user.party_id as member_party_id',
                    'party_user.user_id as member_user_id'
                )->leftJoin('party_user', function($join) use ($party) {
                    $join->on('party_user.party_id', '=', \DB::raw($party->id));
                    $join->on('party_user.user_id', '=', 'users.id');
                })->orderBy('party_user.party_id', 'desc');
            })
            ->where('users.id', '!=', $request->user()->id)
            ->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function send(\App\Http\Requests\SendInvitation $request, Party $party)
    {
        $duration = config('config.party.invitation_duration');

        $invitation = PartyInvitation::create([
            'party_id' => $party->id,
            'sender_id' => $request->user()->id,
            'recipient_id' => $request->get('recipient_id'),
            'invitation_code' => Helper::generateInvitationCode(),
            'duration' => $duration,
            'action' => 'pending',
            'expires_at' => Carbon::now()->addSeconds($duration)
        ])->fresh();

        $invitation->load('party');

        broadcast(new PartyInvitationSent($invitation->party, $invitation))->toOthers();

        broadcast(new UserInvitationReceived($request->get('recipient_id'), $party, $invitation));

        return $invitation;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function accept(\App\Http\Requests\DoInvitation $request, PartyInvitation $invitation)
    {
        list($party, $member, $log, $declined) = DB::transaction(function() use ($request, $invitation) {
            // Serialize accepts for this recipient, including requests already authorized.
            User::whereKey($request->user()->id)->lockForUpdate()->first();
            $invitation = $invitation->fresh();
            abort_unless($invitation->action === 'pending' && Carbon::parse($invitation->expires_at)->isFuture(), 403);

            $declined = PartyInvitation::where('recipient_id', $request->user()->id)
                ->where('id', '!=', $invitation->id)
                ->pending()
                ->lockForUpdate()
                ->get();

            $invitation->fill(['action' => 'accepted'])->save();
            foreach ($declined as $other) {
                $other->fill(['action' => 'declined'])->save();
            }

            $party = $invitation->party;
            $party->members()->attach($request->user()->id, ['is_active' => false]);
            $member = $party->members()->where('user_id', $request->user()->id)->first();

            $activity = PartyActivity::create([
                'user_id' => $request->user()->id,
                'party_id' => $party->id,
                'text' => 'joined the room'
            ]);

            $log = $party->logs()->create([
                'loggable_type' => PartyActivity::class,
                'loggable_id' => $activity->id
            ]);

            return [$party, $member, $log, $declined];
        });

        $invitation->refresh();
        broadcast(
            new PartyInvitationAccepted($party, $invitation, $member)
        )->toOthers();

        broadcast(new PartyLogEvent($party, $log));
        foreach ($declined as $other) {
            broadcast(new PartyInvitationDeclined($other->party, $other))->toOthers();
        }

        return array_merge($party->toArray(), ['declined_invitation_ids' => $declined->modelKeys()]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function decline(\App\Http\Requests\DoInvitation $request, PartyInvitation $invitation)
    {
        $invitation->action = 'declined';
        $invitation->save();
        $invitation->load('party');

        broadcast(new PartyInvitationDeclined($invitation->party, $invitation))->toOthers();

        return $invitation;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function cancel(\App\Http\Requests\DoInvitation $request, PartyInvitation $invitation)
    {
        $invitation->action = 'cancelled';
        $invitation->save();
        $invitation->load('party');

        broadcast(new PartyInvitationCancelled($invitation->party, $invitation))->toOthers();

        broadcast(new UserInvitationCancelled($invitation->party, $invitation))->toOthers();

        return $invitation;
    }
}
