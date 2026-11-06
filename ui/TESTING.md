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

`listing.spec.ts` checks catalog filters and pagination, grouped search, party
history, details/episode selection, create/rejoin actions, recovery states, and
responsive overflow. Its screenshots use controlled catalog artwork. Query unit
tests cover the 60-second freshness window, failures, mutation invalidation, and
account cache isolation.

The listing API checks run from `api/` with
`valet php vendor/bin/phpunit --filter ListingApiTest`. They migrate an isolated
in-memory SQLite database, including Telescope's storage connection, and check
search/filter pagination, literal wildcard handling, authentication, and party
membership scoping.

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
`video-changed` listener. The host's episode selector and reload recovery are
checked independently. Incoming invitations now use the A6b5 pill and expanded
card; the live check opens Respond before accepting and expects a room switch to
reset the player, chat, and subscriptions without reloading.

The original iPhone-sized WebKit UI also crashed during navigation when
`screenfull` lacked browser support but its cleanup called `off()`. The invitation
work now guards that cleanup. The live control check retains its baseline
annotation if that specific original error is observed. It verifies reload
recovery and still fails on unexpected exceptions or HTTP errors. The remote
episode-change annotation remains a migration baseline limitation. See `../MIGRATION.md`
for evidence. Unrelated bug fixes remain outside this migration.

The listing explicitly focuses a movie card before opening its details, so the
dialog restores focus to that card in Safari as well as Chromium and Firefox.
Existing mobile back-link text is hidden, so that navigation check uses the
visible icon link.

## Incoming invitations

`invitations.spec.ts` covers the collapsed pill, expanded movie/episode snapshots,
queue advancement, expiry and withdrawal, request retries, duplicate and concurrent
Pusher events, reduced motion, keyboard response actions, and joining from another
room. It also samples width, height, corner rounding, and the joined confirmation's
fade upward, verifies the final declined pill, and checks that acceptance clears
the invitations declined by the API. Its HTTP and WebSocket fixtures run across
all five browser targets and do not establish live Pusher or media evidence.
Screenshots capture the pill, card, next invite, declined confirmation, and docked
confirmation with controlled artwork.

`party-codes.spec.ts` checks the A2d2b7 Join button and dialog, normalized pasted
codes, automatic lookup, stale response cancellation, lookup/join retries, preview
states, focus restoration, repeat submissions, invitation cleanup, duplicate member
events, and copying the code above chat across the five browser targets. Its
HTTP/WebSocket fixtures establish interface behavior independently of live Pusher.
The corresponding isolated API and creator backfill tests run with
`valet php vendor/bin/phpunit --filter 'PartyCodeApiTest|PartyCodeMigrationTest'`.

`host-invitations.spec.ts` checks the B5b2 panel inside chat, Party and Recents,
keyboard search/inviting, cancellation, countdown expiry, live outcomes, duplicate
and late events, request retries, stale search results, code copying, focus and
draft preservation, reduced motion, and viewport bounds across all five browser
targets. Screenshots cover Recents, pending invitations, and empty Recents. These
controlled HTTP/WebSocket fixtures do not establish live Pusher delivery.
The isolated `HostInvitationApiTest` verifies recent co-watchers, literal search,
latest invitation history, duplicate sends, fresh reinvites, and room membership
permissions. Run it alongside `InvitationApiTest` for the recipient actions.

The invitation API checks run with
`valet php vendor/bin/phpunit --filter InvitationApiTest`. They use isolated SQLite
and verify expiry, already answered invitations, recipient membership on accept,
legacy pending actions, and timezone-qualified expiry serialization.
Accepting also verifies that only the recipient's other active invitations are
declined, affected rooms receive decline events, and failed joins roll back both
the invitation changes and membership.
