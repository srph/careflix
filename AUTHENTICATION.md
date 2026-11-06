# Discord authentication

Care.tv uses Discord login through Socialite and Passport tokens for API access.

## Setup

Set these values in `api/.env`:

```dotenv
APP_URL=http://localhost:8000
APP_FRONTEND_URL=http://localhost:8484
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=http://localhost:8000/auth/discord/callback
APP_REQUEST_ACCESS_CODE=
```

Create a Discord application and add the exact `DISCORD_REDIRECT_URI` to its
OAuth2 redirects. No bot or server membership is needed.

From `api/`, install dependencies and prepare the database:

```bash
valet composer install
valet php artisan migrate
valet php artisan passport:install
```

To reset the database, use `migrate:fresh` instead of `migrate`. This deletes
existing data. Run `passport:install` afterward to recreate its clients.

Set `VITE_API_BASE_URL=http://localhost:8000` and the public `VITE_PUSHER_*`
values in `ui/.env`. Keep Discord secrets and Passport credentials in the API.
Run both the API and UI with `make start`.

For Tailscale, use the same HTTPS hostname for `APP_FRONTEND_URL` and the
Discord callback, ending the callback with `/auth/discord/callback`. Register
that callback in Discord and keep the API running at `VITE_API_BASE_URL`.

## Access code

Leave `APP_REQUEST_ACCESS_CODE` empty to allow anyone to sign in. Set it to
require users to enter the code once.

## Production

Set these values in `api/.env`:

```dotenv
APP_URL=https://tv-api.kierb.com
APP_FRONTEND_URL=https://tv.kierb.com
DISCORD_REDIRECT_URI=https://tv-api.kierb.com/auth/discord/callback
SESSION_SECURE_COOKIE=true
```

Register the production callback in Discord. Use persistent session storage,
keep Passport signing keys, and leave `SESSION_DOMAIN` unset.

Build the UI with `VITE_API_BASE_URL=https://tv-api.kierb.com`.
