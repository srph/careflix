<?php

namespace App\Http\Controllers;

use App\Party;
use App\Events\PartyState;
use App\Events\PartyActivity;
use App\Events\PartyVideoChanged;

class PartiesController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(\App\Http\Requests\StoreParty $request)
    {
        $payload = $request->only(['show_video_id']);

        $party = Party::create([
            'show_video_id' => $payload['show_video_id'],
            'is_playing' => false,
            'is_expired' => false,
            'current_time' => 0,
            'last_activity_at' => now()
        ]);

        $party->members()->attach($request->user()->id, [
            'is_active' => false
        ]);

        $activity = \App\PartyActivity::create([
            'user_id' => $request->user()->id,
            'party_id' => $party->id,
            'text' => 'created the room'
        ]);

        $party->logs()->create([
            'loggable_type' => \App\PartyActivity::class,
            'loggable_id' => $activity->id
        ]);

        return $party;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Party $party)
    {
        return $party->load('invitations');
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function state(\App\Http\Requests\UpdatePartyState $request, Party $party)
    {
        $party->fill([
            'current_time' => (int) $request->get('current_time'),
            'is_playing' => (boolean) $request->get('is_playing')
        ])->save();

        broadcast(new PartyState($party))->toOthers();

        return $party;
    }

    /**
     * Update the specified resource in storage.
     *
     * @todo Permission for non
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function time(\App\Http\Requests\UpdatePartyState $request, Party $party)
    {
        $party->fill([
            'current_time' => (int) $request->get('current_time')
        ])->save();

        return $party;
    }

    /**
     * Endpoint to change a party's current show
     *
     * @todo Permission for non-party host
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function changeVideo(\App\Http\Requests\ChangePartyVideo $request, Party $party)
    {
        $party = tap(
            $party->fill([
                'show_video_id' => $request->get('show_video_id'),
                'is_playing' => false,
                'is_expired' => false,
                'current_time' => 0,
                'last_activity_at' => now()
            ])
        )->save()->fresh();

        $activity = \App\PartyActivity::create([
            'user_id' => $request->user()->id,
            'party_id' => $party->id,
            'text' => "switched to {$party->video->group->title}: {$party->video->title}"
        ]);

        $log = $party->logs()->create([
            'loggable_type' => \App\PartyActivity::class,
            'loggable_id' => $activity->id
        ])->fresh('loggable');

        broadcast(
            new PartyVideoChanged($party, $log)
        )->toOthers();

        return $party;
    }
}
