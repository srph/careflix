<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Show extends Model
{
    /**
     * The relationships that will always be eager-loaded
     *
     * @var array
     */
    protected $with = [
        'genres'
    ];

    /**
     * The attributes that will always be included in the serialization
     *
     * @var array
     */
    protected $appends = [
        'movie'
    ];

    public function genres() {
        return $this->belongsToMany(Genre::class);
    }

    public function groups() {
        return $this->hasMany(ShowGroup::class);
    }

    public function videos() {
        return $this->hasMany(ShowVideo::class);
    }

    public function getMovieAttribute() {
        return $this->title_type === 'movie' ? $this->videos()->first() : null;
    }
}
