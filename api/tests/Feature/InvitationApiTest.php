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

class InvitationApiTest extends TestCase
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
    }

    private function invitation($action = 'pending', $expired = false)
    {
        $sender = User::create(['name' => 'Sender', 'email' => 'sender@example.test', 'password' => 'fixture-password', 'is_admin' => false, 'is_online' => false]);
        $recipient = User::create(['name' => 'Recipient', 'email' => 'recipient@example.test', 'password' => 'fixture-password', 'is_admin' => false, 'is_online' => false]);
        $show = Show::forceCreate(['title' => 'Invitation movie', 'title_type' => 'movie']);
        $video = ShowVideo::forceCreate(['show_id' => $show->id, 'duration' => 7200, 'video_url' => 'https://example.test/video.mp4']);
        $party = Party::create(['show_video_id' => $video->id, 'is_playing' => false, 'is_expired' => false, 'current_time' => 120, 'last_activity_at' => now()]);
        $party->members()->attach($sender->id, ['is_active' => false]);
        $invitation = PartyInvitation::create([
            'party_id' => $party->id, 'sender_id' => $sender->id, 'recipient_id' => $recipient->id,
            'invitation_code' => 'fixture-invite', 'duration' => 1800, 'action' => $action,
            'expires_at' => $expired ? Carbon::now()->subMinute() : Carbon::now()->addMinutes(30)
        ]);
        $recipient = $recipient->fresh();
        Passport::actingAs($recipient);
        Event::fake();
        return [$invitation, $party, $recipient];
    }

    public function test_expired_invitation_cannot_be_accepted_or_declined()
    {
        list($invitation, $party, $recipient) = $this->invitation('pending', true);
        $this->postJson('/api/invitations/' . $invitation->id . '/accept')->assertStatus(403);
        $this->postJson('/api/invitations/' . $invitation->id . '/decline')->assertStatus(403);
        $this->assertFalse($recipient->isMemberOfParty($party));
        $this->assertSame('pending', $invitation->fresh()->action);
    }

    public function test_accept_adds_membership_once_and_preserves_the_stored_action()
    {
        list($invitation, $party, $recipient) = $this->invitation();
        $this->assertTrue(Carbon::parse($invitation->fresh()->expires_at)->isFuture());
        $this->assertStringEndsWith('+08:00', $invitation->fresh()->expires_at);
        $this->assertTrue($recipient->isRecipientOf($invitation->fresh()), 'Recipient must match');
        $response = $this->postJson('/api/invitations/' . $invitation->id . '/accept');
        $this->assertSame(200, $response->status(), $response->getContent());
        $response->assertJson(['id' => $party->id]);
        $this->assertSame('accepted', $invitation->fresh()->action);
        $this->assertTrue($recipient->isMemberOfParty($party));
        $this->postJson('/api/invitations/' . $invitation->id . '/accept')->assertStatus(403);
        $this->assertSame(1, $party->members()->where('user_id', $recipient->id)->count());
    }

    public function test_withdrawn_invitation_cannot_be_accepted()
    {
        list($invitation) = $this->invitation('cancelled');
        $this->postJson('/api/invitations/' . $invitation->id . '/accept')->assertStatus(403);
    }

    public function test_another_user_cannot_accept_the_invitation()
    {
        list($invitation) = $this->invitation();
        $other = User::create(['name' => 'Other', 'email' => 'other@example.test', 'password' => 'fixture-password', 'is_admin' => false, 'is_online' => false]);
        Passport::actingAs($other->fresh());
        $this->postJson('/api/invitations/' . $invitation->id . '/accept')->assertStatus(403);
        $this->assertSame('pending', $invitation->fresh()->action);
    }

    public function test_legacy_pending_invitation_can_still_be_declined()
    {
        list($invitation) = $this->invitation(null);
        $this->postJson('/api/invitations/' . $invitation->id . '/decline')->assertOk();
        $this->assertSame('declined', $invitation->fresh()->action);
    }
}
