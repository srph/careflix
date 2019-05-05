<?php

namespace App\Http\Controllers;

use App\Party;
use App\PartyInvitation;
use App\Support\Helper;
use Carbon\Carbon;
use Illuminate\Http\Request;

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
            'expires_at' => Carbon::now()->addSeconds($duration)
        ]);

        // .......................
        // ... Broadcast
        // .......................

        return $invitation;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function accept(\App\Http\Requests\DoInvitation $request, PartyInvitation $invitation)
    {
        $invitation->action = 'accepted';
        $invitation->save();
        $invitation->party->users()->attach($request->user()->id, [
            'is_active' => true
        ]);
        
        // .......................
        // ... Broadcast
        // .......................

        return $invitation;
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
        
        // .......................
        // ... Broadcast
        // .......................

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
        
        // .......................
        // ... Broadcast
        // .......................

        return $invitation;
    }
}
