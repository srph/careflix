<?php

namespace App\Events;

use App\Party;
use App\PartyInvitation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
// use Illuminate\Broadcasting\PresenceChannel;
// use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PartyInvitationSent implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * @var Party
     */
    public $party;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Party $party, PartyInvitation $invitation)
    {
        $this->party = $party;
        $this->invitation = $invitation;
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
        return 'invitation.sent';
    }
}