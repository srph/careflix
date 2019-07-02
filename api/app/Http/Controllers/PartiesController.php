<?php

namespace App\Http\Controllers;

use App\Support\Helper;
use App\Party;
use App\Events\PartyState;
use App\PartyActivity;
use App\Events\PartyVideoChanged;
use App\Events\PartyLogEvent;

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
        // Properly typecast the request data
        $payload = [
            'current_time' => (int) $request->get('current_time'),
            'is_playing' => (boolean) $request->get('is_playing')
        ];

        $action = null;

        $time = Helper::getReadableFormatFromDurationInSeconds($payload['current_time']);

        if ($party->is_playing && !$payload['is_playing']) {
            $action = 'paused the video (' . $time . ')';
        } else if (!$party->is_playing && $payload['is_playing']) {
            $action = 'played the video (' . $time . ')';
        } else {
            // By default, the user probably seeked.
            // This is pretty brittle because what if two users tried to play/pause
            // the video at the same time? Not urgent, but something to look at in the future.
            $action = 'seeked to ' . $time;
        }

        \Log::info(['action' => $action]);

        $party->fill([
            'current_time' => (int) $request->get('current_time'),
            'is_playing' => (boolean) $request->get('is_playing')
        ])->save();

        $activity = PartyActivity::create([
            'user_id' => $request->user()->id,
            'party_id' => $party->id,
            'text' => $action
        ]);

        $log = $party->logs()->create([
            'loggable_type' => PartyActivity::class,
            'loggable_id' => $activity->id
        ]);

        broadcast(new PartyState($party))->toOthers();

        broadcast(new PartyLogEvent($party, $log));

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
