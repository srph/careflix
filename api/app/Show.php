<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Show extends Model
{
    public function genres() {
        return $this->belongsToMany(Genre::class);
    }
    
    public function groups() {
        return $this->belongsTo(ShowGroup::class);
    }

    public function videos() {
        return $this->belongsTo(ShowVideo::class);
    }
}
