<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShowVideosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('show_videos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('show_group_id');
            $table->string('title');
            $table->string('url');
            $table->integer('duration');
            $table->string('synposis')->nullable();
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
        Schema::dropIfExists('show_videos');
    }
}