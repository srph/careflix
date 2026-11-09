<?php

namespace App\Http\Controllers;

use App\Support\Helper;
use App\Party;
use App\Events\PartyState;
use App\PartyActivity;
use App\Events\PartyVideoChanged;
use App\Events\PartyLogEvent;
use Illuminate\Support\Facades\DB;

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

        return DB::transaction(function () use ($payload, $request) {
            $party = Party::createWithCode([
                'creator_id' => $request->user()->id,
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
                'text' => 'created the room',
                'kind' => 'created'
            ]);

            $party->logs()->create([
                'loggable_type' => \App\PartyActivity::class,
                'loggable_id' => $activity->id
            ]);

            return $party->fresh()->load('creator')->makeVisible('join_code');
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Party $party)
    {
        return $party->load('invitations', 'creator')->makeVisible('join_code');
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

        $time = Helper::getReadableFormatFromDurationInSeconds($payload['current_time']);
        $meta = ['seconds' => $payload['current_time']];

        if ($party->is_playing && !$payload['is_playing']) {
            $kind = 'paused';
            $action = 'paused the video (' . $time . ')';
        } else if (!$party->is_playing && $payload['is_playing']) {
            $kind = 'played';
            $action = 'played the video (' . $time . ')';
        } else {
            // By default, the user probably seeked.
            // This is pretty brittle because what if two users tried to play/pause
            // the video at the same time? Not urgent, but something to look at in the future.
            $kind = 'seeked';
            $action = 'seeked to ' . $time;
            // Read before the fill below so clients can tell a jump back from a skip ahead.
            $meta['from_seconds'] = (int) $party->current_time;
        }

        $party->fill([
            'current_time' => (int) $request->get('current_time'),
            'is_playing' => (boolean) $request->get('is_playing'),
            'last_activity_at' => date('Y-m-d H:i:s')
        ])->save();

        $activity = PartyActivity::create([
            'user_id' => $request->user()->id,
            'party_id' => $party->id,
            'text' => $action,
            'kind' => $kind,
            'meta' => $meta
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
            'text' => "switched to {$party->video->group->title}: {$party->video->title}",
            'kind' => 'switched',
            'meta' => ['video_id' => $party->video->id]
        ]);

        $log = $party->logs()->create([
            'loggable_type' => \App\PartyActivity::class,
            'loggable_id' => $activity->id
        ])->fresh('loggable');

        broadcast(
            new PartyVideoChanged($party, $log)
        )->toOthers();

        return $party->load('creator')->makeVisible('join_code');
    }
}
