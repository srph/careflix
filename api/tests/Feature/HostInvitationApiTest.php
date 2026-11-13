<?php

namespace Tests\Feature;

use App\Party;
use App\PartyInvitation;
use App\Show;
use App\ShowVideo;
use App\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Laravel\Passport\Passport;
use Tests\TestCase;

class HostInvitationApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
        ]);
        DB::purge('sqlite');
        $this->assertSame(':memory:', DB::connection()->getDatabaseName());
        $this->artisan('migrate', ['--force' => true]);
        Event::fake();
    }

    private function user($name)
    {
        return User::create(['name' => $name, 'email' => $name . '@example.test',
            'password' => 'fixture-password', 'is_admin' => false, 'is_online' => false])->fresh();
    }

    private function party($host, array $members = [], $lastActivity = null)
    {
        $show = Show::forceCreate(['title' => 'Host invitation movie', 'title_type' => 'movie']);
        $video = ShowVideo::forceCreate(['show_id' => $show->id, 'duration' => 7200, 'video_url' => 'https://example.test/video.mp4']);
        $party = Party::create(['creator_id' => $host->id, 'show_video_id' => $video->id,
            'is_playing' => false, 'is_expired' => false, 'current_time' => 0,
            'last_activity_at' => $lastActivity ?: now()]);
        foreach (array_merge([$host], $members) as $member) $party->members()->attach($member->id, ['is_active' => false]);
        return $party;
    }

    public function test_recents_are_unique_previous_co_watchers_in_recency_order()
    {
        $host = $this->user('Host');
        $member = $this->user('Member');
        $older = $this->user('Older');
        $recent = $this->user('Recent');
        $this->user('Stranger');
        $room = $this->party($host, [$member]);
        $this->party($host, [$older, $member], Carbon::now()->subDays(2));
        $this->party($host, [$recent], Carbon::now()->subDay());
        $this->party($host, [$older], Carbon::now()->subDays(3));
        Passport::actingAs($host);

        $response = $this->getJson('/api/parties/' . $room->id . '/invitations/search')->assertOk();
        $this->assertSame([$recent->id, $older->id], array_column($response->json(), 'id'));
        $this->assertArrayNotHasKey('email', $response->json()[0]);
    }

    public function test_search_finds_people_outside_recents_and_treats_wildcards_literally()
    {
        $host = $this->user('Host');
        $person = $this->user('Percent%Friend');
        $this->user('PercentOther');
        $room = $this->party($host);
        Passport::actingAs($host);
        $base = '/api/parties/' . $room->id . '/invitations/search?search=';
        $this->getJson($base . rawurlencode('%'))->assertOk()->assertJsonCount(1)->assertJson([['id' => $person->id]]);
        $this->getJson($base . rawurlencode('percent%friend@example'))->assertOk()->assertJsonCount(1);
        $this->getJson($base . str_repeat('a', 101))->assertStatus(422);
    }

    public function test_duplicate_send_returns_the_same_pending_invitation_without_duplicate_events()
    {
        $host = $this->user('Host');
        $recipient = $this->user('Recipient');
        $room = $this->party($host);
        Passport::actingAs($host);
        $url = '/api/parties/' . $room->id . '/invitations/send';
        $first = $this->postJson($url, ['recipient_id' => $recipient->id])->assertOk()->json();
        $second = $this->postJson($url, ['recipient_id' => $recipient->id])->assertOk()->json();
        $this->assertSame($first['id'], $second['id']);
        $this->assertSame($first['expires_at'], $second['expires_at']);
        $this->assertSame(1, PartyInvitation::count());
        Event::assertDispatched(\App\Events\PartyInvitationSent::class, 1);
        Event::assertDispatched(\App\Events\UserInvitationReceived::class, 1);
        $this->postJson($url, ['recipient_id' => $host->id])->assertStatus(422);
    }

    public function test_latest_history_survives_reload_and_reinvites_get_a_new_deadline()
    {
        $host = $this->user('Host');
        $recipient = $this->user('Recipient');
        $expiredPerson = $this->user('Expired');
        $room = $this->party($host);
        Passport::actingAs($host);
        $url = '/api/parties/' . $room->id . '/invitations';
        $first = $this->postJson($url . '/send', ['recipient_id' => $recipient->id])->assertOk()->json();
        PartyInvitation::find($first['id'])->update(['action' => 'declined']);
        $this->getJson($url)->assertOk()->assertJson([['id' => $first['id'], 'action' => 'declined']]);
        $second = $this->postJson($url . '/send', ['recipient_id' => $recipient->id])->assertOk()->json();
        $this->assertNotSame($first['id'], $second['id']);
        $expired = $this->postJson($url . '/send', ['recipient_id' => $expiredPerson->id])->assertOk()->json();
        PartyInvitation::find($expired['id'])->update(['expires_at' => Carbon::now()->subMinute()]);
        $this->getJson($url)->assertOk()->assertJsonCount(2)->assertJson([['id' => $second['id']], ['id' => $expired['id']]]);
        $third = $this->postJson($url . '/send', ['recipient_id' => $expiredPerson->id])->assertOk()->json();
        $this->assertNotSame($expired['id'], $third['id']);
        $this->assertTrue(Carbon::parse($third['expires_at'])->greaterThan(Carbon::now()->addMinutes(29)));
    }

    public function test_only_room_members_can_search_read_send_or_cancel()
    {
        $host = $this->user('Host');
        $recipient = $this->user('Recipient');
        $stranger = $this->user('Stranger');
        $member = $this->user('Member');
        $room = $this->party($host, [$member]);
        $url = '/api/parties/' . $room->id . '/invitations';
        Passport::actingAs($host);
        $invitation = $this->postJson($url . '/send', ['recipient_id' => $recipient->id])->assertOk()->json();
        Passport::actingAs($stranger);
        $this->getJson($url)->assertStatus(403);
        $this->getJson($url . '/search')->assertStatus(403);
        $this->postJson($url . '/send', ['recipient_id' => $recipient->id])->assertStatus(403);
        $this->postJson('/api/invitations/' . $invitation['id'] . '/cancel')->assertStatus(403);
        Passport::actingAs($recipient);
        $this->postJson('/api/invitations/' . $invitation['id'] . '/cancel')->assertStatus(403);
        Passport::actingAs($member);
        $this->postJson('/api/invitations/' . $invitation['id'] . '/cancel')->assertOk()->assertJson(['action' => 'cancelled']);
    }
}
