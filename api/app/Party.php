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
        'creator_id',
        'join_code',
        'show_video_id',
        'is_playing',
        'is_expired',
        'current_time',
        'last_activity_at'
    ];

    /**
     * The relationships that will always be eager-loaded
     *
     * @var array
     */
    protected $with = [
        'video',
        'video.show',
        'video.group',
        'members'
    ];

    public $table = 'parties';

    // Invitations and broadcasts also serialize parties. Only member responses reveal the code.
    protected $hidden = ['join_code'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($party) {
            if (!$party->join_code) {
                do {
                    $party->join_code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                } while (static::where('join_code', $party->join_code)->exists());
            }
        });
    }

    public function creator() {
        return $this->belongsTo(User::class, 'creator_id')->select('id', 'name', 'avatar');
    }

    public static function createWithCode(array $attributes) {
        // The unique index also covers the rare collision between concurrent creates.
        for ($attempt = 0; $attempt < 10; $attempt++) {
            try {
                return static::create($attributes);
            } catch (\Illuminate\Database\QueryException $error) {
                if (strpos($error->getMessage(), 'join_code') === false ||
                    !in_array($error->getCode(), ['23000', '23505'])) {
                    throw $error;
                }
            }
        }
        throw $error;
    }

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

    public function members() {
        return $this->belongsToMany(User::class)->withPivot('is_active');
    }

    public function invitations() {
        return $this->hasMany(PartyInvitation::class)->pending();
    }

    public function activities() {
        return $this->hasManyThrough(PartyActivity::class, PartyLog::class);
    }
}
