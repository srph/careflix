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
    | Number of seconds to wait before an invitation expires.
    |
    */
    'invitation_duration' => 300,

  ],

  /*
  |--------------------------------------------------------------------------
  | CDN Settings
  |--------------------------------------------------------------------------
  |
  | The base url to the Digital Ocean CDN
  |
  */
  'cdn' => env('APP_CDN', 'https://caretv.sgp1.cdn.digitaloceanspaces.com/')

];