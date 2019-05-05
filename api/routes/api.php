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
    Route::get('parties/{party_id}', 'PartiesController@show');
    Route::post('parties', 'PartiesController@store');
    Route::get('/me', 'MeController@data');
});