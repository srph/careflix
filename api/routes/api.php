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
    Route::get('shows/{show}/groups', 'ShowsController@groups');
    Route::post('parties', 'PartiesController@store');

    Route::group(['middleware' => 'party.member'], function() {
        Route::get('parties/{party}', 'PartiesController@show');
        Route::put('parties/{party}/state', 'PartiesController@state');
        Route::put('parties/{party}/change-video', 'PartiesController@changeVideo');
        Route::put('parties/{party}/time', 'PartiesController@time');
        Route::get('parties/{party}/invitations', 'PartyInvitationsController@index');
        Route::get('parties/{party}/invitations/search', 'PartyInvitationsController@search');

        Route::post('parties/{party}/invitations/send', 'PartyInvitationsController@send');

        Route::get('parties/{party}/logs', 'PartyLogsController@index');
        Route::post('parties/{party}/logs/activity', 'PartyLogsController@activity');
        Route::post('parties/{party}/logs/message', 'PartyLogsController@message');
    });

    Route::group(['middleware' => 'party.invitation.recipient'], function() {
        Route::post('invitations/{invitation}/accept', 'PartyInvitationsController@accept');
        Route::post('invitations/{invitation}/decline', 'PartyInvitationsController@decline');
    });

    Route::post('invitations/{invitation}/cancel', 'PartyInvitationsController@cancel');

    Route::get('me', 'MeController@data');
});
