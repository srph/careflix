# Care.tv

Care.tv makes it easy to watch movies and TV shows together with people you care about, no matter how far apart — synced playback, live chat, and party invitations in one shared "watch party" room.

## Tech stack

- **API** (`api/`) — PHP / Laravel, authenticated via Laravel Passport, real-time events via Pusher. See [api/AGENTS.md](api/AGENTS.md).
- **UI** (`ui/`) — React + TypeScript, bundled with Parcel, routed with React Router. See [ui/AGENTS.md](ui/AGENTS.md).

The two are deployed and run independently — the UI talks to the API over HTTP/OAuth and subscribes to Pusher channels for real-time sync.

## Commands

```bash
make install   # composer + npm dependencies, copies .env.example -> .env
make start     # API on :8000 and UI on :1234, together (Ctrl-C stops both)
```

Per side: `make install-api`, `make install-ui`, `make start-api`, `make start-ui`.

The Makefile routes PHP through `valet php` / `valet composer` and Node through
`nvm use` (per `ui/.nvmrc`), falling back to `PATH` when either is missing.

`make install` stops at dependencies — it prints the remaining database steps
(`migrate`, `db:seed`, `passport:install`) to run by hand.
