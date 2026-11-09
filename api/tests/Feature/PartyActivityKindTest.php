<?php

namespace Tests\Feature;

use App\Party;
use App\PartyActivity;
use App\Show;
use App\ShowVideo;
use App\User;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\Passport;
use Tests\TestCase;

class PartyActivityKindTest extends TestCase
{
    private function useMemoryDatabase()
    {
        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
            'telescope.storage.database.connection' => 'sqlite',
            'telescope.enabled' => false
        ]);
        DB::purge('sqlite');
        $this->assertSame(':memory:', DB::connection()->getDatabaseName());
    }

    private function room()
    {
        $this->useMemoryDatabase();
        $this->artisan('migrate', ['--force' => true]);
        // A null broadcaster keeps Pusher out without faking the model events that assign join codes.
        config(['broadcasting.default' => 'null']);
        $host = User::create(['name' => 'Kier', 'email' => 'kier@example.test', 'password' => 'fixture-password', 'is_admin' => false, 'is_online' => false]);
        $show = Show::forceCreate(['title' => 'Activity movie', 'title_type' => 'movie']);
        $video = ShowVideo::forceCreate(['show_id' => $show->id, 'duration' => 7200, 'video_url' => 'https://example.test/movie.mp4']);
        Passport::actingAs($host);
        $party = Party::find($this->postJson('/api/parties', ['show_video_id' => $video->id])->assertOk()->json('id'));
        return [$party, $host];
    }

    private function latest(Party $party)
    {
        return PartyActivity::where('party_id', $party->id)->orderBy('id', 'desc')->first();
    }

    public function test_creating_a_room_records_its_kind()
    {
        list($party) = $this->room();
        $this->assertSame('created', $this->latest($party)->kind);
        $this->assertNull($this->latest($party)->meta);
    }

    public function test_play_pause_and_seek_record_kind_and_movie_time()
    {
        list($party) = $this->room();

        $this->putJson("/api/parties/{$party->id}/state", ['is_playing' => true, 'current_time' => 0])->assertOk();
        $this->assertSame(['played', ['seconds' => 0]], [$this->latest($party)->kind, $this->latest($party)->meta]);

        $this->putJson("/api/parties/{$party->id}/state", ['is_playing' => false, 'current_time' => 2472])->assertOk();
        $this->assertSame(['paused', ['seconds' => 2472]], [$this->latest($party)->kind, $this->latest($party)->meta]);

        // Seeking keeps the play state, and remembers where the room was so clients can tell the direction.
        $this->putJson("/api/parties/{$party->id}/state", ['is_playing' => false, 'current_time' => 2327])->assertOk();
        $this->assertSame(['seeked', ['seconds' => 2327, 'from_seconds' => 2472]], [$this->latest($party)->kind, $this->latest($party)->meta]);
        $this->assertSame('seeked to 00:38:47', $this->latest($party)->text);

        $log = $this->getJson("/api/parties/{$party->id}/logs")->assertOk()->json();
        $this->assertSame('seeked', end($log)['activity']['kind']);
        $this->assertSame(['seconds' => 2327, 'from_seconds' => 2472], end($log)['activity']['meta']);
    }

    public function test_joining_with_the_code_records_its_kind()
    {
        list($party) = $this->room();
        $guest = User::create(['name' => 'Leo', 'email' => 'leo@example.test', 'password' => 'fixture-password', 'is_admin' => false, 'is_online' => false]);
        Passport::actingAs($guest);
        $this->postJson("/api/party-codes/{$party->join_code}/join")->assertOk();
        $this->assertSame('joined_code', $this->latest($party)->kind);
    }

    public function test_migration_recovers_kind_and_movie_time_from_older_rows()
    {
        $this->useMemoryDatabase();
        $this->artisan('migrate:install');
        $migration = database_path('migrations/2026_11_10_000000_add_kind_and_meta_to_party_log_activities.php');
        app('migrator')->run(array_values(array_diff(glob(database_path('migrations/*.php')), [$migration])));

        $rows = [
            'created the room' => ['created', null],
            'joined the room' => ['joined', null],
            'joined the room with the code' => ['joined_code', null],
            'accepted the invitation' => ['accepted', null],
            'paused the video (00:41:12)' => ['paused', ['seconds' => 2472]],
            'played the video (01:02:03)' => ['played', ['seconds' => 3723]],
            'paused the video' => ['paused', null],
            'seeked to 00:38:47' => ['seeked', ['seconds' => 2327]],
            'switched to Season 1: Pilot' => ['switched', null],
            'did something unexpected' => [null, null]
        ];
        foreach (array_keys($rows) as $text) {
            DB::table('party_log_activities')->insert(['party_id' => 1, 'user_id' => 1, 'text' => $text]);
        }
        app('migrator')->run([$migration]);

        foreach (DB::table('party_log_activities')->orderBy('id')->get() as $row) {
            list($kind, $meta) = $rows[$row->text];
            $this->assertSame($kind, $row->kind, $row->text);
            $this->assertSame($meta, $row->meta === null ? null : json_decode($row->meta, true), $row->text);
        }
    }
}
