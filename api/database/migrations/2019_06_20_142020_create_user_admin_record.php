<?php

use App\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserAdminRecord extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // @TODO Add a prompt to change the password as soon as possible
        User::create([
            'name' => 'Tarka Ji',
            'email' => 'admin@admin.com',
            'email_verified_at' => now(),
            'password' => 'admin',
            'remember_token' => Str::random(10),
            'is_admin' => true
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // HAHA, fuck.
    }
}
