<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ShowGroup extends Model
{
    public function show() {
        return $this->belongsTo(Show::class);
    }

    public function videos() {
        return $this->hasMany(ShowVideo::class);
    }
}
