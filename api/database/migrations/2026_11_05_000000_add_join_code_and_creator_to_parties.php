<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddJoinCodeAndCreatorToParties extends Migration
{
    public function up()
    {
        Schema::table('parties', function (Blueprint $table) {
            $table->char('join_code', 6)->nullable()->unique();
            $table->unsignedBigInteger('creator_id')->nullable();
            $table->foreign('creator_id')->references('id')->on('users')->onDelete('set null');
        });

        // Query the tables directly: migrations must not depend on model events or eager loads.
        DB::table('parties')->orderBy('id')->chunkById(200, function ($parties) {
            foreach ($parties as $party) {
                do {
                    $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                } while (DB::table('parties')->where('join_code', $code)->exists());

                $creator = DB::table('party_log_activities')
                    ->join('users', 'users.id', '=', 'party_log_activities.user_id')
                    ->where('party_id', $party->id)
                    ->where('text', 'created the room')
                    ->orderBy('party_log_activities.id')
                    ->value('users.id');

                DB::table('parties')->where('id', $party->id)->update([
                    'join_code' => $code,
                    'creator_id' => $creator
                ]);
            }
        });
    }

    public function down()
    {
        Schema::table('parties', function (Blueprint $table) {
            $table->dropForeign(['creator_id']);
            $table->dropUnique(['join_code']);
            $table->dropColumn(['join_code', 'creator_id']);
        });
    }
}
