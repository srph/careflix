<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return response()->json(['status' => 'success', 'message' => 'Hello']);
});

Route::get('auth/discord', 'Auth\DiscordController@redirect')->middleware('throttle.auth:10,1');
Route::get('auth/discord/callback', 'Auth\DiscordController@callback')->middleware('throttle.auth:10,1');
