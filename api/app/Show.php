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

    /**
     * Filter shows down to the ones whose title matches the search term
     *
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @param  string $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch(\Illuminate\Database\Eloquent\Builder $query, $search) {
        // https://stackoverflow.com/a/21216559/2698227
        return $query->whereRaw('lower(title) like (?)', '%' . mb_strtolower($search) . '%');
    }

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
