<?php

namespace App\Events;

use App\Party;
use App\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PartyMemberJoined implements ShouldBroadcast
{
    use InteractsWithSockets;

    protected $partyId;
    public $member;

    public function __construct(Party $party, User $member)
    {
        $this->partyId = $party->id;
        // Keep pivot data when using the synchronous broadcaster.
        $this->member = $member->toArray();
    }

    public function broadcastOn()
    {
        return new PrivateChannel('party.'.$this->partyId);
    }

    public function broadcastAs()
    {
        return 'member.joined';
    }
}
