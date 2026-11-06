<?php

namespace App\Support;

use App\Exceptions\DiscordAccountRequiresLinking;
use App\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DiscordLogin
{
    public function resolveUser($profile)
    {
        return DB::transaction(function () use ($profile) {
            $discordId = (string) $profile->getId();
            if (!preg_match('/^[0-9]{1,20}$/', $discordId)) {
                throw new \UnexpectedValueException('Discord returned an invalid user ID.');
            }

            $user = User::where('discord_id', $discordId)->lockForUpdate()->first();
            $email = $profile->getEmail();
            $emailOwner = $email ? User::where('email', $email)->first() : null;
            if ($emailOwner && (!$user || $emailOwner->id !== $user->id)) {
                // An email match alone must not take over a legacy account.
                throw new DiscordAccountRequiresLinking;
            }

            $user = $user ?: new User(['is_admin' => false, 'is_online' => false]);
            $raw = $profile->user;
            $user->discord_id = $discordId;
            $user->discord_username = $profile->getNickname();
            $user->name = $raw['global_name'] ?? $profile->getName() ?? $profile->getNickname() ?? 'Discord member';
            $user->avatar = !empty($raw['avatar']) ? $profile->getAvatar() : null;
            $user->email = $email;
            $user->email_verified_at = $email && ($raw['verified'] ?? false) === true ? now() : null;
            $user->save();

            return $user;
        });
    }

    public function ticket(User $user, $purpose, $challenge)
    {
        $ticket = bin2hex(random_bytes(32));
        $expiresAt = now()->addSeconds($purpose === 'handoff' ? 120 : 900);
        DB::table('auth_login_tickets')->where('expires_at', '<=', now())->delete();
        DB::table('auth_login_tickets')->insert([
            'id' => hash('sha256', $ticket),
            'user_id' => $user->id,
            'purpose' => $purpose,
            'challenge' => $challenge,
            'expires_at' => $expiresAt,
        ]);

        return $ticket;
    }

    public function redeem($ticket, $verifier, $purpose, callable $complete)
    {
        return DB::transaction(function () use ($ticket, $verifier, $purpose, $complete) {
            $id = hash('sha256', $ticket);
            $record = DB::table('auth_login_tickets')->where('id', $id)->lockForUpdate()->first();
            if (!$record || $record->purpose !== $purpose || Carbon::parse($record->expires_at)->lte(now()) ||
                !hash_equals($record->challenge, hash('sha256', $verifier))) {
                throw ValidationException::withMessages(['ticket' => ['Your sign-in expired. Please continue with Discord again.']]);
            }

            $user = User::whereKey($record->user_id)->lockForUpdate()->firstOrFail();
            $result = $complete($user, $record->challenge);
            // The row lock and transaction make successful redemption single-use.
            DB::table('auth_login_tickets')->where('id', $id)->delete();

            return $result;
        });
    }

    public function session(User $user)
    {
        $result = $user->createToken('Care.tv');

        return [
            'requires_request_access' => false,
            'access_token' => $result->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => $result->token->expires_at->toIso8601String(),
            'user' => $user->load('invitations'),
        ];
    }
}
