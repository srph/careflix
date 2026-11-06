<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuthLoginTicketsTable extends Migration
{
    public function up()
    {
        Schema::create('auth_login_tickets', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->unsignedBigInteger('user_id');
            $table->string('purpose', 16);
            $table->string('challenge', 64);
            $table->timestamp('expires_at')->index();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('auth_login_tickets');
    }
}
