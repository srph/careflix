<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PartyCodeMigrationTest extends TestCase
{
    public function test_existing_parties_receive_distinct_codes_and_only_documented_creators()
    {
        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
        ]);
        DB::purge('sqlite');
        $this->assertSame(':memory:', DB::connection()->getDatabaseName());
        $this->artisan('migrate:install');
        $migration = database_path('migrations/2026_11_05_000000_add_join_code_and_creator_to_parties.php');
        $previous = array_values(array_diff(glob(database_path('migrations/*.php')), [$migration]));
        app('migrator')->run($previous);

        $creator = DB::table('users')->insertGetId(['name' => 'Original creator', 'email' => 'creator@example.test', 'password' => 'fixture', 'is_admin' => false]);
        $firstMember = DB::table('users')->insertGetId(['name' => 'First member', 'email' => 'member@example.test', 'password' => 'fixture', 'is_admin' => false]);
        $partyData = ['show_video_id' => 1, 'is_playing' => false, 'is_expired' => false, 'current_time' => 0, 'last_activity_at' => now()];
        $documented = DB::table('parties')->insertGetId($partyData);
        $unknown = DB::table('parties')->insertGetId($partyData);
        // A membership is not evidence of authorship, even if it was inserted first.
        DB::table('party_user')->insert(['party_id' => $documented, 'user_id' => $firstMember, 'is_active' => false]);
        DB::table('party_log_activities')->insert(['party_id' => $documented, 'user_id' => $creator, 'text' => 'created the room']);
        DB::table('party_user')->insert(['party_id' => $unknown, 'user_id' => $firstMember, 'is_active' => false]);
        app('migrator')->run([$migration]);

        $parties = DB::table('parties')->orderBy('id')->get();
        $this->assertSame((int) $creator, (int) $parties[0]->creator_id);
        $this->assertNull($parties[1]->creator_id);
        foreach ($parties as $party) $this->assertRegExp('/^[0-9]{6}$/', $party->join_code);
        $this->assertNotSame($parties[0]->join_code, $parties[1]->join_code);
        $this->assertSame(0, (int) $parties[0]->current_time);
        $this->assertSame(2, DB::table('party_user')->count());
    }
}
