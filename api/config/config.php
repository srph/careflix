<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Product-wide settings
    |--------------------------------------------------------------------------
    |
    | Unlike the other files, this is where we put all
    | product-related opinions and configurations.
    |
    */

  'party' => [
    
    /*
    |--------------------------------------------------------------------------
    | Invitation duration
    |--------------------------------------------------------------------------
    |
    | Number of seconds to wait before an invitation expires. (1800 -> 30 minutes)
    |
    */
    'invitation_duration' => 1800,

  ],

  /*
  |--------------------------------------------------------------------------
  | CDN Settings
  |--------------------------------------------------------------------------
  |
  | The base url to the Digital Ocean CDN
  |
  */
  'cdn' => env('APP_CDN', 'https://your-cdn.sgp1.cdn.digitaloceanspaces.com/'),

  /*
  |--------------------------------------------------------------------------
  | Request Access Code
  |--------------------------------------------------------------------------
  |
  | Unique request code for user registration.
  |
  */
  'request_access_code' => env('APP_REQUEST_ACCESS_CODE', '')

];
