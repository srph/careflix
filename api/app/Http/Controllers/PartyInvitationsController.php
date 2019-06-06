<?php

namespace App\Http\Controllers;

use App\User;
use App\Party;
use App\PartyInvitation;
use App\PartyActivity;
use App\Support\Helper;

use Carbon\Carbon;

use Illuminate\Http\Request;
use App\Events\PartyInvitationSent;
use App\Events\UserInvitationReceived;
use App\Events\UserInvitationCancelled;
use App\Events\PartyInvitationAccepted;
use App\Events\PartyInvitationDeclined;
use App\Events\PartyInvitationCancelled;
use App\Events\PartyActivity as PartyActivityEvent;

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
    public function search(\App\Http\Requests\SearchInvitableUsers $request, Party $party)
    {
        $search = $request->get('search');
        
        return User::search($search)
            ->where('id', '!=', $request->user()->id)
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
        $invitation->fill([
            'action' => 'accepted'
        ])->save();

        $invitation->party->members()->attach($request->user()->id, [
            'is_active' => false
        ]);

        $activity = \App\PartyActivity::create([
            'user_id' => $request->user()->id,
            'party_id' => $invitation->party->id,
            'text' => 'joined the room'
        ]);

        $log = $invitation->party->logs()->create([
            'loggable_type' => \App\PartyActivity::class,
            'loggable_id' => $activity->id
        ]);

        broadcast(new PartyInvitationAccepted($invitation->party, $invitation))->toOthers();

        broadcast(new PartyActivityEvent($invitation->party, $log));

        return $invitation->party;
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
