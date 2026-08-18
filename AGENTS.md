# Care.tv

Care.tv makes it easy to watch movies and TV shows together with people you care about, no matter how far apart — synced playback, live chat, and party invitations in one shared "watch party" room.

## Tech stack

- **API** (`api/`) — PHP / Laravel, authenticated via Laravel Passport, real-time events via Pusher. See [api/AGENTS.md](api/AGENTS.md).
- **UI** (`ui/`) — React + TypeScript, bundled with Parcel, routed with React Router. See [ui/AGENTS.md](ui/AGENTS.md).

The two are deployed and run independently — the UI talks to the API over HTTP/OAuth and subscribes to Pusher channels for real-time sync.

## Commands

```bash
# API — from api/
composer install
php artisan serve

# UI — from ui/
npm install
npm start
```
