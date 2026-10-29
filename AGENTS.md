# Care.tv

Care.tv makes it easy to watch movies and TV shows together with people you care about, no matter how far apart — synced playback, live chat, and party invitations in one shared "watch party" room.

## Tech stack

- **API** (`api/`) — PHP / Laravel, authenticated via Laravel Passport, real-time events via Pusher. See [api/AGENTS.md](api/AGENTS.md).
- **UI** (`ui/`) — React + TypeScript, bundled with Parcel, routed with React Router. See [ui/AGENTS.md](ui/AGENTS.md).

The two are deployed and run independently — the UI talks to the API over HTTP/OAuth and subscribes to Pusher channels for real-time sync.

## Commands

```bash
make install   # composer + npm dependencies, copies .env.example -> .env
make start     # starts Docker MySQL, then API on :8000 and web on :1234
make start:api # API only
make start:db  # Docker MySQL 5.7 on 127.0.0.1:3307; root/root, database tv
make start:web # web only
```

`make start` waits for MySQL to be healthy before starting the servers. Ctrl-C
stops both dev servers; MySQL stays running. Use `docker compose stop db` to
stop it; data persists in a named Docker volume.

Per-side install: `make install-api`, `make install-ui`. The original
`make start-api` and `make start-ui` commands remain available as aliases.

The Makefile routes PHP through `valet php` / `valet composer` and Node through
`nvm use` (per `ui/.nvmrc`), falling back to `PATH` when either is missing.

`make install` stops at dependencies — it prints the remaining database steps
(`migrate`, `db:seed`, `passport:install`) to run by hand.
