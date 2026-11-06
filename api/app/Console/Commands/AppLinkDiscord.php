<?php

namespace App\Console\Commands;

use App\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AppLinkDiscord extends Command
{
    protected $signature = 'app:link-discord {user : Existing Care.tv user ID} {discord_id : Discord user ID}';

    protected $description = 'Explicitly link an existing Care.tv account to Discord, preserving its history and permissions';

    public function handle()
    {
        $discordId = (string) $this->argument('discord_id');
        if (!preg_match('/^[0-9]{17,20}$/', $discordId)) {
            $this->error('Use the numeric Discord user ID (17–20 digits).');
            return 1;
        }

        return DB::transaction(function () use ($discordId) {
            $user = User::whereKey($this->argument('user'))->lockForUpdate()->first();
            if (!$user || ($user->discord_id && $user->discord_id !== $discordId) ||
                User::where('discord_id', $discordId)->where('id', '!=', $user->id)->exists()) {
                $this->error('Account not found, or one of these accounts is already linked. No changes made.');
                return 1;
            }

            $user->discord_id = $discordId;
            $user->save();
            $this->info('Discord linked to Care.tv user ' . $user->id . '.');
            return 0;
        });
    }
}
