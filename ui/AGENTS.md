# Care.tv UI

React/TypeScript front-end for Care.tv — the watch party experience (synced video playback, chat, invitations) served against the [api](../api).

## Versions

- Parcel `^1.12.3` (Parcel 1, not the newer Parcel 2/3 config format — no `parcel.config.js`, just `npm start` / `npm run build` against `src/index.html`)
- React `^16.11.0` (class-free, hooks-based)
- React Router `^5.0.0` (`react-router-dom`, `<Switch>`/`<Route>` API, not the v6 data router)
- TypeScript `^3.4.5`, targeting `es5`, path alias `~` → `src/*` (see `tsconfig.json`)
- Node `v11.15.0` (pinned in `.nvmrc`, run `nvm use`), npm `>=6.7.0` per `package.json` `engines`

### State management

No Redux/MobX/Recoil. State is React Context + `useReducer` per feature area, e.g.:

- `contexts/Auth` — auth/session state
- `screens/app.watch/Context` — the active watch party (see `usePartyContext`)
- `screens/app.watch.home/index.tsx` — local player state (time, playing, volume, subtitles) via a single `useReducer`

Real-time updates (party sync, chat, invitations) arrive over Pusher (`lib/pusher`) and get dispatched into these reducers.

## File structure

```
src/
├── assets/       static audio/image assets
├── components/   shared, reusable UI (Ui* prefix for design-system primitives)
├── contexts/     app-wide React Context providers (e.g. Auth)
├── hooks/        shared hooks (useMediaMode, useFullscreen, etc.)
├── lib/          thin wrappers around third-party integrations (axios, pusher, history, uuid, srt2obj)
├── screens/      route-level screens, named by route path with `.` as a nesting separator
│                 (e.g. `app.watch.home` = child of `app.watch` = child of `app`);
│                 each screen folder holds its own subcomponents, styles, and local hooks
├── types/        ambient/global TypeScript types
└── utils/        pure helper functions, grouped by domain (api, date, dom, shows)
```

## Video player

There's no video library (no video.js/hls.js) — it's a plain HTML5 `<video>` element (`screens/app.watch.home/index.tsx`) with fully custom React-built chrome:

- `PlayerModal` — controls overlay (play/pause, seek, volume, fullscreen, chat toggle, subtitle toggle, episode selection)
- `PlayerSeeker`, `VolumeControl`, `PlayerTooltip` — individual control widgets
- `SubtitleSlot` — renders subtitles parsed client-side from a `.srt` via `lib/srt2obj`
- `usePlayerHotkeys` — keyboard shortcuts (space, arrows, f, m, etc.)

Playback is kept in sync across party members by dispatching local player actions to the API, which re-broadcasts `PartyState`/`PartyVideoChanged` events over Pusher; the reducer in `screens/app.watch.home/index.tsx` applies incoming `sync`/`change-video` actions by imperatively setting `$video.current.currentTime`, `.play()`/`.pause()`, etc. on the video ref.

## Commands

```bash
npm install
cp .env.example .env   # set API_BASE_URL, API_CLIENT_*, PUSHER_*
npm start               # Parcel dev server, http://localhost:3000
npm run typecheck       # tsc --noEmit
npm run build            # typecheck + parcel build + copy netlify/_redirects into dist
```
