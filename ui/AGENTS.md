# Care.tv UI

React/TypeScript front-end for Care.tv — the watch party experience (synced video playback, chat, invitations) served against the [api](../api).

## Versions

- Vite `8.3.5` with `@vitejs/plugin-react` `6.2.0`; entry point `index.html`, configuration in `vite.config.ts`.
- React / React DOM `19.3.1` with `createRoot`, native document titles, and the automatic JSX transform (primarily hooks-based)
- React Router `8.5.1` with `createBrowserRouter`, layout outlets, and `useBlocker` for leave-party confirmation
- TypeScript `7.0.2`, targeting `ES2022`, bundler module resolution, path alias `~/` → `src/` (see `tsconfig.json`). Preserve the existing non-strict checking policy during the migration.
- Node `v26.13.0` LTS (pinned in `.nvmrc`, run `nvm install && nvm use`), npm `>=11` per `package.json` `engines`.

Base UI `1.9.0` supplies Dialog, Tooltip, and Slider; Motion `14.9.0` supplies animations. Chat uses a native textarea with CSS auto-sizing and a scrollable fallback. `InfiniteScroll` and the migrated hook helpers live in this repository.

Legacy date-fns `1.30.1` is retained under the `date-fns-v1` npm alias to preserve existing date behavior without conflicting with Base UI's optional date-fns v4 peer. Keep existing date imports on that alias unless a separate date-library migration is requested.

### State management

No Redux/MobX/Recoil. State is React Context + `useReducer` per feature area, e.g.:

- `contexts/auth/auth.tsx` — auth/session state
- `screens/app.watch/Context` — the active watch party (see `usePartyContext`)
- `screens/app.watch.home/index.tsx` — local player state (time, playing, volume, subtitles) via a single `useReducer`

Real-time updates (party sync, chat, invitations) arrive over Pusher (`lib/pusher`) and get dispatched into these reducers.

The authenticated home listing uses `@tanstack/react-query` through the wrapper hooks in
`screens/app.home/app-home-queries.ts`. The shared provider in `lib/query` sets a 60-second
stale time and replaces the cache when the authenticated account changes. Other
screens retain their existing fetching patterns. `SeasonSelection` accepts optional
externally fetched groups so the listing's details modal can use Query without
changing the watch room's data flow.

## File structure

```
src/
├── assets/       static audio/image assets
├── components/   shared, reusable UI (Ui* prefix for design-system primitives)
├── contexts/     app-wide React Context providers (e.g. Auth)
├── hooks/        shared hooks (useMediaMode, useFullscreen, etc.)
├── lib/          thin wrappers around third-party integrations (axios, pusher, uuid, srt2obj)
├── screens/      route-level screens, named by route path with `.` as a nesting separator
│                 (e.g. `app.watch.home` = child of `app.watch` = child of `app`);
│                 each screen folder holds its own subcomponents, styles, and local hooks
├── types/        ambient/global TypeScript types
└── utils/        pure helper functions, grouped by domain (api, date, dom, shows)
```

## Coding standards

Older code is still being migrated; follow these in new and touched files.

- **Files are kebab-case:** `key-castr.tsx`, `use-now.ts`. Screen folders keep `.` for route nesting (`app.watch.home`).
- **No barrel files (`index.ts`).** Import the file that defines the thing.
- **Named exports where you can.** A file's main export is named after it: `app-home-listing-show-card.tsx` → `AppHomeListingShowCard`.
- **Imports:** `~/` reaches anywhere in `src`. A relative path may go down into folders (`./stuff/types.ts`) and up one level at most (`../types.ts`); past that (`../../types.ts`), use `~/`.
- **Shared components** get a folder of their own: `components/key-castr/key-castr.tsx`.
- **A screen's entrypoint is its page:** `app.watch/app-watch-page.tsx` → `AppWatchPage`.
- **A screen's own parts are prefixed with the screen's name**, so it's clear at a glance what goes where: `app.home/app-home-auth.tsx`. A part with 3 or more files gets a folder, one level deep at most: `app.home/app-home-listing/app-home-listing-search.tsx`.
- **Tests sit next to the file** (`use-now.test.ts`) and select by role, text, label or `data-testid`, never class name. Expose state as `data-*` attributes.
- **Run Prettier** on files you change; it also sorts Tailwind classes.

## Styling

Tailwind `4.3.5` classes; tokens, keyframes and the focus ring live in `src/tailwind.css`.

- **Colours:** primary `pink-500`, focus `pink-700`, soft pink text `pink-300`, error `rose-400`, live `rose-500`, green `emerald-300`, blue `sky-500`, yellow `amber-300`. `neutral-*` holds Tailwind's taupe values.
- **Focus ring:** one global rule gives every focused control a `pink-700` ring, 3px out. Only change its offset where a parent would clip it.
- **Small caps labels:** `font-label text-xs font-bold tracking-label uppercase`.
- **Placeholders:** `placeholder:text-neutral-500`.
- **Text:** body is 14px (`text-sm` on `body`) with a 20px line. Add `leading-none` where line height does nothing (buttons, chips, icons, single-line labels).
- **Easings:** `ease-out-soft` is the house curve. `utils/motion.ts` mirrors the `ease-*` tokens for Motion.
- **Scale:** snap to Tailwind's default spacing, radius and font sizes; `text-10`, `text-11` and `text-13` are the only extras.
- **Mobile-first only:** no `max-*` variants.

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
cp .env.example .env   # set VITE_API_BASE_URL, VITE_PUSHER_*
npm start               # Vite dev server, http://localhost:8484
npm run typecheck       # tsc --noEmit
npm run lint            # oxlint, run by hand; never part of build
npm test                # focused Vitest/React Testing Library suite
npm run build            # typecheck + Vite production build (public/ files copied into dist)
npm run preview          # serve the production build on :8484
npm run test:e2e          # Playwright smoke tests; first run npx playwright install
```

Existing unprefixed local environment variables remain supported through an explicit allowlist in Vite configuration. New configuration uses `VITE_*`; Pusher server secrets belong only in the API.

See [TESTING.md](TESTING.md) for cross-browser projects, production-preview checks, and opt-in live two-account verification.

## Authentication

Discord login starts with a full navigation to `/auth/discord`. The browser keeps a random verifier in sessionStorage and sends only its SHA-256 challenge to Laravel. `/auth/callback` exchanges the handoff code with the verifier; `/onboarding` uses only a restricted onboarding ticket until the optional code passes. The former `/request-access` URL redirects to `/onboarding`. Never add OAuth client secrets to browser configuration.

Keep callback and onboarding routes outside the account-keyed Query/Pusher providers: those providers remount when the account changes. Axios interceptors remain around all routes and initialize before requests. The full Passport token is stored in `app_token` with the server’s expiration; logout revokes it on the API. See [../AUTHENTICATION.md](../AUTHENTICATION.md).
