<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class DropTelescopeTables extends Migration
{
    /**
     * Telescope was removed; its tables only held recorded requests.
     */
    public function up()
    {
        Schema::dropIfExists('telescope_entries_tags');
        Schema::dropIfExists('telescope_entries');
        Schema::dropIfExists('telescope_monitoring');
    }

    public function down()
    {
        // Recorded requests are not worth restoring.
    }
}
