<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PartyInvitation extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'party_id',
        'sender_id',
        'recipient_id',
        'invitation_code',
        'action',
        'duration',
        'expires_at'
    ];

    /**
     * The relationships that will always be eager-loaded
     *
     * @var array
     */
    protected $with = [
        'sender',
        'recipient'
    ];

    public function sender() {
        return $this->belongsTo(User::class, 'sender_id', 'id');
    }

    public function recipient() {
        return $this->belongsTo(User::class, 'recipient_id', 'id');
    }

    public function party() {
        return $this->belongsTo(Party::class);
    }

    /**
     * Provide a fallback to the action attribute
     * 
     * @param  string
     * @return string
     */
    public function getActionAttribute($value) {
        return $this->action ?? 'pending';
    }

    /**
     * Get non-expired pending invitations
     * 
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query) {
        return $query->where('expires_at', '<=', now())
            // ->where('action', '=', 'pending')
            ->where(function($query) {
                $query->where('action', 'pending')
                    ->orWhereNull('action');
            });
    }
}
