<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UserInvitationsResolved implements ShouldBroadcast
{
    use InteractsWithSockets;

    protected $userId;
    public $invitation_ids;

    public function __construct($userId, array $invitationIds)
    {
        $this->userId = $userId;
        $this->invitation_ids = $invitationIds;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user.'.$this->userId);
    }

    public function broadcastAs()
    {
        return 'invitations.resolved';
    }
}
