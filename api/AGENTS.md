# Care.tv API

Laravel backend for Care.tv: auth, shows catalog, watch parties, chat, and invitations. Real-time sync is pushed over Pusher; the front-end (`../ui`) consumes this as an OAuth client.

## Versions

-   PHP `^7.1.3` in `composer.json` — locally run via **valet's** PHP (currently PHP 8.3 on this machine; keep that mismatch in mind if you hit compatibility issues)
-   Laravel `5.8.*` (`laravel/framework` v5.8.15 installed)
-   Laravel Passport `^7.2` (v7.2.2 installed) — personal access tokens issued after Discord authentication
-   Pusher (`pusher/pusher-php-server` ~3.0) — broadcasts party sync, chat, and invitation events
-   MySQL `5.7` — run locally via **Docker Compose** (see Dev setup below)

## Preferred Dev Setup

-   From the repo root, `make start:api` serves the API on `http://localhost:8000`. **Valet** (`valet link` / `valet park`) is also available for a `.test` domain and HTTPS.
-   From the repo root, `make start:db` starts Docker MySQL 5.7 on `127.0.0.1:3307`, using database `tv` and credentials `root` / `root`. It waits for MySQL to be healthy. Data persists in a named Docker volume; `docker compose stop db` stops the service. The image uses `linux/amd64` emulation on Apple Silicon.
-   Always invoke PHP through Valet's linked version (`valet use php@...` or just let Valet's shim resolve it) rather than a bare system `php`, since the composer.json constraint (`^7.1.3`) is far older than the system PHP.
-   Config lives in `.env` (copy from `.env.example`). Key values: `APP_CDN` (where media assets live), `APP_REQUEST_ACCESS_CODE` (optional registration gate), `PUSHER_APP_*`.

## Key Domain Details

### Chat & activity log — polymorphic

Party chat and activity feed are unified through a single polymorphic log:

-   `PartyLog` ([app/PartyLog.php](app/PartyLog.php)) — has `loggable_type` / `loggable_id`, `morphTo()` into either:
    -   `PartyMessage` ([app/PartyMessage.php](app/PartyMessage.php)) — table `party_log_messages`, a chat message
    -   `PartyActivity` ([app/PartyActivity.php](app/PartyActivity.php)) — table `party_log_activities`, a system activity line (e.g. "so-and-so joined")
-   `PartyLog` appends virtual `type` (`'message'` or `'activity'`), plus `activity`/`message` accessors that resolve the polymorphic relation — so API consumers just check `type` and read the matching key, without caring about `loggable_type` internals (which are hidden from serialization).

### Invitations

- Parties have a unique permanent six-digit `join_code` (a string, including leading zeroes) and nullable `creator_id`. Creation records the signed-in creator; the migration backfills documented creators from the creation activity. Creator attribution grants the same permissions as ordinary membership.
- Authenticated `GET /api/party-codes/{code}` returns a limited preview; `POST /api/party-codes/{code}/join` joins or reopens the party. Codes are hidden from general party serialization and explicitly included in member room responses.
- `Support/JoinParty` coordinates code joins and invitation acceptance under a recipient row lock. It creates membership/activity once, accepts active invitations to that party, declines active invitations to other parties, and broadcasts `member.joined` plus `invitations.resolved` for the recipient's other clients.

-   `PartyInvitation` ([app/PartyInvitation.php](app/PartyInvitation.php)) links a `sender` and `recipient` (both `User`) to a `Party`, with an `invitation_code`, `action` (`pending` by default via accessor fallback, or `accepted`/`declined`/`cancelled`), and `expires_at`.
-   `scopePending()` filters to non-expired invitations still awaiting a response.
-   Member-only `GET /api/parties/{party}/invitations` returns the latest invitation per recipient, including outcomes and expiry. The room's `invitations` relation still contains only active pending invitations. The B5b2 host panel combines both with Pusher updates.
-   `GET /api/parties/{party}/invitations/search` without a query returns up to 20 previous co-watchers ordered by shared party activity, excluding current members and the viewer. A `search` query searches everyone by literal name/email, returns public profile fields, and is capped at 20 results. Sending is serialized with joins under the recipient row lock and reuses an existing pending invitation. Any room member may cancel an invitation; outsiders may not.
-   Broadcast via `PartyInvitationSent` / `PartyInvitationAccepted` / `PartyInvitationDeclined` / `PartyInvitationCancelled` / `UserInvitationReceived` / `UserInvitationCancelled` events (see `app/Events`).

### Movies / shows — how titles are structured

-   `Show` ([app/Show.php](app/Show.php)) is the top-level title. `title_type` is either `'movie'` or `'series'`.
    -   For a movie, the `movie` accessor (`getMovieAttribute`) returns its single `ShowVideo` directly.
    -   For a series, playable content lives under `ShowGroup`s instead.
-   `ShowGroup` ([app/ShowGroup.php](app/ShowGroup.php)) — a season, belonging to a `Show`, `hasMany` `ShowVideo`.
-   `ShowVideo` ([app/ShowVideo.php](app/ShowVideo.php)) — the actual playable file (`video_url`, `subtitle_url`, `duration`, `preview_image`). Belongs to a `Show`, and optionally to a `ShowGroup` (season) when the show is a series.
-   Genres are a `belongsToMany` on `Show` and always eager-loaded.
-   [database/seeds/ShowSeeder.php](database/seeds/ShowSeeder.php) is a hardcoded list of real titles — handy as a reference for a fully-populated `shows` row. It also uses seeder-only pseudo-types `series:append-episodes`/`series:append-season` to extend an existing series; these never hit the DB as `title_type`.

## Commands

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed && php artisan db:seed --class=ShowSeeder
php artisan passport:install
php artisan app:link-discord USER_ID DISCORD_USER_ID # existing account cutover
php artisan serve   # or just hit the Valet-linked domain

# Custom Artisan commands
php artisan app:list-pt [days=3]      # recent parties
php artisan app:list-users [count=15] # recent registrations
```

## Discord authentication

Socialite 4.4 and the Discord provider 2.x support this Laravel/PHP version. `App\Auth\DiscordProvider` updates the legacy adapter’s URLs and username mapping. `DiscordLogin` creates hashed, short-lived, browser-bound tickets and redeems them under a database row lock. Never issue a full Passport token to a user who still needs access verification.

`APP_REQUEST_ACCESS_CODE` empty or whitespace disables the gate. Otherwise `users.request_access_verified_at` controls access; `request_access` stores the raw successful code and is hidden from JSON. API routes and Pusher authorization both enforce the gate. Existing users are grandfathered by the migration and must be explicitly linked to Discord, never merged automatically by email.

See [../AUTHENTICATION.md](../AUTHENTICATION.md) for environment variables, local/production callback URLs, and cutover. Tests run with `valet php vendor/bin/phpunit`; authentication tests use in-memory SQLite and mocked Discord HTTP responses.
