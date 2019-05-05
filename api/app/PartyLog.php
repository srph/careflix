<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PartyLog extends Model
{
    public function party() {
        return $this->belongsTo(Party::class);
    }

    public function loggable() {
        return $this->morphTo();
    }
}
