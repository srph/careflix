<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PartyInvitation extends Model
{
    public function sender() {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function recepient() {
        return $this->belongsTo(User::class, 'recepient_id');
    }

    public function party() {
        return $this->belongsTo('party');
    }
}
