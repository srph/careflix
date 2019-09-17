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
    protected $party;

    /**
     * @var PartyInvitation
     */
    protected $invitation;

    /**
     * @var array
     */
    protected $member;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Party $party, PartyInvitation $invitation, User $member)
    {
        $this->party = $party;
        $this->invitation = $invitation;
        $this->member = $this->transformMember($member);
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
            'invitation' => $this->invitation->attributesToArray(),
            'member' => $this->member
        ];
    }

    /**
     * We want to transform member in the constructor because we lose
     * other data like `pivot` for some reason. We're using Laravel 5.8
     * yet this still occurs.
     * 
     * @TODO Move over to Redis because it seems to be a bug with `QUEUE_DRIVER=sync`.
     * 
     * @see https://github.com/laravel/framework/issues/23068
     */
    protected function transformMember($member) {
        $data = $member->attributesToArray();
        $pivot = $member->pivot->toArray();
        return array_merge($data, ['pivot' => $pivot]);
    }
}
