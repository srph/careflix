<?php

namespace App\Http\Controllers\Hooks;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Party;

class PusherController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function dispatcher(Request $request)
    {
        $hook = new PusherHook($request->all());

        $hook->handle(function($event) {
            if ($event->channel === 'chat') {
                $this->handleChat($event);
            } else if (\Str::startsWith($event->channel, 'chat-party')) {
                $this->handleChatParty($event);
            }
        });

        return response()->json(['success' => true]);
    }

    /**
     * Set user as online/offline on global chat
     * 
     * @param App\Http\Controllers\Hooks\PusherHookEvent
     */
    public function handleChat(PusherHookEvent $event) {
        $user = $event->user;

        if ($event->name === 'member_added') {
            $user->fill(['is_online' => true])->save();
        } else {
            $user->fill(['is_online' => false])->save();
        }
    }

    /**
     * Set user as online/offline on global chat
     * 
     * @param App\Http\Controllers\Hooks\PusherHookEvent
     */
    public function handleChatParty(PusherHookEvent $event) {
        $party_id = explode('.', $event->channel, 2)[1];
        $party = Party::find($party_id);
        $user = $party->members()->where('user_id', $event->user->id)->first();

        if ($event->name === 'member_added') {
            $user->pivot->is_active = true;
        } else {
            $user->pivot->is_active = false;
        }

        $user->pivot->save();
    }
}
