<?php

namespace App\Events;

use App\Party;
use App\PartyInvitation as Invitation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
// use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PartyInvitationAccepted implements ShouldBroadcast
{
    use SerializesModels, InteractsWithSockets;

    /**
     * @var Party
     */
    public $party;

    /**
     * @var PartyInvitation
     */
    public $invitation;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Party $party, Invitation $invitation)
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
        return "invitation.accepted";
    }
}