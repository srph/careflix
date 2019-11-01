<?php

namespace App\Http\Controllers;

use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function data(Request $request)
    {
        return $request->user()->load('invitations');
    }

    /**
     * Get the most recent party the user might have accidentally left.
     *
     * @deprecated Use getRecentParties
     * @return \Illuminate\Http\Response
     */
    public function getRecentParty(Request $request) {
        $ago = Carbon::now()->subtract(30, 'minutes')->format('Y-m-d H:i:s');

        $party = $request->user()->parties()
            ->where('last_activity_at', '>=', $ago)
            ->orderBy('last_activity_at', 'desc')
            ->first();

        return [
            // Notice we're not including is_dismissed in the query.
            // We don't want to get the most recent undismissed party.
            // Rather, we want to get the most recent party, and if it's dismissed return a null.
            'party' => isset($party->pivot) && $party->pivot->is_dismissed ? null : $party
        ];
    }

    /**
     * Get the most recent parties.
     *
     * @return \Illuminate\Http\Response
     */
    public function getRecentParties(Request $request) {
        $parties = $request->user()->parties()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return ['parties' => $parties];
    }

    /**
     * Dismiss the party
     *
     * @return \Illuminate\Http\Response
     */
    public function dismissRecentParty(Request $request) {
        $party = $request->user()->parties()->where('party_id', $request->get('party_id'))->firstOrFail();
        $party->pivot->is_dismissed = true;
        $party->pivot->save();
        return $party;
    }

    /**
     * Create a new user
     *
     * @return \Illuminate\Http\Response
     */
    public function register(\App\Http\Requests\RegisterUser $request) {
        $user = new User([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => $request->get('password'),
            'is_admin' => false
        ]);

        $user->save();

        return response()->json($user);
    }

    /**
     * Marks the user as online
     *
     * @return \Illuminate\Http\Response
     */
    public function online(Request $request) {
        $user = $request->user()->fill(['is_online' => true])->save();
        return response()->json($user);
    }

    /**
     * Marks the user as offline
     *
     * @return \Illuminate\Http\Response
     */
    public function offline(Request $request) {
        $user = $request->user()->fill(['is_online' => false])->save();
        return response()->json($user);
    }
}
