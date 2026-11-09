<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddKindAndMetaToPartyLogActivities extends Migration
{
    public function up()
    {
        Schema::table('party_log_activities', function (Blueprint $table) {
            $table->string('kind', 32)->nullable()->index();
            $table->json('meta')->nullable();
        });

        // Read the tables directly: migrations must not depend on model casts or eager loads.
        DB::table('party_log_activities')->orderBy('id')->chunkById(500, function ($activities) {
            foreach ($activities as $activity) {
                list($kind, $meta) = $this->parse($activity->text);
                if ($kind === null) continue;
                DB::table('party_log_activities')->where('id', $activity->id)->update([
                    'kind' => $kind,
                    'meta' => $meta === null ? null : json_encode($meta)
                ]);
            }
        });
    }

    public function down()
    {
        Schema::table('party_log_activities', function (Blueprint $table) {
            $table->dropIndex(['kind']);
            $table->dropColumn(['kind', 'meta']);
        });
    }

    /**
     * Older rows only kept a sentence, so recover what each one described from its wording.
     */
    private function parse($text)
    {
        $exact = [
            'created the room' => 'created',
            'joined the room' => 'joined',
            'joined the room with the code' => 'joined_code',
            'accepted the invitation' => 'accepted'
        ];
        if (isset($exact[$text])) return [$exact[$text], null];

        $time = '(\d+):(\d{2}):(\d{2})';
        if (preg_match("/^(paused|played) the video(?: \\($time\\))?$/", $text, $match)) {
            $meta = isset($match[2]) ? ['seconds' => $match[2] * 3600 + $match[3] * 60 + $match[4]] : null;
            return [$match[1], $meta];
        }
        if (preg_match("/^seeked to $time$/", $text, $match)) {
            return ['seeked', ['seconds' => $match[1] * 3600 + $match[2] * 60 + $match[3]]];
        }
        if (strpos($text, 'switched to ') === 0) return ['switched', null];

        return [null, null];
    }
}
