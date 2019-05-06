<?php

namespace App\Events;

use App\Party;
use App\PartyLog;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
// use Illuminate\Broadcasting\PresenceChannel;
// use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PartyMessage implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * @var Party
     */
    public $party;

    /**
     * @var PartyLog
     */
    public $log;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Party $party, PartyLog $log)
    {
        $this->party = $party;
        $this->log = $log;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('party.'.$this->party->id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'message';
    }
}