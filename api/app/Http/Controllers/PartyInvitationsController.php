<?php

namespace App\Http\Controllers;

use App\User;
use App\Party;
use App\PartyInvitation;
use App\Support\Helper;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Events\PartyInvitationSent;
use App\Events\UserInvitationReceived;
use App\Events\UserInvitationCancelled;
use App\Events\PartyInvitationDeclined;
use App\Events\PartyInvitationCancelled;

class PartyInvitationsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Party $party)
    {
        // Keep the latest outcome for each person, including expired invitations.
        return PartyInvitation::whereIn('id', function ($query) use ($party) {
            $query->selectRaw('MAX(id)')->from('party_invitations')
                ->where('party_id', $party->id)->groupBy('recipient_id');
        })->orderBy('id')->get();
    }

    /**
     * Search for users to invite
     *
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request, Party $party)
    {
        $request->validate(['search' => 'nullable|string|max:100']);
        $search = trim((string) $request->get('search'));
        $users = User::select('users.id', 'name', 'avatar', 'is_online')
            ->where('users.id', '!=', $request->user()->id);

        if ($search !== '') {
            $pattern = '%' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], mb_strtolower($search)) . '%';
            return $users->where(function ($query) use ($pattern) {
                $query->whereRaw("LOWER(name) LIKE ? ESCAPE '!'", [$pattern])
                    ->orWhereRaw("LOWER(email) LIKE ? ESCAPE '!'", [$pattern]);
            })->orderBy('name')->orderBy('users.id')->limit(20)->get();
        }

        // Recents are previous co-watchers, ordered by the latest shared party.
        $ids = DB::table('party_user as viewer')
            ->join('party_user as companion', 'companion.party_id', '=', 'viewer.party_id')
            ->join('parties', 'parties.id', '=', 'viewer.party_id')
            ->where('viewer.user_id', $request->user()->id)
            ->where('companion.user_id', '!=', $request->user()->id)
            ->whereNotIn('companion.user_id', $party->members()->pluck('users.id'))
            ->groupBy('companion.user_id')
            ->orderByRaw('MAX(parties.last_activity_at) DESC')
            ->orderBy('companion.user_id')->limit(20)->pluck('companion.user_id');
        $byId = $users->whereIn('users.id', $ids)->get()->keyBy('id');
        return $ids->map(function ($id) use ($byId) { return $byId->get($id); })->filter()->values();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function send(\App\Http\Requests\SendInvitation $request, Party $party)
    {
        $duration = config('config.party.invitation_duration');

        list($invitation, $created) = DB::transaction(function () use ($request, $party, $duration) {
            User::whereKey($request->get('recipient_id'))->lockForUpdate()->firstOrFail();
            abort_if($party->members()->where('user_id', $request->get('recipient_id'))->exists(), 422, 'This person is already a member of the party.');
            $pending = $party->invitations()->where('recipient_id', $request->get('recipient_id'))->first();
            if ($pending) return [$pending, false];
            return [PartyInvitation::create([
                'party_id' => $party->id,
                'sender_id' => $request->user()->id,
                'recipient_id' => $request->get('recipient_id'),
                'invitation_code' => Helper::generateInvitationCode(),
                'duration' => $duration,
                'action' => 'pending',
                'expires_at' => Carbon::now()->addSeconds($duration)
            ])->fresh(), true];
        });

        $invitation->load('party');

        if ($created) {
            broadcast(new PartyInvitationSent($invitation->party, $invitation))->toOthers();
            broadcast(new UserInvitationReceived($request->get('recipient_id'), $party, $invitation));
        }

        return $invitation;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function accept(\App\Http\Requests\DoInvitation $request, PartyInvitation $invitation)
    {
        return app(\App\Support\JoinParty::class)->join($request->user(), $invitation->party, $invitation);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function decline(\App\Http\Requests\DoInvitation $request, PartyInvitation $invitation)
    {
        $invitation = $this->respond($invitation, 'declined');
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
        $invitation = $this->respond($invitation, 'cancelled');
        $invitation->load('party');

        broadcast(new PartyInvitationCancelled($invitation->party, $invitation))->toOthers();

        broadcast(new UserInvitationCancelled($invitation->party, $invitation))->toOthers();

        return $invitation;
    }

    private function respond(PartyInvitation $invitation, $action)
    {
        return DB::transaction(function () use ($invitation, $action) {
            User::whereKey($invitation->recipient_id)->lockForUpdate()->firstOrFail();
            $invitation = $invitation->fresh();
            abort_unless($invitation->action === 'pending', 403);
            abort_if($action === 'declined' && !Carbon::parse($invitation->expires_at)->isFuture(), 403);
            $invitation->fill(['action' => $action])->save();
            return $invitation;
        });
    }
}
