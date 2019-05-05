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
    Route::get('parties/{party}', 'PartiesController@show');
    Route::post('parties', 'PartiesController@store');

    Route::get('parties/{party}/invitations', 'PartyInvitationsController@index');
    Route::post('parties/{party}/invitations/send', 'PartyInvitationsController@send');
    Route::post('invitations/{invitation}/accept', 'PartyInvitationsController@accept');
    Route::post('invitations/{invitation}/decline', 'PartyInvitationsController@decline');
    Route::post('invitations/{invitation}/cancel', 'PartyInvitationsController@cancel');

    Route::get('me', 'MeController@data');
});