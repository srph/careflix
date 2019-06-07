<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePartyInvitationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('party_invitations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('party_id');
            $table->integer('sender_id');
            $table->integer('recipient_id');
            $table->string('invitation_code');
            $table->string('action')->nullable();
            $table->integer('duration');
            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('party_invitations');
    }
}
