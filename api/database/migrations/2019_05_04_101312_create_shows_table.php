<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shows', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            $table->string('title_type');
            $table->string('preview_image')->nullable();
            $table->string('synopsis')->nullable();
            $table->string('language')->nullable();
            $table->datetime('air_start')->nullable();
            $table->datetime('air_end')->nullable();
            $table->string('age_rating')->nullable();
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
        Schema::dropIfExists('shows');
    }
}
