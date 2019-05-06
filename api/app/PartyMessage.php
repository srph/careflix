<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PartyMessage extends Model
{
    public $table = 'party_log_messages';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'party_id',
        'text'
    ];

    /**
     * The relationships that will always be eager-loaded
     *
     * @var array
     */
    protected $with = [
        'user'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function log() {
        return $this->morphOne(PartyLog::class, 'loggable');
    }
}
