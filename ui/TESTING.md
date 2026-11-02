# Frontend verification

Use the Node version in `.nvmrc`. From `ui/`:

```bash
npm ci --strict-peer-deps --legacy-peer-deps=false --force=false
npm run build
npm test
npx playwright install chromium firefox webkit
npm run test:e2e
```

The default browser suite starts Vite on port 8486. It checks Chromium, Firefox,
WebKit, Pixel-sized Chromium, and iPhone-sized WebKit. Mobile projects emulate
viewport and touch input; they do not replace physical-device testing. Use
`E2E_BASE_URL=http://localhost:8489` to test a separately running production
preview instead. HTTP fixtures and blocked Pusher sockets in `migration.spec.ts`
make those checks deterministic; they are not live integration evidence.

## Live API, media, and Pusher

Live tests are opt-in and skip when `E2E_LIVE_FIXTURES` is absent. Use a disposable
local database/environment with two accounts, working Pusher broadcasts, and a
series containing at least two playable episodes and subtitles. The tests create
parties, invitations, and chat messages. Do not point them at production.

Create a JSON file outside the repository, readable only by your user:

```json
{
  "users": [{ "token": "FIRST_LOCAL_OAUTH_TOKEN" }, { "token": "SECOND_LOCAL_OAUTH_TOKEN" }],
  "seriesId": 63
}
```

Set `seriesId` to a suitable local catalog record. Configure the UI build and test
helper to use the same API. For the isolated migration environment:

```bash
# Terminal 1, from ui/
VITE_API_BASE_URL=http://localhost:8487 npm run build
npm run preview -- --host 127.0.0.1 --port 8489

# Terminal 2, from ui/
E2E_BASE_URL=http://localhost:8489 \
E2E_LIVE_API_URL=http://localhost:8487 \
E2E_LIVE_FIXTURES=/absolute/path/to/local-fixtures.json \
npm run test:e2e
```

The existing local API configuration used the log broadcaster and a different
Pusher cluster. Migration verification uses a separate API process on 8487 with
`BROADCAST_DRIVER=pusher` and `PUSHER_APP_CLUSTER=ap1`; existing environment files
and backend code remain untouched. Other environments should use their own
matching Pusher configuration.

`live-party.spec.ts` uses two independent contexts and real HTTP/Pusher events.
Its Chromium project grants autoplay permission for controlled synchronization
checks. `live-controls.spec.ts` exercises real media using user gestures across
the five browser targets. Live tests disable traces to keep OAuth headers out of
reports. Screenshots and reports stay in ignored `test-results*/` and
`playwright-report/` directories.

Live projects run serially and reserve request capacity before starting. The
existing API permits 60 requests per minute; a test can wait up to a minute for
that window to reset. Keep other live test runs stopped while running this suite.
The tests do not disable or change the backend rate limit. Set `E2E_DIAGNOSE=1`
to print captured browser exception messages/stacks without HTTP configuration.

## Baseline limitations

Do not interpret a live scenario's passing result as proof that every existing
feature works. Its annotated baseline step records that remote episode changes
remain stale until reload: the original UI and migrated UI both lack a
`video-changed` listener. In-place party switching also retains the old room until
reload because the original route effect has no party-ID dependency. The host's
episode selector and reload recovery are checked independently.

The original iPhone-sized WebKit UI also crashes during navigation when
`screenfull` lacks browser support but its cleanup calls `off()`. The live control
check records this exception only when the browser lacks the relevant API and the
specific original error is observed. It verifies reload recovery and still fails
on unexpected exceptions or HTTP errors. These annotated steps verify migration
parity; they do not report those existing features as fixed. See `../MIGRATION.md`
for evidence. Unrelated bug fixes remain outside this migration.

Safari pointer clicks do not focus movie-card buttons in the original UI. The
browser smoke test checks its body focus target after dismissal; Chromium and
Firefox return to the focused card. Existing mobile back-link text is hidden,
so that navigation check uses the visible icon link.
