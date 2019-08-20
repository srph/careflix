<?php

namespace App\Http\Controllers\Hooks;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
            switch($event->channel) {
                case 'chat':
                    $this->handleChat($event);
                    break;
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
}
