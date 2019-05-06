<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PartyLog extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'loggable_type',
        'loggable_id'
    ];

    /**
     * The relationships that will always be eager-loaded
     *
     * @var array
     */
    protected $with = [
        'loggable'
    ];


    public function party() {
        return $this->belongsTo(Party::class);
    }

    public function loggable() {
        return $this->morphTo();
    }
}
