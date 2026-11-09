<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PartyActivity extends Model
{
    public $table = 'party_log_activities';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'party_id',
        'text',
        'kind',
        'meta'
    ];

    /**
     * `kind` says what happened; `meta` holds that kind's details, e.g.
     * `played`/`paused` {seconds} and `seeked` {seconds, from_seconds}.
     * `text` stays as the readable sentence for older clients.
     *
     * @var array
     */
    protected $casts = [
        'meta' => 'array'
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
