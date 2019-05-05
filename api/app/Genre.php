<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    public function shows() {
        return $this->belongsToMany(Show::class);
    }
}
