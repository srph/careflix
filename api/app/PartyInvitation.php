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

    // Keep recipient authorization consistent across database drivers.
    protected $casts = [
        'party_id' => 'integer',
        'sender_id' => 'integer',
        'recipient_id' => 'integer'
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
        return $value ?? 'pending';
    }

    /**
     * Invitation deadlines must represent the same instant in every viewer timezone.
     */
    public function getExpiresAtAttribute($value) {
        return \Carbon\Carbon::parse($value, config('app.timezone'))->toIso8601String();
    }

    /**
     * Get non-expired pending invitations
     * 
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query) {
        return $query->where('expires_at', '>', date('Y-m-d H:i:s'))
            ->where(function($query) {
                $query->where('action', 'pending')
                    ->orWhereNull('action');
            });
    }
}
