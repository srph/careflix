<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ShowVideo extends Model
{
    public function show() {
        return $this->belongsTo(Show::class);
    }

    public function group() {
        return $this->belongsTo(ShowGroup::class, 'show_group_id');
    }
}
