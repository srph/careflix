<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PartyMessage extends Model
{
    public function log() {
        return $this->morphOne(PartyLog::class, 'loggable');
    }
}
