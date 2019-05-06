<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('user.invitation.{user}', function ($user, User $receiver) {
    return $user->id === $receiver->id;
});

Broadcast::channel('party.{party}', function ($user, Party $party) {
    return $user->isMemberOfParty($party);
});