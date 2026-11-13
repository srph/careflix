# Care.tv UI

React/TypeScript front-end for Care.tv — the watch party experience (synced video playback, chat, invitations) served against the [api](../api).

## Versions

- Vite `8.3.5` with `@vitejs/plugin-react` `6.2.0`; entry point `index.html`, configuration in `vite.config.ts`.
- React / React DOM `19.3.1` with `createRoot`, native document titles, and the automatic JSX transform (primarily hooks-based)
- React Router `8.5.1` with `createBrowserRouter`, layout outlets, and `useBlocker` for leave-party confirmation
- TypeScript `7.0.2`, targeting `ES2022`, bundler module resolution, path alias `~/` → `src/` (see `tsconfig.json`). `strict` is on, null checks included.
- Node `v26.13.0` LTS (pinned in `.nvmrc`, run `nvm install && nvm use`), npm `>=11` per `package.json` `engines`.

Base UI `1.9.0` supplies Dialog, Tooltip, and Slider; Motion `14.9.0` supplies animations. Chat uses a native textarea with CSS auto-sizing and a scrollable fallback. `InfiniteScroll` and the migrated hook helpers live in this repository.

Legacy date-fns `1.30.1` is retained under the `date-fns-v1` npm alias to preserve existing date behavior without conflicting with Base UI's optional date-fns v4 peer. Keep existing date imports on that alias unless a separate date-library migration is requested.

### State management

No Redux/MobX/Recoil. State is React Context + `useReducer` per feature area, e.g.:

- `lib/auth/` — everything auth: the token cookie, `signIn`/`logout` (`session.ts`), `useAuth()` (`{ status, user }`, a React Query over `/api/me`), `useAuthUser()`, the sign-in mutations, `AuthBoundary` and the route guards
- `screens/app.watch/app-watch-page.tsx` — loads the room's party with `usePartyQuery` and provides it to the room; read it with `useParty()`. Pusher events write to that query's cache.
- `screens/app.watch.home/app-watch-home-page.tsx` — the room's page: `AppWatchHomeLayout` (`useWatchLayout()`: sidebar `chat | invite | closed`, one `modal` at a time, the Activity Overlay level) around `AppWatchHomePlaya` (`usePlayaContext()`: the room's Playa from `usePartyPlaya`)

Real-time updates (party sync, chat, invitations) arrive over Pusher (`lib/pusher`) and get dispatched into these reducers, or written to the query cache.

Server data goes through `@tanstack/react-query`. There's one client (`queryClient` in
`lib/query/client.ts`, 60-second stale time). `signIn` and `logout` drop every query but the auth one,
and the app routes are keyed by user id, so nothing carries across accounts. The home listing uses
`screens/app.home/app-home-queries.ts`; the watch room uses `screens/app.watch/queries/`; the
signed-in user's incoming invitations live in `queries/invitation-queries.ts`, filled from `/api/me`.
Pusher events are written into those caches. `SeasonSelection` takes its groups from the caller
(`useShowGroupsQuery`).

Query conventions:

- **Wrap every query and mutation in a hook** (`usePartyCodeQuery`) that just returns `useQuery`/`useMutation`.
- **Keys live in `src/query-keys.ts`.** Keys shared across pages start with `global-`; a page's own start with the page's name (`home-`, `watch-party-`). Keys leave out the account, since sign-in and logout clear the cache.
- **Hooks sit with their screen** (in a `queries/` folder once the screen has several), and move to `src/queries/<domain>-queries.ts` once a second page uses them. An app-wide concern keeps its hooks in its own `lib/` module (`lib/auth/auth-queries.ts`).
- **Read `status` and `data` together**, and use `fetchStatus` when a background fetch matters.

## File structure

```
src/
├── assets/       static audio/image assets
├── components/   shared, reusable UI (Ui* prefix for design-system primitives)
├── hooks/        shared hooks (useMediaMode, useFullscreen, etc.)
├── lib/          third-party wrappers (axios, pusher, uuid, srt2obj) and whole app-wide modules (auth)
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
- **A screen's own parts are prefixed with the screen's name**, so it's clear at a glance what goes where: `app.home/app-home-auth.tsx`. A part with 3 or more files gets a folder, one level deep at most: `app.home/app-home-listing/app-home-listing-search.tsx`. Hooks keep their `use-` name: `app.watch.home/use-party-playa.ts`.
- **Tests sit next to the file** (`use-now.test.ts`) and select by role, text, label or `data-testid`, never class name. Expose state as `data-*` attributes.
- **Nulls:** behind `PrivateRoute`, read the user with `useAuthUser()`; elsewhere check `useAuth().status === 'authenticated'`; in the watch room, `useParty()` always has a party. Prefer narrowing or a tighter type to `!`; `!` is fine for refs to elements that always render, and in tests.
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

There's no video library (no video.js/hls.js). The player is **Playa** (`components/playa/`), our own: a plain HTML5 `<video>` with React-built parts. Playa imports nothing from the app (no `screens/`, Pusher, axios, auth or queries); the app feeds it.

- `usePlaya(options)` — playback, the controls overlay, reaction floats and activity lines. What you do calls back (`onPlayback`, `onReact`); what others did comes in through `sync()`, `react(emoji, { by })` and `activity({ id, type, by, … })`, and never calls back, so nothing echoes.
- `PlayaProvider` hands it to everything below (`usePlayaContext()`); `Playa` is the box, `PlayaElement` the 16:9 picture with the `<video>`.
- Layers: `PlayaStatus`, `PlayaSubtitles`, `PlayaReactions`, `PlayaActivity` (draws each activity type itself), `PlayaOverlay`.
- Subtitles: pass `usePlaya({ subtitles })` a loader that returns the `.srt` text. Playa loads it with React Query (its own `playa-subtitles` key, outside `query-keys.ts`), once per source, then parses and shows it. Our loader is `loadSubtitle` in `screens/app.watch/queries/app-watch-video-queries.ts`; the API fetches the file because the browser can't.
- Controls: `PlayaControls` holds `PlayaSlider` and a `PlayaBar` you lay out left to right, with `PlayaSpacer` to push the rest right; `PlayaButton` for the page's own buttons.

`screens/app.watch.home/use-party-playa.ts` is the only file that knows both the room and Playa: it sends your play, pause and seek to the API and your reactions to the room, and turns Pusher `state`, `client-reaction` and `log` events into `sync()`, `react()` and `activity()`. The page's own parts live in `app-watch-home-stage/` (the picture, its controls), `app-watch-home-sidebar.tsx`, `app-watch-home-activity/` and `app-watch-home-hotkeys.tsx`.

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

The full Passport token is stored in the `app_token` cookie with the server’s expiration and sent as a Bearer header (the cookie is only storage); `getToken()` reads it for axios and Pusher. `/api/me` decides who's signed in: no cookie means a guest without a request, a 401 (or 403 `request_access_required`) drops the cookie, and a network or server error keeps it and shows a Retry screen. Any later 401 logs out. Logout revokes the token on the API, best effort. Keep callback and onboarding routes outside the account-keyed app routes, which remount when the account changes. Axios interceptors remain around all routes and initialize before requests. See [../AUTHENTICATION.md](../AUTHENTICATION.md).
