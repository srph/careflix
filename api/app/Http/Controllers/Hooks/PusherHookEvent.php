<?php

namespace App\Http\Controllers\Hooks;

use App\User;

class PusherHookEvent {
  /**
   * @var string
   */
  public $channel;

  /**
   * @var string
   */
  public $name;

  /**
   * @var App\User
   */
  public $user;

  /**
   * 
   */
  public function __construct($event) {
    $this->channel = str_replace('presence-', '', $event['channel']);
    $this->name = $event['name'];
    $this->user = User::find($event['user_id']);
  }
} 