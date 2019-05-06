<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->group(function() {
    Route::get('shows', 'ShowsController@index');
    Route::post('parties', 'PartiesController@store');

    Route::group(['middleware' => 'party.member'], function() {
        Route::get('parties/{party}', 'PartiesController@show');
        Route::put('parties/{party}/state', 'PartiesController@state');
        Route::put('parties/{party}/time', 'PartiesController@time');
        Route::get('parties/{party}/invitations', 'PartyInvitationsController@index');

        Route::post('parties/{party}/invitations/send', 'PartyInvitationsController@send');
        Route::post('invitations/{invitation}/accept', 'PartyInvitationsController@accept');
        Route::post('invitations/{invitation}/decline', 'PartyInvitationsController@decline');
        Route::post('invitations/{invitation}/cancel', 'PartyInvitationsController@cancel');

        Route::get('parties/{party}/logs', 'PartyLogsController@index');
        Route::post('parties/{party}/logs/activity', 'PartyLogsController@activity');
        Route::post('parties/{party}/logs/message', 'PartyLogsController@message');
    });
        
    Route::get('me', 'MeController@data');
});