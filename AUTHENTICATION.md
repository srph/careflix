# Discord authentication

Care.tv uses Socialite to verify Discord identities and Passport personal access
tokens to authenticate the independently served React app. Password login,
`/oauth/token`, and `/api/register` are no longer exposed.

## Setup

Run `valet composer install` from `api/`, then set these API environment values:

```dotenv
APP_URL=http://localhost:8000
APP_FRONTEND_URL=http://localhost:8484
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=http://localhost:8000/auth/discord/callback
APP_REQUEST_ACCESS_CODE=
```

Create a Discord application and register `DISCORD_REDIRECT_URI` exactly in its
OAuth2 redirect list. Only the `identify` and `email` scopes are requested; a bot
or Discord server membership is not required. Email is optional, and is marked
verified only when Discord reports `verified: true`.

From `api/`, run:

```bash
valet php artisan migrate
# Fresh installations only: creates signing keys and a personal access client.
valet php artisan passport:install
# Existing installations without a personal access client:
valet php artisan passport:client --personal --name="Care.tv"
```

Retain existing Passport signing keys on an existing installation. A working
personal access client is needed to issue tokens; its credentials remain in the
API database. No Passport client ID or secret belongs in the frontend.

Set `VITE_API_BASE_URL` and the public `VITE_PUSHER_*` values in `ui/.env`. Remove
old `VITE_API_CLIENT_ID`, `VITE_API_CLIENT_SECRET`, `API_CLIENT_ID`, and
`API_CLIENT_SECRET` values. Vite exposes only explicitly allowed public settings.
The development proxy forwards `/api`, `/auth/discord`, and `/broadcasting` to the
API; React owns `/auth/callback`.

Use the same hostname throughout a login. For a Tailscale development URL, set
both `APP_FRONTEND_URL` and the registered `DISCORD_REDIRECT_URI` to that HTTPS host,
with `/auth/discord/callback` on the latter. The Vite proxy preserves the browser's
origin for Socialite's session cookie.

The API must also be running at the URL configured in `VITE_API_BASE_URL` (or
legacy `API_BASE_URL`). For example, a target of `http://localhost:8485` needs
`valet php artisan serve --host=127.0.0.1 --port=8485` from `api/`. Sharing the
Vite server alone does not start the API. Register the Tailscale callback in
Discord before testing from another device; a localhost callback sends that
device back to its own localhost and does not retain the Tailscale session.

## Production

```dotenv
APP_URL=https://tv-api.kierb.com
APP_FRONTEND_URL=https://tv.kierb.com
DISCORD_REDIRECT_URI=https://tv-api.kierb.com/auth/discord/callback
SESSION_SECURE_COOKIE=true
```

Set `VITE_API_BASE_URL=https://tv-api.kierb.com` when building the UI. Register the
production callback in Discord, retain a persistent Laravel session driver, and
leave `SESSION_DOMAIN` unset for a cookie scoped to the API host. Socialite uses
a SameSite=Lax session cookie for OAuth state. Cross-origin API calls use bearer
tokens and do not need that cookie or a shared cookie domain.

## Existing accounts

The migration preserves users and their relationships and grandfathers existing
users through the access gate. Before switching an existing member to Discord,
explicitly link their numeric Discord user ID to their Care.tv user ID:

```bash
valet php artisan app:list-users
valet php artisan app:link-discord USER_ID DISCORD_USER_ID
```

Copy the Discord ID using Discord's Developer Mode. The command refuses missing
users and conflicting links. It preserves the user ID, history, and admin flag;
the next login refreshes profile details from Discord. Matching email addresses
never silently merge accounts. An email collision returns an account-linking
message instead of creating a duplicate or taking over the existing account.

## Flow and endpoints

1. React generates a random verifier in tab-scoped sessionStorage and navigates
   to `GET /auth/discord?challenge=SHA256(verifier)`.
2. Socialite redirects to Discord and validates OAuth state on
   `GET /auth/discord/callback`. Laravel resolves the local user by Discord ID.
3. Laravel redirects to the fixed frontend `/auth/callback` with a handoff code.
   React immediately removes it from the address bar and sends it with the
   verifier to `POST /api/auth/discord/exchange`.
4. Eligible users receive a 30-day Passport token and their user data. Unverified
   users receive only an onboarding ticket and see `/request-access`.
5. `POST /api/auth/request` accepts `ticket`, `verifier`, and `request_access`.
   Successful verification records the raw code and timestamp and issues the
   normal token. Wrong codes can be retried within the ticket's lifetime.
6. React stores the token in `app_token` with the server's expiration and sends
   it in the Authorization header for API requests and Pusher authorization.
   Reload restores the user through `GET /api/me`.
7. `POST /api/logout` revokes the current Passport token; the frontend clears
   its cookie and onboarding state.

Handoff codes expire after two minutes; onboarding tickets after fifteen. Only
their hashes are stored in `auth_login_tickets`. Redemption checks the verifier
and purpose under a database row lock, and consumes successful tickets once.
Expired tickets are pruned when a new ticket is created. Authentication routes
have separate rate-limit buckets, including five access submissions per minute.
No Discord access/refresh tokens are persisted or sent to React.

## Optional access code

An empty or whitespace-only `APP_REQUEST_ACCESS_CODE` fully bypasses the step.
Skipping does not populate `request_access` or `request_access_verified_at`.
When configured, unverified users must enter the exact code once. The raw code
is bookkeeping and is excluded from serialized user responses. Verification
persists across later code rotations.

Enabling the gate later also restricts users who joined while it was disabled.
API routes and Pusher authorization enforce the current setting, including for
previously issued tokens. Such users sign in again to obtain an onboarding
ticket. Logout remains available without passing the gate.

## Verification

From `api/`: `valet php vendor/bin/phpunit`. The suite uses isolated in-memory
SQLite; Discord HTTP calls are mocked while Socialite state validation and
Passport issuance run for real. From `ui/`: `npm test`, `npm run build`, and
`npm exec -- playwright test e2e/migration.spec.ts`. Browser tests use controlled
HTTP responses and verify desktop/mobile layout, callback recovery, access-code
retry/reload, session restoration, logout, and reduced motion.

A live Discord consent round trip needs real application credentials and a
registered callback. Mocked tests do not establish that external configuration.
