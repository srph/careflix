<?php

namespace App\Http\Controllers;

use App\User;
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
}
