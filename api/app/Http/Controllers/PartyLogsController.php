<?php

namespace App\Http\Controllers;

use App\Party;
use App\PartyMessage;
use App\PartyActivity;
use App\Events\PartyLogEvent;
use Illuminate\Http\Request;

class PartyLogsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(\App\Http\Requests\GetPartyLogs $request, Party $party)
    {
        return $party->logs()->orderBy('created_at', 'asc')
            // ->limit(30)
            ->when($request->has('offset'), function($query) use ($request) {
                $query->where('id', '<', $request->get('offset'));
            })
            ->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function activity(Request $request, Party $party)
    {
        // @TODO Check if both syntax have the same effect.
        $activity = PartyActivity::create([
            'user_id' => $request->user()->id,
            'party_id' => $party->id,
            'text' => 'accepted the invitation'
        ]);

        $log = $party->logs()->create([
            'loggable_type' => PartyActivity::class,
            'loggable_id' => $activity->id
        ]);

        // This seems a safer bet than `$log->load('loggable')`.
        return $log->fresh();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function message(\App\Http\Requests\SendPartyMessage $request, Party $party)
    {
        // @TODO Check if both syntax have the same effect.
        $activity = PartyMessage::create([
            'user_id' => $request->user()->id,
            'party_id' => $party->id,
            'text' => $request->get('message')
        ]);

        $log = $party->logs()->create([
            'loggable_type' => PartyMessage::class,
            'loggable_id' => $activity->id
        ])->fresh();

        broadcast(new PartyLogEvent($party, $log))->toOthers();

        // This seems a safer bet than `$log->load('loggable')`.
        return $log;
    }
}
