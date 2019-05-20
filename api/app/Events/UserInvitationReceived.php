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

class UserInvitationReceived implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * @var number
     */
    public $recepient_id;

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
    public function __construct($recepient_id, Party $party, PartyInvitation $invitation)
    {
        $this->recepient_id = $recepient_id;
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
        return new PrivateChannel('user.'.$this->recepient_id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'invitation.received';
    }
}