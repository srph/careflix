<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddDiscordAccessToUsers extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
            $table->string('password')->nullable()->change();
            $table->string('discord_id', 20)->nullable()->unique();
            $table->string('discord_username')->nullable();
            $table->string('request_access')->nullable();
            $table->timestamp('request_access_verified_at')->nullable();
        });

        // Existing members retain access when the optional gate is enabled.
        DB::table('users')->update(['request_access_verified_at' => now()]);
    }

    public function down()
    {
        if (DB::table('users')->whereNull('email')->orWhereNull('password')->exists()) {
            throw new RuntimeException('Link or remove Discord-only accounts before restoring required email/password columns.');
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_discord_id_unique');
            $table->dropColumn(['discord_id', 'discord_username', 'request_access', 'request_access_verified_at']);
            $table->string('email')->nullable(false)->change();
            $table->string('password')->nullable(false)->change();
        });
    }
}
