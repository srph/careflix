<?php

namespace App\Auth;

class DiscordProvider extends \SocialiteProviders\Discord\Provider
{
    // The Laravel 5.8-compatible adapter predates Discord's current API URLs
    // and usernames. Keep its OAuth/state handling while updating that mapping.
    protected function getAuthUrl($state)
    {
        return $this->buildAuthUrlFromBase('https://discord.com/oauth2/authorize', $state);
    }

    protected function getTokenUrl()
    {
        return 'https://discord.com/api/oauth2/token';
    }

    protected function getUserByToken($token)
    {
        $response = $this->getHttpClient()->get('https://discord.com/api/v10/users/@me', [
            'headers' => ['Authorization' => 'Bearer ' . $token],
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    protected function mapUserToObject(array $user)
    {
        return parent::mapUserToObject($user)->map([
            'nickname' => $user['username'],
            'name' => $user['global_name'] ?? $user['username'],
        ]);
    }
}
