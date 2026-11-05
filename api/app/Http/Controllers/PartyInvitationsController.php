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

        $invitation = DB::transaction(function () use ($request, $party, $duration) {
            User::whereKey($request->get('recipient_id'))->lockForUpdate()->firstOrFail();
            abort_if($party->members()->where('user_id', $request->get('recipient_id'))->exists(), 422, 'This person is already a member of the party.');
            return PartyInvitation::create([
                'party_id' => $party->id,
                'sender_id' => $request->user()->id,
                'recipient_id' => $request->get('recipient_id'),
                'invitation_code' => Helper::generateInvitationCode(),
                'duration' => $duration,
                'action' => 'pending',
                'expires_at' => Carbon::now()->addSeconds($duration)
            ])->fresh();
        });

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
