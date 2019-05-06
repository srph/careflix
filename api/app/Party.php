<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Party extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'show_video_id',
        'is_playing',
        'is_expired',
        'current_time',
        'last_activity_at'
    ];

    public $table = 'parties';

    public function genre() {
        return $this->hasMany(Genre::class);
    }

    public function logs() {
        return $this->hasMany(PartyLog::class);
    }

    public function show() {
        return $this->video->show;
    }

    public function video() {
        return $this->belongsTo(ShowVideo::class, 'show_video_id');
    }

    public function users() {
        return $this->belongsToMany(User::class);
    }

    public function invitations() {
        return $this->hasMany(PartyInvitation::class)->where('expires_at', '>=', now());
    }

    public function activities() {
        return $this->hasManyThrough(PartyActivity::class, PartyLog::class);
    }
}
