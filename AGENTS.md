# Care.tv

Care.tv makes it easy to watch movies and TV shows together with people you care about, no matter how far apart — synced playback, live chat, and party invitations in one shared "watch party" room.

## Tech stack

- **API** (`api/`) — PHP / Laravel, authenticated via Laravel Passport, real-time events via Pusher. See [api/AGENTS.md](api/AGENTS.md).
- **UI** (`ui/`) — React + TypeScript, bundled with Vite, routed with React Router. See [ui/AGENTS.md](ui/AGENTS.md).

The two are deployed and run independently — the UI talks to the API over HTTP/OAuth and subscribes to Pusher channels for real-time sync.

## Commands

```bash
make install   # composer + npm dependencies, copies .env.example -> .env
make start     # starts Docker MySQL, then API on :8000 and web on :1234
make start:api # API only
make start:db  # Docker MySQL 5.7 on 127.0.0.1:3307; root/root, database tv
make start:web # web only
```
