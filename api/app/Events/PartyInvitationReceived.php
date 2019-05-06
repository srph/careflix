<?php

namespace App\Events;

use App\User;
use App\Party;
use App\PartyInvitation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
// use Illuminate\Broadcasting\PresenceChannel;
// use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PartyInvitationReceived implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * @var User
     */
    public $user;

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
    public function __construct(User $user, Party $party, PartyInvitation $invitation)
    {
        $this->user = $user;
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
        return new PrivateChannel('user.invitation.'.$this->user->id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'receive';
    }
}