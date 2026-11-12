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

- `contexts/Auth` — auth/session state
- `screens/app.watch/Context` — the active watch party (see `usePartyContext`)
- `screens/app.watch.home/index.tsx` — local player state (time, playing, volume, subtitles) via a single `useReducer`

Real-time updates (party sync, chat, invitations) arrive over Pusher (`lib/pusher`) and get dispatched into these reducers.

The authenticated home listing uses `@tanstack/react-query` through the wrapper hooks in
`screens/app.home/queries.ts`. The shared provider in `lib/query` sets a 60-second
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

## Styling

Components are styled with Tailwind `4.3.5` classes; none has its own stylesheet. `src/tailwind.css` is the only CSS file: the reset, the tokens, the focus ring and one custom utility.

- **No component stylesheets.** CSS outside a layer always beats Tailwind's layered utilities, so a component can't be half and half. A library that injects its own styles does the same: add `!` to the utility that has to win (`absolute!` on the invitation's border beam).
- **Tokens** live in `src/tailwind.css` (`@theme`). A value used in several places becomes a token; a true one-off is an arbitrary value (`bg-[#5865f2]`).
- **Colours** come straight from Tailwind's palette: primary `pink-500`, focus `pink-700`, soft pink text `pink-300`, error `rose-400`, live `rose-500`, green `emerald-300`, blue `sky-500`, yellow `amber-300`. `neutral-*` holds Tailwind's taupe values.
- **Snap to the default scale** for spacing, radius and font size instead of registering near-misses. `text-10`, `text-11` and `text-13` are the only extra sizes.
- **Mobile-first only.** Base classes are the phone layout; `sm:`, `md:`, `lg:` and `xl:` add to it. No `max-*` variants.
- **1rem is 16px.** The app's 14px text comes from `text-sm` on `body`.
- **`body` sets four app-wide defaults** in `index.html`: 14px text, white on `neutral-950`, the arrow cursor over text (`cursor-default`), and long words that wrap (`wrap-anywhere`).
- **Easings** are `ease-*` tokens (`ease-out-soft` is the house curve). Motion can't read them, so `utils/motion.ts` mirrors the ones it needs.
- **`cn()`** from `~/utils/cn` joins classes and lets a later Tailwind class win. Primitives that accept `className` use it.
- **The reset is Tailwind's Preflight.** A heading has no size or weight of its own, a list no bullets, a link no colour or underline, and a button no padding, border or background: give each what it needs. An image is block-level, so add `inline` to centre one with `text-center`. A border with no colour class takes the text colour, so always name one.
- **Focus ring:** one rule in `src/tailwind.css` gives every focused control a `pink-700` ring, 3px out. A component only changes the offset where a parent would clip it.
- **Small caps labels** are `font-label text-xs font-bold tracking-label uppercase`.
- **Placeholders** are `placeholder:text-neutral-500`.
- **Stacking order** is a set of `--zindex-*` tokens in `src/tailwind.css`, used as `z-(--zindex-modal)`.
- **Icons:** size a FontAwesome icon with a `text-*` class on the `<i>` or its parent, plus `leading-none`.
- **Animations** are `animate-*` tokens with their keyframes in `src/tailwind.css`. One that reads a variable set on the element itself (a reaction's path) goes in the `@theme inline` block.
- **`hover:` only applies where the pointer can hover,** so a tap on a phone no longer leaves a button looking hovered.
- **Line height:** a size class brings Tailwind's line height with it. Add `leading-none` where a line height does nothing useful (buttons, chips, icons, single-line labels). Text with no size class gets `body`'s 20px line.
- **Styling a child you don't render** (every `<b>` in a line, every button in a card): use a variant on the parent, such as `[&_b]:font-semibold`.
- **Tests never select by class name.** Use roles, text, labels or `data-testid`, and expose state as `data-*` attributes.
- `prettier-plugin-tailwindcss` sorts classes; run Prettier on files you migrate.

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
