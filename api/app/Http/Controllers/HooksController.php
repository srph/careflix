<?php

namespace App\Http\Controllers;

use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HooksController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function pusher(Request $request)
    {
        $event = $request->get('events')[0];

        $user = User::find($event['user_id']);

        if ($event['name'] === 'member_added') {
            $user->fill(['is_online' => true])->save();
        } else {
            $user->fill(['is_online' => false])->save();
        }

        return response()->json(['success' => true]);
    }
}
