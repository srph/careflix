<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'is_admin'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Find the user instance for the given username.
     *
     * @param  string  $username
     * @return \App\User
     */
    public function findForPassport($username)
    {
        return $this->where('email', $username)->first();
    }

    public function getAvatarAttribute($value) {
        return $value ?? 'https://caretv.sgp1.digitaloceanspaces.com/app-pulse/user-avatars/VW9tSnytYIRgAwg0.png';
    }

    public function setPasswordAttribute($value) {
        $this->attributes['password'] = bcrypt($value);
    }

    public function parties() {
        return $this->belongsToMany(Party::class)->withPivot('is_active', 'is_dismissed');
    }

    public function invitations() {
        return $this->hasMany(PartyInvitation::class, 'recipient_id')
            ->pending()
            ->with('party')
            ->orderBy('created_at');
    }

    /**
     * Search for a user by name or email
     * 
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @param  string $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch(\Illuminate\Database\Eloquent\Builder $query, $search) {
        return $query->where(function($query) use ($search) {
            $parameter = "%{$search}%";
            
            // https://stackoverflow.com/a/21216559/2698227
            $query->whereRaw('lower(name) like (?)', $parameter)
                ->orWhereRaw('lower(email) like (?)', $parameter);
        })->limit(10);
    }

    /**
     * Get all users except for the authenticated user
     * 
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @param  string $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeExceptSelf(\Illuminate\Database\Eloquent\Builder $query) {
        return $query->where('id', '!=', request()->user()->id);
    }

    /**
     * Check user is the recipient of an invitation
     */
    public function isRecipientOf(PartyInvitation $invitation) {
        return $this->id === $invitation->recipient_id;
    }

    /**
     * $user->isMemberOfParty($party);
     */
    public function isMemberOfParty(Party $party) {
        return $party->members()->where('user_id', $this->id)->exists();
    }
}
