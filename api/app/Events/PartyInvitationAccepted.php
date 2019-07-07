<?php

namespace App\Events;

use App\User;
use App\Party;
use App\PartyInvitation;
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
     * @var User
     */
    public $member;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Party $party, PartyInvitation $invitation, User $member)
    {
        $this->party = $party;
        $this->invitation = $invitation;
        $this->member = $member;
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

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'invitation' => $this->invitation,
            'member' => $this->member
        ];
    }
}
