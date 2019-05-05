<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PartyActivity extends Model
{
    public function log() {
        return $this->morphOne(PartyLog::class, 'loggable');
    }
}
