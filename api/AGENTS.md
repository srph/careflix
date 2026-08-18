# Care.tv API

Laravel backend for Care.tv: auth, shows catalog, watch parties, chat, and invitations. Real-time sync is pushed over Pusher; the front-end (`../ui`) consumes this as an OAuth client.

## Versions

-   PHP `^7.1.3` in `composer.json` — locally run via **valet's** PHP (currently PHP 8.3 on this machine; keep that mismatch in mind if you hit compatibility issues)
-   Laravel `5.8.*` (`laravel/framework` v5.8.15 installed)
-   Laravel Passport `^7.2` (v7.2.2 installed) — OAuth2 password-grant auth for the UI
-   Pusher (`pusher/pusher-php-server` ~3.0) — broadcasts party sync, chat, and invitation events
-   MySQL `5.7` — run locally via **DBngin** (see Dev setup below)

## Preferred Dev Setup

-   Serve via **Valet** (`valet link` / `valet park`), not `php artisan serve`, for day-to-day work — `valet` gives you the `.test` domain and HTTPS.
-   Use **DBngin** for MySQL 5.7 locally instead of a system-wide install.
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

-   `PartyInvitation` ([app/PartyInvitation.php](app/PartyInvitation.php)) links a `sender` and `recipient` (both `User`) to a `Party`, with an `invitation_code`, `action` (`pending` by default via accessor fallback, or `accepted`/`declined`/`cancelled`), and `expires_at`.
-   `scopePending()` filters to non-expired invitations still awaiting a response.
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
php artisan passport:client --password
php artisan serve   # or just hit the Valet-linked domain

# Custom Artisan commands
php artisan app:list-pt [days=3]      # recent parties
php artisan app:list-users [count=15] # recent registrations
```
