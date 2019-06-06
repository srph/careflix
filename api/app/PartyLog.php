<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PartyLog extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'loggable_type',
        'loggable_id'
    ];

    /**
     * The attributes that will always be included in the serialization
     *
     * @var array
     */
    protected $appends = [
        'type',
        'activity',
        'message'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'loggable_type',
        'loggable_id',
        'loggable'
    ];

    public function party() {
        return $this->belongsTo(Party::class);
    }

    /**
     * Get the polymorphic relationship
     * 
     * @return PartyActivity
     * @return PartyMessage
     */
    public function loggable() {
        return $this->morphTo();
    }

    /**
     * Transform the `loggable_type` property
     * 
     * @return string
     */
    public function getTypeAttribute() {
        return $this->loggable_type === 'App\\PartyActivity'
            ? 'activity'
            : 'message';
    }

    /**
     * Fill the attribute property with the loggable data if it's an activity.
     * 
     * @return PartyActivity
     */
    public function getActivityAttribute() {
        return $this->loggable_type === 'App\\PartyActivity'
            ? $this->loggable
            : null;
    }


    /**
     * Fill the attribute property with the loggable data if it's a message.
     * 
     * @return PartyMessage
     */
    public function getMessageAttribute() {
        return $this->loggable_type === 'App\\PartyMessage'
            ? $this->loggable
            : null;
    }
}
