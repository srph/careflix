<?php

namespace Tests\Feature;

use App\Party;
use App\Show;
use App\ShowGroup;
use App\ShowVideo;
use App\User;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ListingApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // These tests never use or reset the developer's MySQL database.
        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
            'telescope.storage.database.connection' => 'sqlite',
            'telescope.enabled' => false
        ]);
        DB::purge('sqlite');
        $this->assertSame('sqlite', DB::getDefaultConnection());
        $this->assertSame(':memory:', DB::connection()->getDatabaseName());
        $this->artisan('migrate', ['--force' => true]);
    }

    private function viewer($name = 'Viewer')
    {
        return User::create(['name' => $name, 'email' => strtolower($name) . '@example.test', 'password' => 'fixture-password', 'is_admin' => false, 'is_online' => false]);
    }

    private function title($name, $type = 'movie')
    {
        $show = Show::forceCreate(['title' => $name, 'title_type' => $type]);
        $video = ShowVideo::forceCreate(['show_id' => $show->id, 'duration' => 7200, 'video_url' => 'https://example.test/video.mp4']);
        return [$show, $video];
    }

    private function party($viewer, $video, $activity)
    {
        $party = Party::create(['show_video_id' => $video->id, 'is_playing' => false, 'is_expired' => false, 'current_time' => 120, 'last_activity_at' => $activity]);
        $party->members()->attach($viewer->id, ['is_active' => false]);
        return $party;
    }

    public function test_catalog_filters_and_paginates_the_full_catalog()
    {
        Passport::actingAs($this->viewer());
        list($first) = $this->title('Starfield');
        list($second, $movie) = $this->title('Starlight');
        list($series) = $this->title('Star series', 'series');
        ShowGroup::forceCreate(['show_id' => $series->id, 'title' => 'Season 1']);

        $this->getJson('/api/shows?q=STAR&title_type=movie&per_page=1')
            ->assertOk()->assertJsonFragment(['total' => 2, 'last_page' => 2])
            ->assertJson(['data' => [0 => ['id' => $second->id]]])->assertJson(['data' => [0 => ['movie' => ['id' => $movie->id]]]]);
        $this->getJson('/api/shows?q=STAR&title_type=movie&per_page=1&page=2')
            ->assertOk()->assertJson(['data' => [0 => ['id' => $first->id]]]);
        $this->getJson('/api/shows?title_type=series')
            ->assertOk()->assertJson(['data' => [0 => ['groups_count' => 1]]])->assertJson(['data' => [0 => ['movie' => null]]]);
        $this->getJson('/api/shows')->assertOk()->assertJsonFragment(['per_page' => 30, 'total' => 3]);
    }

    public function test_search_treats_wildcards_as_literal_text_and_validates_parameters()
    {
        Passport::actingAs($this->viewer());
        $this->title('100% Care');
        $this->title('Another movie');
        $this->getJson('/api/shows?q=%25')->assertOk()->assertJsonFragment(['total' => 1]);
        $this->getJson('/api/shows?q=missing')->assertOk()->assertJsonFragment(['total' => 0]);
        $this->getJson('/api/shows?title_type=invalid&per_page=1000')->assertStatus(422);
        $this->getJson('/api/shows?q[]=bad')->assertStatus(422);
        $this->getJson('/api/me/parties?per_page=0')->assertStatus(422);
    }

    public function test_party_history_is_member_scoped_searchable_and_ordered()
    {
        $viewer = $this->viewer();
        $other = $this->viewer('Other');
        list($show, $video) = $this->title('Shared title');
        list($another, $otherVideo) = $this->title('Another title');
        $older = $this->party($viewer, $video, '2026-01-01 00:00:00');
        $recent = $this->party($viewer, $otherVideo, '2026-02-01 00:00:00');
        $private = $this->party($other, $video, '2026-03-01 00:00:00');
        // The old banner's dismissal is not a history deletion.
        $older->members()->updateExistingPivot($viewer->id, ['is_dismissed' => true]);
        Passport::actingAs($viewer);

        $this->getJson('/api/me/parties?per_page=1')->assertOk()
            ->assertJsonFragment(['total' => 2])->assertJson(['data' => [0 => ['id' => $recent->id, 'last_activity_at' => '2026-02-01T00:00:00+08:00']]]);
        $this->getJson('/api/me/parties?per_page=1&page=2')->assertOk()->assertJson(['data' => [0 => ['id' => $older->id]]]);
        $this->getJson('/api/me/parties?q=shared')->assertOk()
            ->assertJsonFragment(['total' => 1])->assertJson(['data' => [0 => ['id' => $older->id]]])
            ->assertJson(['data' => [0 => ['video' => ['show' => ['id' => $show->id]]]]])
            ->assertJson(['data' => [0 => ['members' => [0 => ['id' => $viewer->id]]]]]);
    }

    public function test_listing_endpoints_require_authentication()
    {
        $this->getJson('/api/shows')->assertStatus(401);
        $this->getJson('/api/me/parties')->assertStatus(401);
    }

    public function test_title_party_history_filters_before_pagination_and_keeps_membership_private()
    {
        $viewer = $this->viewer();
        $other = $this->viewer('Other');
        list($show, $video) = $this->title('Selected title');
        list($another, $otherVideo) = $this->title('Other title');
        $older = $this->party($viewer, $video, '2026-01-01 00:00:00');
        $newer = $this->party($viewer, $video, '2026-02-01 00:00:00');
        $this->party($viewer, $otherVideo, '2026-03-01 00:00:00');
        $this->party($other, $video, '2026-04-01 00:00:00');
        Passport::actingAs($viewer);

        $this->getJson('/api/me/parties?show_id=' . $show->id . '&per_page=1')
            ->assertOk()->assertJsonFragment(['total' => 2, 'last_page' => 2])
            ->assertJson(['data' => [0 => ['id' => $newer->id]]]);
        $this->getJson('/api/me/parties?show_id=' . $show->id . '&per_page=1&page=2')
            ->assertOk()->assertJson(['data' => [0 => ['id' => $older->id]]]);
        $this->getJson('/api/me/parties?show_id=' . $show->id . '&q=other')
            ->assertOk()->assertJsonFragment(['total' => 0]);
        $this->getJson('/api/me/parties?show_id=99999')->assertOk()->assertJsonFragment(['total' => 0]);
        $this->getJson('/api/me/parties?show_id[]=bad')->assertStatus(422);
        $this->getJson('/api/me/parties?show_id=0')->assertStatus(422);
    }
}
