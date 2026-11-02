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

    public function parties(Request $request) {
        $request->validate([
            'q' => 'nullable|string|max:200',
            'per_page' => 'nullable|integer|min:1|max:60',
            'page' => 'nullable|integer|min:1'
        ]);

        $parties = $request->user()->parties()
            ->with('video.show.movieVideo')
            ->whereHas('video.show');

        if ($request->filled('q')) {
            $parties->whereHas('video.show', function ($shows) use ($request) {
                $shows->searchTitle($request->get('q'));
            });
        }

        // Dismissing the old resume banner does not remove a party from history.
        $result = $parties->orderBy('parties.last_activity_at', 'desc')
            ->orderBy('parties.id', 'desc')
            ->paginate($request->get('per_page') ?: 30);

        $result->getCollection()->transform(function ($party) {
            $data = $party->toArray();
            // SQL timestamps are stored in the app timezone, not the viewer's timezone.
            $data['last_activity_at'] = Carbon::parse($party->last_activity_at, config('app.timezone'))->toIso8601String();
            return $data;
        });

        return $result;
    }

    /**
     * Get the most recent party the user might have accidentally left.
     * 
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
