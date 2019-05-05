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
            $table->integer('show_id');
            $table->integer('show_group_id')->nullable();
            $table->string('preview_image')->nullable();
            $table->string('video_url');
            $table->string('title')->nullable();
            $table->integer('duration');
            $table->string('synopsis')->nullable();
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