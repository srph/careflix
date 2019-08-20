<?php

namespace App\Http\Controllers\Hooks;

class PusherHook {
  /**
   * @var int
   */
  protected $time_ms;

  /**
   * @var Illuminate\Support\Collection<App\Http\Controllers\Hooks\PusherHookEvent>
   */
  protected $events = [];

  /**
   * 
   */
  public function __construct($hook) {
    $this->time_ms = $hook['time_ms'];

    $this->events = collect($hook['events'])->map(function($event) {
      return new PusherHookEvent($event);
    });
  }

  /**
   * Handle the hook
   */
  public function handle($callback) {
    $this->events->each(function($event) use($callback) {
      $callback($event);
    });
  }
} 