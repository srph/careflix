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

    /**
     * Create a getter to access the first and only video
     * 
     * @return string
     */
    public function getMovieAttribute() {
        return $this->title_type === 'movie' ? $this->videos()->first() : null;
    }

    /**
     * Add a fallback to the preview image
     * 
     * @return string
     */
    public function getPreviewImage() {
        return $this->preview_image ?? \App\Support\Helper::cdn('videos/default-preview-16-9.jpg');
    }
}
