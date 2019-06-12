<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ShowGroup extends Model
{
    /**
     * The relationships that will always be eager-loaded
     *
     * @var array
     */
    protected $with = [
        'videos'
    ];

    public function show() {
        return $this->belongsTo(Show::class);
    }

    public function videos() {
        return $this->hasMany(ShowVideo::class);
    }
}
