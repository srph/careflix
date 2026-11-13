<?php

namespace Tests\Feature;

use App\Auth\DiscordProvider;
use App\Support\DiscordLogin;
use App\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\ClientRepository;
use Laravel\Passport\Passport;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as DiscordUser;
use Tests\TestCase;

class DiscordAuthTest extends TestCase
{
    private $verifier;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:',
            'config.request_access_code' => '', 'services.discord.client_id' => 'test-client',
            'services.discord.client_secret' => 'test-secret',
            'services.discord.redirect' => 'http://localhost/auth/discord/callback',
            'services.discord.frontend_url' => 'https://tv.example.test',
        ]);
        DB::purge('sqlite');
        $this->artisan('migrate', ['--force' => true]);
        app(ClientRepository::class)->createPersonalAccessClient(null, 'Care.tv tests', 'http://localhost');
        $this->verifier = str_repeat('a', 64);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function member($verified = false)
    {
        return User::forceCreate([
            'name' => 'Discord Viewer', 'discord_id' => '123456789012345678',
            'email' => null, 'password' => null, 'is_admin' => false, 'is_online' => false,
            'request_access_verified_at' => $verified ? now() : null,
        ]);
    }

    private function credentials($user, $purpose = 'handoff', $verifier = null)
    {
        $secret = $verifier ?: $this->verifier;
        return [
            'ticket' => app(DiscordLogin::class)->ticket($user, $purpose, hash('sha256', $secret)),
            'verifier' => $secret,
        ];
    }

    public function test_empty_gate_issues_a_real_passport_token_without_recording_code_verification()
    {
        $user = $this->member();
        $response = $this->postJson('/api/auth/discord/exchange', $this->credentials($user));
        $response->assertOk()->assertJson(['requires_request_access' => false]);
        $this->assertNotEmpty($response->json('access_token'));
        $this->assertNull($user->fresh()->request_access);
        $this->assertNull($user->fresh()->request_access_verified_at);
        $this->getJson('/api/me', ['Authorization' => 'Bearer ' . $response->json('access_token')])->assertOk()->assertJson(['id' => $user->id]);
    }

    public function test_whitespace_gate_is_also_disabled()
    {
        config(['config.request_access_code' => '   ']);
        $this->postJson('/api/auth/discord/exchange', $this->credentials($this->member()))
            ->assertOk()->assertJson(['requires_request_access' => false]);
    }

    public function test_existing_members_are_grandfathered_by_the_migration()
    {
        $legacy = User::where('email', 'admin@admin.com')->firstOrFail();
        $this->assertNotNull($legacy->request_access_verified_at);
        $this->assertNull($legacy->request_access);
        $this->assertNull($legacy->discord_id);
    }

    public function test_request_code_attempts_have_their_own_rate_limit()
    {
        config(['config.request_access_code' => 'PRIVATE']);
        $credentials = $this->credentials($this->member(), 'onboarding');
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/auth/request', $credentials + ['request_access' => 'wrong'])->assertStatus(422);
        }
        $this->postJson('/api/auth/request', $credentials + ['request_access' => 'wrong'])->assertStatus(429);
    }

    public function test_unverified_user_receives_only_an_onboarding_ticket_then_can_retry_the_code()
    {
        config(['config.request_access_code' => 'FRIENDS-2026']);
        $user = $this->member();
        $response = $this->postJson('/api/auth/discord/exchange', $this->credentials($user));
        $response->assertOk()->assertJson(['requires_request_access' => true]);
        $this->assertArrayNotHasKey('access_token', $response->json());
        $this->assertSame(0, DB::table('oauth_access_tokens')->count());
        $ticket = ['ticket' => $response->json('onboarding_ticket'), 'verifier' => $this->verifier];
        $this->getJson('/api/me', ['Authorization' => 'Bearer ' . $ticket['ticket']])->assertStatus(401);
        $this->postJson('/api/auth/request', $ticket + ['request_access' => 'wrong'])->assertStatus(422)->assertJsonValidationErrors('request_access');
        $this->assertNull($user->fresh()->request_access_verified_at);
        $accepted = $this->postJson('/api/auth/request', $ticket + ['request_access' => 'FRIENDS-2026']);
        $accepted->assertOk()->assertJson(['requires_request_access' => false]);
        $this->assertSame('FRIENDS-2026', $user->fresh()->request_access);
        $this->assertNotNull($user->fresh()->request_access_verified_at);
        $this->assertArrayNotHasKey('request_access', $accepted->json('user'));
        $this->postJson('/api/auth/request', $ticket + ['request_access' => 'FRIENDS-2026'])->assertStatus(422);
    }

    public function test_verified_users_skip_the_gate_after_the_code_rotates()
    {
        config(['config.request_access_code' => 'NEW-CODE']);
        $this->postJson('/api/auth/discord/exchange', $this->credentials($this->member(true)))
            ->assertOk()->assertJson(['requires_request_access' => false]);
    }

    public function test_gate_can_be_disabled_while_onboarding_without_marking_user_verified()
    {
        $user = $this->member();
        $this->postJson('/api/auth/request', $this->credentials($user, 'onboarding'))->assertOk();
        $this->assertNull($user->fresh()->request_access_verified_at);
    }

    public function test_tickets_are_bound_to_browser_expire_and_are_single_use()
    {
        $credentials = $this->credentials($this->member());
        $this->postJson('/api/auth/discord/exchange', array_merge($credentials, ['verifier' => str_repeat('b', 64)]))->assertStatus(422);
        $this->postJson('/api/auth/discord/exchange', $credentials)->assertOk();
        $this->postJson('/api/auth/discord/exchange', $credentials)->assertStatus(422);
        $expired = $this->credentials(User::where('discord_id', '123456789012345678')->first());
        Carbon::setTestNow(now()->addMinutes(3));
        $this->postJson('/api/auth/discord/exchange', $expired)->assertStatus(422);
    }

    public function test_ticket_purposes_cannot_be_swapped()
    {
        $user = $this->member();
        $this->postJson('/api/auth/request', $this->credentials($user))->assertStatus(422);
        $this->postJson('/api/auth/discord/exchange', $this->credentials($user, 'onboarding'))->assertStatus(422);
    }

    public function test_gate_protects_existing_api_tokens_and_broadcast_authorization()
    {
        $user = $this->member();
        config(['config.request_access_code' => 'PRIVATE']);
        Passport::actingAs($user);
        $this->getJson('/api/shows')->assertStatus(403)->assertJson(['error' => 'request_access_required']);
        $this->postJson('/broadcasting/auth', ['channel_name' => 'presence-chat', 'socket_id' => '1.2'])->assertStatus(403)
            ->assertJson(['error' => 'request_access_required']);
    }

    public function test_logout_revokes_the_token_in_the_database()
    {
        $user = $this->member();
        $result = app(DiscordLogin::class)->session($user);
        $this->postJson('/api/logout', [], ['Authorization' => 'Bearer ' . $result['access_token']])->assertOk();
        $this->assertSame(1, (int) DB::table('oauth_access_tokens')->value('revoked'));
    }

    public function test_old_password_login_and_registration_are_unavailable()
    {
        $this->postJson('/oauth/token', ['grant_type' => 'password'])->assertStatus(404);
        $this->postJson('/api/register', [])->assertStatus(404);
    }

    public function test_discord_redirect_and_callback_use_socialite_state_and_current_api()
    {
        $redirect = $this->get('/auth/discord?challenge=' . hash('sha256', $this->verifier));
        $redirect->assertStatus(302);
        $this->assertSame('discord.com', parse_url($redirect->headers->get('Location'), PHP_URL_HOST));
        parse_str(parse_url($redirect->headers->get('Location'), PHP_URL_QUERY), $query);
        $this->assertStringContainsString('email', $query['scope']);
        $provider = Socialite::driver('discord');
        $this->assertInstanceOf(DiscordProvider::class, $provider);
        $provider->setHttpClient(new Client(['handler' => HandlerStack::create(new MockHandler([
            new Response(200, [], json_encode(['access_token' => 'discord-only-token', 'token_type' => 'Bearer', 'expires_in' => 3600])),
            new Response(200, [], json_encode([
                'id' => '987654321098765432', 'username' => 'viewer', 'global_name' => 'Movie Friend',
                'discriminator' => '0', 'email' => 'friend@example.test', 'verified' => true, 'avatar' => null,
            ])),
        ]))]));
        $callback = $this->get('/auth/discord/callback?code=discord-code&state=' . $query['state']);
        $callback->assertStatus(302);
        $location = $callback->headers->get('Location');
        $this->assertStringStartsWith('https://tv.example.test/auth/callback?code=', $location);
        $this->assertStringNotContainsString('discord-only-token', $location);
        $user = User::where('discord_id', '987654321098765432')->firstOrFail();
        $this->assertSame('Movie Friend', $user->name);
        $this->assertSame('viewer', $user->discord_username);
        $this->assertSame('friend@example.test', $user->email);
        $this->assertNotNull($user->email_verified_at);
        $this->assertFalse((bool) $user->is_admin);
    }

    public function test_invalid_state_and_cancelled_consent_return_to_frontend_without_creating_user()
    {
        $count = User::count();
        $this->withSession(['discord_challenge' => hash('sha256', $this->verifier), 'state' => 'expected'])
            ->get('/auth/discord/callback?code=x&state=wrong')->assertRedirect('https://tv.example.test/auth/callback?error=expired');
        $this->withSession(['discord_challenge' => hash('sha256', $this->verifier), 'state' => 'expected'])
            ->get('/auth/discord/callback?error=access_denied')->assertRedirect('https://tv.example.test/auth/callback?error=cancelled');
        $this->assertSame($count, User::count());
    }

    public function test_email_matching_does_not_merge_legacy_accounts_and_explicit_linking_preserves_them()
    {
        $legacy = User::create(['name' => 'Legacy', 'email' => 'legacy@example.test', 'password' => 'old', 'is_admin' => true]);
        $profile = (new DiscordUser)->setRaw(['verified' => true, 'global_name' => 'Discord Name', 'avatar' => null])
            ->map(['id' => '456789012345678901', 'name' => 'Discord Name', 'nickname' => 'discordname', 'email' => $legacy->email]);
        try {
            app(DiscordLogin::class)->resolveUser($profile);
            $this->fail('An email match must require explicit linking.');
        } catch (\App\Exceptions\DiscordAccountRequiresLinking $exception) {
            $this->assertNull($legacy->fresh()->discord_id);
        }
        $this->artisan('app:link-discord', ['user' => $legacy->id, 'discord_id' => '456789012345678901'])->assertExitCode(0);
        $resolved = app(DiscordLogin::class)->resolveUser($profile);
        $this->assertSame($legacy->id, $resolved->id);
        $this->assertTrue((bool) $resolved->is_admin);
    }

    public function test_missing_discord_email_is_supported_and_unverified_email_stays_unverified()
    {
        $profile = (new DiscordUser)->setRaw(['avatar' => null])->map(['id' => '456789012345678901', 'nickname' => 'viewer']);
        $user = app(DiscordLogin::class)->resolveUser($profile);
        $this->assertNull($user->email);
        $profile->email = 'unverified@example.test';
        $this->assertNull(app(DiscordLogin::class)->resolveUser($profile)->email_verified_at);
    }
}
