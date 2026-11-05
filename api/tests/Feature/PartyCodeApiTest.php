<?php

namespace Tests\Feature;

use App\Party;
use App\PartyInvitation;
use App\Show;
use App\ShowVideo;
use App\ShowGroup;
use App\User;
use App\Events\PartyInvitationAccepted;
use App\Events\PartyInvitationDeclined;
use App\Events\PartyLogEvent;
use App\Events\PartyMemberJoined;
use App\Events\UserInvitationsResolved;
use App\Events\PartyVideoChanged;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Laravel\Passport\Passport;
use Tests\TestCase;

class PartyCodeApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
            'telescope.storage.database.connection' => 'sqlite',
            'telescope.enabled' => false
        ]);
        DB::purge('sqlite');
        $this->assertSame(':memory:', DB::connection()->getDatabaseName());
        $this->artisan('migrate', ['--force' => true]);
        Event::fake([PartyInvitationAccepted::class, PartyInvitationDeclined::class, PartyLogEvent::class, PartyMemberJoined::class, UserInvitationsResolved::class, PartyVideoChanged::class]);
    }

    private function fixture($authenticated = true)
    {
        $creator = User::create(['name' => 'Kier', 'email' => 'creator@example.test', 'password' => 'fixture-password', 'is_admin' => false, 'is_online' => false]);
        $viewer = User::create(['name' => 'Joyce', 'email' => 'viewer@example.test', 'password' => 'fixture-password', 'is_admin' => false, 'is_online' => false]);
        $show = Show::forceCreate(['title' => 'Code movie', 'title_type' => 'movie', 'preview_image' => 'https://example.test/poster.jpg']);
        $video = ShowVideo::forceCreate(['show_id' => $show->id, 'duration' => 7200, 'video_url' => 'https://example.test/movie.mp4']);
        $party = Party::create(['join_code' => '012345', 'creator_id' => $creator->id, 'show_video_id' => $video->id, 'is_playing' => false, 'is_expired' => false, 'current_time' => 120, 'last_activity_at' => Carbon::now()->subMonths(5)]);
        $party->members()->attach($creator->id, ['is_active' => false]);
        if ($authenticated) Passport::actingAs($viewer);
        return [$party, $viewer, $creator];
    }

    private function invite($party, $viewer, $creator, array $attributes = [])
    {
        return PartyInvitation::create(array_merge([
            'party_id' => $party->id, 'recipient_id' => $viewer->id, 'sender_id' => $creator->id,
            'invitation_code' => 'fixture-invitation', 'action' => 'pending', 'duration' => 1800,
            'expires_at' => Carbon::now()->addMinutes(30)
        ], $attributes));
    }

    public function test_lookup_and_join_require_authentication()
    {
        $this->fixture(false);
        $this->getJson('/api/party-codes/012345')->assertStatus(401);
        $this->postJson('/api/party-codes/012345/join')->assertStatus(401);
    }

    public function test_preview_is_limited_and_does_not_grant_membership()
    {
        list($party, $viewer, $creator) = $this->fixture();
        $this->getJson('/api/parties/'.$party->id)->assertStatus(403);
        $response = $this->getJson('/api/party-codes/012345')->assertOk()->assertJson([
            'creator' => ['id' => $creator->id, 'name' => 'Kier'], 'is_member' => false,
            'current_time' => 120, 'is_playing' => false, 'video' => ['show' => ['title' => 'Code movie']]
        ]);
        $json = $response->getContent();
        foreach (['video_url', 'subtitle_url', 'email', 'password', 'invitations', 'join_code'] as $private) {
            $this->assertStringNotContainsString('"'.$private.'"', $json);
        }
        $this->assertStringContainsString('no-store', $response->headers->get('Cache-Control'));
        $this->assertFalse($viewer->isMemberOfParty($party));
        $creator->update(['name' => 'New name']);
        $this->getJson('/api/party-codes/012345')->assertJson(['creator' => ['name' => 'New name']]);
        $party->update(['creator_id' => null]);
        $this->getJson('/api/party-codes/012345')->assertJson(['creator' => null]);
    }

    public function test_unknown_and_malformed_codes_do_not_resolve()
    {
        $this->fixture();
        foreach (['999999', '12345', '1234567', 'abcdef'] as $code) {
            $this->getJson('/api/party-codes/'.$code)->assertStatus(404);
            $this->postJson('/api/party-codes/'.$code.'/join')->assertStatus(404);
        }
    }

    public function test_old_empty_party_can_be_joined_repeatedly_with_one_membership_and_activity()
    {
        list($party, $viewer) = $this->fixture();
        $this->postJson('/api/party-codes/012345/join')->assertOk()->assertJson(['id' => $party->id, 'join_code' => '012345']);
        $this->postJson('/api/party-codes/012345/join')->assertOk();
        $this->getJson('/api/party-codes/012345')->assertJson(['is_member' => true]);
        $this->getJson('/api/parties/'.$party->id)->assertOk()->assertJson(['join_code' => '012345']);
        $this->assertSame(1, $party->members()->where('user_id', $viewer->id)->count());
        $this->assertSame(1, DB::table('party_log_activities')->where('party_id', $party->id)->where('text', 'joined the room with the code')->count());
        Event::assertDispatched(PartyMemberJoined::class, 1);
        Event::assertDispatched(PartyLogEvent::class, 1);
    }

    public function test_code_join_resolves_only_active_invitations_for_this_recipient()
    {
        list($party, $viewer, $creator) = $this->fixture();
        $otherParty = Party::create(['show_video_id' => $party->show_video_id, 'is_playing' => false, 'is_expired' => false, 'current_time' => 0, 'last_activity_at' => now()]);
        $same = $this->invite($party, $viewer, $creator);
        $other = $this->invite($otherParty, $viewer, $creator);
        $legacy = $this->invite($party, $viewer, $creator, ['action' => null]);
        $expired = $this->invite($party, $viewer, $creator, ['expires_at' => Carbon::now()->subMinute()]);
        $cancelled = $this->invite($party, $viewer, $creator, ['action' => 'cancelled']);
        $otherRecipient = $this->invite($party, $creator, $viewer);
        $this->postJson('/api/party-codes/012345/join')->assertOk()->assertJson([
            'accepted_invitation_ids' => [$same->id, $legacy->id], 'declined_invitation_ids' => [$other->id]
        ]);
        $this->assertSame('accepted', $same->fresh()->action);
        $this->assertSame('accepted', $legacy->fresh()->action);
        $this->assertSame('declined', $other->fresh()->action);
        $this->assertSame('pending', $expired->fresh()->action);
        $this->assertSame('cancelled', $cancelled->fresh()->action);
        $this->assertSame('pending', $otherRecipient->fresh()->action);
        Event::assertDispatched(UserInvitationsResolved::class, function ($event) use ($same, $legacy, $other) {
            return $event->invitation_ids === [$same->id, $legacy->id, $other->id];
        });
        Event::assertDispatched(PartyInvitationAccepted::class, 2);
        Event::assertDispatched(PartyInvitationDeclined::class, 1);
        $this->postJson('/api/invitations/'.$same->id.'/accept')->assertStatus(403);
        $this->postJson('/api/invitations/'.$same->id.'/decline')->assertStatus(403);
        $this->assertSame(1, $party->members()->where('user_id', $viewer->id)->count());
    }

    public function test_invitation_accept_then_code_open_does_not_add_another_activity()
    {
        list($party, $viewer, $creator) = $this->fixture();
        $invitation = $this->invite($party, $viewer, $creator);
        $this->postJson('/api/invitations/'.$invitation->id.'/accept')->assertOk();
        $this->postJson('/api/party-codes/012345/join')->assertOk();
        $this->assertSame(1, $party->logs()->count());
        $this->assertSame(1, $party->members()->where('user_id', $viewer->id)->count());
        Event::assertDispatched(PartyMemberJoined::class, 1);
    }

    public function test_failed_join_rolls_back_membership_and_invitation_changes()
    {
        list($party, $viewer, $creator) = $this->fixture();
        $invite = $this->invite($party, $viewer, $creator);
        DB::statement('DROP TABLE party_log_activities');
        $this->postJson('/api/party-codes/012345/join')->assertStatus(500);
        $this->assertFalse($viewer->isMemberOfParty($party));
        $this->assertSame('pending', $invite->fresh()->action);
        Event::assertNotDispatched(PartyMemberJoined::class);
        Event::assertNotDispatched(UserInvitationsResolved::class);
    }

    public function test_party_creation_records_the_creator_and_a_unique_code()
    {
        list($party, $viewer) = $this->fixture();
        $first = $this->postJson('/api/parties', ['show_video_id' => $party->show_video_id])->assertOk();
        $second = $this->postJson('/api/parties', ['show_video_id' => $party->show_video_id])->assertOk();
        $first->assertJson(['creator_id' => $viewer->id, 'creator' => ['id' => $viewer->id, 'name' => 'Joyce']]);
        $this->assertRegExp('/^[0-9]{6}$/', $first->json('join_code'));
        $this->assertNotSame($first->json('join_code'), $second->json('join_code'));
        $this->assertSame(1, Party::find($first->json('id'))->members()->count());
        $this->assertArrayNotHasKey('join_code', $party->toArray());
    }

    public function test_members_cannot_be_sent_another_invitation()
    {
        list($party, $viewer, $creator) = $this->fixture();
        $this->postJson('/api/party-codes/012345/join')->assertOk();
        Passport::actingAs($creator);
        $this->postJson('/api/parties/'.$party->id.'/invitations/send', ['recipient_id' => $viewer->id])->assertStatus(422);
        $this->assertSame(0, PartyInvitation::where('recipient_id', $viewer->id)->count());
    }

    public function test_changing_video_preserves_the_code_and_creator_in_the_room_response()
    {
        list($party, $viewer, $creator) = $this->fixture();
        Passport::actingAs($creator);
        $group = ShowGroup::forceCreate(['show_id' => $party->video->show_id, 'title' => 'Season 1']);
        $video = ShowVideo::forceCreate(['show_id' => $party->video->show_id, 'show_group_id' => $group->id, 'title' => 'Next episode', 'duration' => 1800, 'video_url' => 'https://example.test/episode.mp4']);
        $this->putJson('/api/parties/'.$party->id.'/change-video', ['show_video_id' => $video->id])
            ->assertOk()->assertJson(['join_code' => '012345', 'creator' => ['id' => $creator->id], 'show_video_id' => $video->id]);
    }

    public function test_code_lookup_uses_the_api_rate_limit()
    {
        $this->fixture();
        for ($attempt = 0; $attempt < 60; $attempt++) {
            $this->getJson('/api/party-codes/999999')->assertStatus(404);
        }
        $this->getJson('/api/party-codes/999999')->assertStatus(429);
    }
}
