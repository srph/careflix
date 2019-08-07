<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSynopsisToTextTypeColumnInShowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shows', function (Blueprint $table) {
            $table->text('synopsis')->nullable()->change();
        });

        Schema::table('show_videos', function (Blueprint $table) {
            $table->text('synopsis')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shows', function (Blueprint $table) {
            $table->string('synopsis')->nullable()->change();
        });

        Schema::table('show_videos', function (Blueprint $table) {
            $table->text('synopsis')->nullable()->change();
        });
    }
}
