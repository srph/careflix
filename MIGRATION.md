# Frontend migration

Modernize the frontend before implementing the redesign so it can use current UI and animation libraries. This document records the agreed replacements, execution milestones, verification evidence, and acceptance criteria. Execution is underway on `v2`; milestones and evidence below record actual progress.

## Execution workflow

Use the existing `ui/` directory on a dedicated `v2` branch. Reuse the current checkout unless redesign work needs to proceed concurrently; in that case, use a separate Git worktree. Keep one frontend source tree.

Use a Codex Goal for sustained execution and this file as the repository's progress record. Work through the milestones below, updating status, checks, remaining work, and relevant commit IDs after each meaningful checkpoint. Mark a milestone complete only when its completion criteria have been verified. Record pre-existing failures separately from migration regressions, and distinguish mocked checks from live integration evidence.

### Scope boundary

Implement the agreed stack migration and the compatibility changes it requires. Fix regressions introduced by the migration. Do not fix pre-existing bugs, redesign behavior, or expand into general application cleanup. Record existing failures as baseline findings and leave them outside the migration's repair scope. A bug discovered through Strict Mode or a new test is not automatically a migration regression; compare it with the original implementation first.

Verification criteria below apply to migrated behavior against the recorded baseline. Explicitly identify proven pre-existing failures rather than reporting them as passes or silently weakening tests. Existing failures do not require repair to complete this migration; unavailable checks still require an honest pending status. If a pre-existing defect prevents a required migration step or its verification, report the concrete dependency and request a scope decision while continuing independent work.

### Milestone board

| ID | Milestone | Status | Complete when |
| --- | --- | --- | --- |
| M0 | Verification plan and working baseline | Complete | Verification cases and expected outcomes are defined; branch and baseline commit are recorded; baseline behavior and existing issues are documented. |
| M1 | Vite and TypeScript | Complete | The app runs through Vite; type checking and the production build pass; assets, configuration, and deep links work. |
| M2 | React 18.3 checkpoint and focused tests | Complete | The intermediate runtime works; the test harness runs; migration deprecations and compatibility issues are addressed or assigned to M3/M4; pre-existing findings are recorded without repair. |
| M3 | Component and hook replacements | Complete | The agreed Base UI, Motion, CSS, and local-hook replacements work, with tests covering the changed behavior. |
| M4 | React 19 and current router | Complete | Runtime, types, routing, guards, metadata, and navigation blocking are migrated; focused tests and build checks pass. |
| M5 | Final integration verification | Pending | The acceptance checklist is verified across the browser targets and two live sessions; remaining limitations and developer instructions are documented. |

### Ownership and user input

The agent owns implementation, test design, execution, debugging, and progress updates for every milestone. The user does not need to approve routine technical choices or each checkpoint. Inspect existing configuration, fixtures, and repository context before requesting information.

| Step | Agent responsibility | User input |
| --- | --- | --- |
| Start execution | Use the agreed scope and this plan as the execution contract. | An explicit request to start a Goal is needed to activate Goal mode. |
| M0 | Write the verification matrix, establish baseline behavior, inspect the local setup, and find or prepare test fixtures. | Conditional: provide missing service access or clarify an environment that cannot be established from the repository. Existing usable accounts/configuration need no new input. |
| M1 | Select compatible stable tooling versions, migrate Vite/TypeScript, and verify commands, assets, and configuration. | None expected. |
| M2 | Establish the intermediate React runtime and focused test harness; test subscriptions and async behavior. | None expected. |
| M3 | Implement the agreed component replacements and their behavior tests while preserving the current UX. | Conditional: decide an intentional behavior change if a replacement cannot preserve the agreed behavior. |
| M4 | Complete React 19 and router migration, preserving routes, guards, and navigation behavior. | None expected. Escalate an intentional route or authentication behavior change rather than silently expanding scope. |
| M5 | Run automated and live checks, document results, and fix migration regressions. | Recommended: review the migrated app's appearance and key interactions. Conditional: supply missing device or service access for a check the agent cannot perform. |

Request input only for a concrete missing item or unresolved product decision. Continue independent work while awaiting it, and identify which verification remains pending. A user review does not replace automated or live verification, and it is not a routine approval gate for local work.

### M0: verification plan and working baseline

- [x] Review and finalize the verification matrix below before application changes: cases, expected outcomes, test method, fixtures, and the milestone responsible.
- [x] Create `v2` from `8977ac1b6929fad4b3378728d98e0dd70abb305d`; include this plan in the first checkpoint.
- [x] Confirm the MySQL, API, and existing Parcel UI startup paths using the repository's Makefile.
- [x] Confirm frontend/API URLs, OAuth configuration, and Pusher configuration work together. Inspect the existing setup before requesting missing inputs.
- [x] Confirm two usable test accounts, a playable title, subtitles, and a series with more than one episode. Use disposable local fixtures if the existing data is insufficient.
- [x] Record the current typecheck/build and key screen captures (see execution evidence).
- [x] Capture a small Playwright smoke suite for login/redirects, catalog navigation, and opening a party wherever the baseline environment allows. It should assert behavior that can survive component replacements.

Accounts, media, and Pusher are checked to establish whether the existing end-to-end watch-party path works before migration: accounts provide two independent sessions; media exercises playback/subtitles/episode changes; Pusher delivers synchronization, chat, and presence events. This is a short application smoke check, not an infrastructure audit. A failure here may predate the migration.

Record the observed behavior before changing it. Working live services are required for live baseline/final integration evidence, not for starting Vite changes or deterministic tests. If live services are unavailable, continue independent work while leaving the relevant live criteria unchecked.

### M1: Vite and TypeScript

- [x] Resolve and record exact compatible stable tool versions; update the Node pin, scripts, compiler settings, and lockfile.
- [x] Complete the Vite checklist below, including environment variables, aliases, asset imports, stylesheet extensions, and HTML entry point.
- [x] Verify `npm run typecheck`, `npm run build`, the dev server, production preview, assets, and direct route entry.

Keep the existing runtime during this step where compatible. Record any compiler fixes required by the tooling change.

The current dependency tree already has invalid React peer declarations. Coordinate early replacements with M1 if a clean modern npm installation requires them; milestone boundaries must respect actual package compatibility.

### M2: React checkpoint and focused tests

- [x] Move to React 18.3 with matching types and `createRoot`; exercise development Strict Mode.
- [x] Add Vitest and React Testing Library for selected hook and interaction tests, with a non-watching test command.
- [x] Add focused tests around runtime and hook behavior changed by the migration. Record pre-existing subscription or async failures separately; do not turn them into unrelated fixes.
- [x] Record remaining deprecation warnings and the replacement milestone that resolves each one.

### M3: component and hook replacements

- [x] Complete the agreed dependency replacement table and local-hook cleanup, using package versions compatible with this checkpoint.
- [x] Test `InfiniteScroll` for overlapping requests, retries, and the last page.
- [x] Test that seeking previews locally and commits the final change once per completed interaction.
- [x] Verify dialog dismissal/focus restoration, tooltips, animations, textarea fallback, and Font Awesome rendering.

React 19-native metadata and the current router are completed in M4. Add tests to our wrappers and integration behavior rather than duplicating third-party library tests.

### M4: React 19 and routing

- [x] Install React 19, matching React DOM/types, and the target router together; enable the modern JSX transform.
- [x] Complete route definitions, authentication guards, navigation, search parameters, and leave-party blocking.
- [x] Replace Helmet with native metadata and remove remaining obsolete dependencies and declarations.
- [x] Run type checking, the production build, and focused tests; verify that removed React APIs are no longer required.

### M5: final verification

- [ ] Run the browser smoke suite with Chromium, Firefox, and WebKit, plus a manual mobile pass for touch controls, fullscreen, and media behavior.
- [ ] Use two separate browser sessions with the real API/Pusher path to verify invitations, presence, chat, synchronized playback/seek, episode changes, and reconnecting.
- [ ] Update the acceptance checklist with evidence. Tests with mocked API/Pusher responses do not satisfy the live two-session criteria.
- [ ] Update developer instructions, final commands, port documentation, and the completed milestone record.

### Test scope

Use a small set of behavioral tests around the migration risks. Browser tests belong in `ui/e2e/`; focused hook/component tests can live beside the relevant source. Cover migrated auth/navigation, hook behavior, pagination, and seek commits. Add subscription/async coverage where the runtime or hook replacements affect those paths, using the scope boundary above for existing defects. Keep screenshots as baseline/review evidence; broad visual snapshots and a coverage-percentage target are outside this migration's testing plan.

Write the verification plan in M0. Add the initial browser smoke cases in M0 where the baseline permits, add focused React tests in M2, and add or extend behavior tests before or alongside the relevant M3/M4 changes. Run relevant checks at each milestone; M5 is the final integration pass, not the first time verification happens.

### Verification matrix

| Case | Expected outcome | Method and fixtures | When |
| --- | --- | --- | --- |
| Build and assets | Type checking/build pass; app, images, fonts/icons, audio, manifest, and direct route entry work. | Build/preview checks and browser smoke; configured frontend environment. | Capture baseline in M0; verify after M1 and subsequent changes. |
| Authentication and routing | Guest/private guards, session restoration, logout, registration code, and back/forward preserve current behavior. | Playwright with controlled API responses for repeatability; existing test account for live confirmation. | Initial cases in M0; extend for M4; live confirmation in M5. |
| Shared subscriptions | Runtime/hook changes introduce no additional missing or duplicate callbacks relative to the baseline; existing cleanup defects are recorded separately. | Vitest/React Testing Library with a controlled Pusher adapter where lifecycle changes need coverage. | M2 where affected; rerun after related migration changes. |
| Async results | Replacement effects preserve existing loading, result, and cleanup semantics; migration changes introduce no new races. | Focused tests with controlled promise completion order for replaced hooks; document known baseline failures. | M2 before async-effect replacement. |
| Infinite scrolling | Repeated observer callbacks do not overlap page requests; retry and end-of-list behavior work. | Focused interaction tests with a mocked intersection observer and API pages. | M3 before or alongside the new component. |
| Seek slider | Dragging previews locally; the final seek commits once per completed interaction. | Interaction tests with controlled player state/API calls, plus pointer/keyboard browser checks. | M3 before or alongside the replacement. |
| Dialogs and tooltips | Dismissal, Escape handling, focus restoration, hints, and animations preserve usable interactions. | Browser interaction checks against migrated components. | M3; cross-browser confirmation in M5. |
| Chat textarea | Input remains usable within height bounds, with and without CSS auto-sizing support. | Browser checks of progressive enhancement and the scrollable fallback. | M3 and M5. |
| Watch-party integration | Two distinct users receive invitations, presence, and chat; playback/seek and episode changes synchronize; reconnecting works. | Two browser sessions, real API/Pusher, two test accounts, playable media, subtitles, and a multi-episode series. | Live baseline in M0 if available; final verification in M5. |

### M4 evidence

- React / React DOM 19.3.1, matching 19.3 types, and React Router 8.5.1 now use a data router with layout outlets and existing guest/private guards. Navigation and registration query parameters use router hooks; leave-party confirmation uses `useBlocker`.
- Replaced Helmet with React native document titles. Removed the shared history instance, legacy router wrappers, and obsolete router/query/Helmet packages.
- Clean `npm ci --strict-peer-deps --legacy-peer-deps=false --force=false` passed without compatibility overrides. `npm ls` confirms a single React 19.3.1 tree with no invalid React peers.
- Type checking, production build, and all 17 focused tests pass. Three new navigation tests cover accepting/declining confirmation and paused playback. The production bundle still emits a size advisory; code splitting is outside this behavior-preserving migration.

### M3 evidence

- Native textarea checkpoint: `793253c`. The in-house `InfiniteScroll` now replaces the React 15 package. It retains scroll-triggered loading, uses an intersection observer, prevents concurrent/non-progressing automatic requests, and supports explicit retry. The caller returns its existing fetch promise; existing fetch/has-more logic is otherwise unchanged.
- Four pagination tests cover deferred first load, overlap/progress guards, retry, and the last page. Total focused suite: 14 passing tests. Build/type checking and all 6 production browser smoke cases pass. An additional dialog case explicitly verified focus restoration to the movie card after Escape.

- Motion checkpoint: `253e1f7`. Chat now uses a native one-row textarea with CSS auto-sizing, a 200px height bound, and a scrollable 50px fallback. Ref/event declarations now use the actual textarea element.
- Build/type checking and 10 focused tests pass. A production browser check measured 200px height with 515px scroll content under auto-sizing, and 50px height with the same scroll content when the fallback was forced.
- Disposable test tokens exposed by a temporary probe's teardown error were revoked and replaced. Subsequent live checks use the isolated API directly, avoiding that forwarding callback; no credentials enter committed source.

- Base UI control checkpoint: `cb5ae50`. Replaced the deprecated transition addon with Motion for toast/key indicators and the player overlay, preserving their opacity/translation transitions and durations.
- Build/type checking, 10 focused tests, and all 6 production browser smoke cases pass after the animation replacement.

- Base UI 1.9.0 now supplies dialogs, player tooltips, and sliders. The wrappers retain their CSS classes and controlled interaction contracts. Removed `react-modal`, `react-tiny-popover`, `react-input-slider`, and `scrollbar-compensate`.
- Base UI's optional calendar peer expects date-fns v4. The app retains exactly v1.30.1 under the `date-fns-v1` alias, with its original declarations, so existing parsing/formatting behavior is unchanged.
- Type checking, build, and 10 focused tests pass, including modal render-prop/Escape and slider keyboard commit/playback-update behavior. All six browser smoke cases pass against a freshly optimized dev server. Restarting the test server after dependency changes avoids stale Vite optimization URLs.
- Two live migrated sessions loaded media, subscribed to four Pusher channels each, and received a remote seek to 12 seconds without page errors. Player control screenshot: `.migration-evidence/base-ui-watch.png`.

- Local hook replacement checkpoint: `61efc97`.
- Removed Gateway and body-class dependencies. Header title/back-link selection now uses route conditionals; the watch-screen body class uses a native effect. Replaced the spacer's function default props with a default parameter.
- Build/type checking, 6 focused tests, and all 6 browser smoke cases passed after layout changes. The settings case now checks the exact title and back navigation.

- Replaced `react-use`, `@use-it/interval`, and `use-async-effect` with local hooks and ordinary state. Preserved the original update-only and async cleanup semantics; cancellation/error-policy improvements remain outside scope.
- Type checking and production build pass. Six focused tests cover interval timing/cleanup, window resize, update-only effects under Strict Mode, and async result cleanup. All six baseline browser smoke cases pass.
- React checkpoint committed as `ad44d1f`; component replacements follow in separate focused commits.

### M2 evidence

- Vite tooling checkpoint committed as `5bb2700`.
- React/React DOM 18.3.1, matching v18 definitions, `createRoot`, and the automatic JSX transform are active. Router declarations now match the existing v5 runtime API.
- Vitest 5.0.5 and React Testing Library cover the invitation clock's interval, changed delay, and Strict Mode timer cleanup: 3 tests passed.
- Type checking and the production build passed. All 6 baseline browser smoke cases passed on the React 18.3 runtime after dependency optimization settled.
- Remaining legacy context/default-prop/DOM lookup warnings belong to the packages removed in M3/M4. Strict Mode is exercised in focused tests; enabling it globally is not used to expand scope into pre-existing lifecycle defects.
- An isolated API process runs on 8487 with a process-local Pusher cluster override (`ap1`). Neither the existing server configuration nor backend source was changed. The live catalog request succeeded with a disposable account (203 titles, 30 on the first page).

### M1 evidence

- Selected stable registry versions: Node 24.19.0, TypeScript 7.0.2, Vite 8.3.5, React plugin 6.2.0, Playwright 1.64.1. React remains 16.11.0 for this checkpoint.
- Migrated HTML/public assets, imports, aliases, stylesheets, and environment handling. Existing `.env` files work via an explicit public-variable allowlist; the Pusher server secret is not exposed.
- TypeScript's former non-strict policy is explicit in the new configuration; this migration does not introduce a strictness refactor. One shared button prop declaration required adaptation to the current compiler.
- Vite revealed older CommonJS default-export interop differences. Published ESM hook builds, named Helmet exports, and a temporary router-module unwrap preserve this checkpoint; those packages are scheduled for replacement.
- `npm run build` passes. Six browser smoke cases pass against both the Vite development server on 8486 and the production preview on 8489. Production output includes the manifest, SPA redirects, and Font Awesome font assets; an inspection confirmed the Pusher server secret is absent from compiled JavaScript.
- The intermediate dependency tree requires `--legacy-peer-deps` because of the baseline's incompatible React declarations. This is temporary; the final M4/M5 installation must succeed without that option.
- Confirmed existing Pusher configuration mismatch using read-only service calls: the supplied credentials validate on `ap1` (HTTP 200), while `mt1` returns HTTP 400. Plan live verification with an isolated API process using a cluster override; leave the existing `.env` and backend source untouched.

### M0 live baseline evidence

- Preserved original Parcel output in `/tmp/careflix-v2-parcel-baseline`, served on 8491. Two disposable users loaded the original watch screen and real media, subscribed to four Pusher channels each, and received a seek to 12 seconds through the real broadcast path, without page errors (baseline party 2).
- HTTP requests were forwarded to the isolated API on 8487; responses were real, not mocked. The process uses `BROADCAST_DRIVER=pusher` and `PUSHER_APP_CLUSTER=ap1`. The existing local server uses the log broadcaster and a mismatched cluster; those settings and backend source remain untouched.
- Existing movie and subtitle URLs returned HTTP 200. Local series 63 has 12 episodes for episode-change checks.

### Execution evidence — 2026-11-02

- Baseline checkpoint: `e0845ec` (`test: capture frontend migration baseline`).
- Branch: `v2`; starting commit: `8977ac1b6929fad4b3378728d98e0dd70abb305d`.
- Baseline: `PATH=/Users/kier/.nvm/versions/node/v11.15.0/bin:$PATH npm run build` passed, including type checking. Parcel reported outdated browser data and missing popover source-map sources; these are baseline warnings.
- Six Playwright Chromium smoke cases passed against the unchanged app on port 8484: guest/login navigation, private-route redirect, registration access code, invalid-login feedback, mocked authenticated catalog/dialog, and authenticated settings. HTTP fixtures and blocked Pusher sockets in controlled tests do not constitute live synchronization evidence.
- Baseline screenshots are local artifacts in `.migration-evidence/baseline/` (guest, login, registration, live authenticated catalog).
- MySQL is healthy. The API listens on 8485 and returns the expected JSON 401 for unauthenticated protected routes.
- Created two disposable local migration accounts and authenticated both through the real OAuth endpoint. Test credentials/tokens are stored outside the repository in `/tmp/careflix-v2-fixtures.json`; no secrets are committed. The existing catalog has 203 shows and 480 videos.
- Frontend Pusher cluster is `ap1`, API cluster is `mt1`; live event delivery remains to be verified. No existing application bug has been repaired.
- The baseline browser runner is temporarily installed outside the app in `/tmp/careflix-migration-tools`; M1 will add it to project dev dependencies.

### Preflight evidence

Initial inspection on 2026-11-02 established:

- Current Git branch: `master`. The migration branch has not yet been created.
- `ui/.env`, `api/.env`, `ui/node_modules`, and `api/vendor` are present. Presence alone does not establish that configuration or services work.
- Docker and Valet commands are installed. The current shell uses Node 24.19.0; the repository still pins Node 11.15.0.
- UI scripts specify port 8484, while Makefile help mentions 1234. The API's default startup is port 8000, while `ui/.env.example` points to 8485. Confirm the intended URLs in M0 and reconcile documentation during M1.
- Docker status and loopback HTTP checks were denied by the execution sandbox. Service availability, existing accounts, media, and live Pusher behavior remain unverified.
- The earlier dependency assessment passed `npm run typecheck`. A baseline production build has not yet been recorded.

### Execution goal

Suggested Goal text when starting execution:

> Complete the frontend migration in MIGRATION.md within the existing ui directory. Work through M0–M5 and update the milestone board and verification evidence after each checkpoint. Preserve existing user-facing behavior, API contracts, Font Awesome, and the modern stable browser policy. Write the verification plan and baseline first, then add focused behavioral tests around changed code. Fix required compatibility issues and migration regressions; do not fix pre-existing bugs or expand scope. Document proven baseline failures separately. Completion requires passing in-scope type checking, production build, automated checks, and verified live two-user party behavior against that baseline. Record unavailable checks explicitly and continue independent work without treating mocked checks as live verification. Ask only for concrete missing access or decisions outside the agreed scope. Keep the visual redesign as a subsequent phase.

## Target stack

- React 19 and matching React DOM and TypeScript definitions.
- Vite in place of Parcel.
- A supported Node LTS and current TypeScript.
- Current stable React Router (v8 at the time of the assessment).
- Base UI for dialogs, tooltips, popovers, and sliders.
- Motion for animations.
- Small local hooks and an in-house `InfiniteScroll` component.
- Retain the existing Font Awesome icons.

Retain the Laravel API contracts and the existing custom HTML video player. The React migration does not inherently require a backend upgrade.

## Starting point

The dependency audit found these locked and installed versions:

| Dependency | Version |
| --- | --- |
| React / React DOM | 16.11.0 |
| React Router / React Router DOM | 5.0.1 |
| Parcel | 1.12.3 |
| TypeScript | 3.5.2 |

The repository pins Node 11.15.0 in `ui/.nvmrc`. The existing `npm run typecheck` passed during the assessment. A migrated build and live watch-party behavior have not yet been tested.

## Agreed dependency replacements

| Existing dependency | Replacement | Implementation notes |
| --- | --- | --- |
| `react-gateway` | Route-based conditionals | Its current use is supplying header titles and back buttons. Render those directly from the active route. |
| `react-addons-css-transition-group` | Motion | Migrate player overlay, toast, and keyboard indicator animations, including exit animations. |
| `react-tiny-popover` | Base UI | Use `Tooltip` for the existing player hints and `Popover` for interactive anchored content. |
| `react-simple-infinite-scroll` | In-house `InfiniteScroll` | Use an intersection observer with loading, end-of-list, and error/retry handling. Prevent overlapping page requests. |
| `react-modal` | Base UI Dialog | Preserve dismissal behavior, focus management, scroll locking, and opening/closing animations. |
| `react-input-slider` | Base UI Slider | Preserve local drag previews and commit seek changes when interaction finishes. |
| `react-textarea-autosize` | Native textarea and CSS | Use a bounded, scrollable textarea with `field-sizing: content` as a progressive enhancement. |
| `react-router` / `react-router-dom` | Current React Router | Migrate route definitions, guards, navigation, parameters, and navigation blocking. |

`react-gateway` uses legacy context. The old transition package and popover call removed React DOM APIs. Those are confirmed compatibility conflicts. Other old packages also declare React compatibility ranges that exclude React 19; those ranges alone do not prove a runtime failure.

## Additional dependency cleanup

- Remove `react-helmet`. Use React 19's native document metadata support and preserve the page-title suffix convention.
- Remove `react-body-classname`. Manage the watch-screen body class with an effect and cleanup.
- Remove `scrollbar-compensate` when migrating `UiModal`, after verifying Base UI's scroll locking and layout behavior.
- Remove `use-react-router` in favor of the router's navigation, location, and route-parameter APIs.
- Remove `use-query-params`. Its current use is reading the registration access code, which the router's search-parameter API covers.
- Replace the used helpers from `react-use`, `@use-it/interval`, and `use-async-effect` with small local hooks or ordinary effects. Preserve existing update-only, asynchronous, and cleanup semantics; avoid introducing new races.
- Remove obsolete package-specific declarations, unused dependencies, and superseded router type packages.

Axios, Pusher, date-fns, Immer, and UUID are also old. Assess their updates as separate changes so changes in HTTP, authentication, dates, and real-time behavior remain easy to isolate. They are not inherently React 19 blockers.

## React and TypeScript changes

- Replace `ReactDOM.render` with `createRoot` from `react-dom/client`.
- Enable the modern JSX transform.
- Update React DOM and both React type packages together with React.
- Replace function-component `defaultProps` with default parameters. The audit found assignments in `UiSpacer`, `UiModal`, and `PlayerTooltip`.
- Give refs explicit initial values and handle nullable DOM refs. The audit found argumentless refs in the invitation modal, player overlay, and video player.
- Resolve compiler and library type changes, including any affected reducer, children, or element types.
- Exercise development Strict Mode, classify findings against the baseline, and fix required migration compatibility issues and regressions only.

Use React 18.3 as an intermediate checkpoint to surface deprecation warnings before moving to React 19. This is a migration step, not the final target.

## Vite migration

- Replace Parcel dependencies and commands with Vite and its React integration.
- Update the Node pin, package engine requirements, TypeScript configuration, and lockfile.
- Use the selected Vite major's default Baseline Widely Available production target as the browser compatibility floor.
- Set up the HTML entry point and module script for Vite.
- Convert frontend configuration from `process.env` to explicit Vite environment variables, updating `.env.example` and configuration types.
- Convert asset `require()` calls and TypeScript import assignments to ES imports.
- Standardize imports on `~/` and configure the alias consistently in Vite and TypeScript. Existing imports also use forms such as `~lib/axios` and `~utils/...`.
- Add explicit `.css` extensions to stylesheet imports such as `import './style'`.
- Verify images, SVGs, fonts, audio, and the web manifest in development and the production build.
- Preserve SPA deep-link handling and include the Netlify redirects file in the production output.
- Update the Makefile integration and developer instructions to match the final commands and port.
- Keep an explicit TypeScript check in the build workflow.

## Routing migration

- Replace `Switch`, `Redirect`, and the old route `component`/`render` patterns with current route definitions and layouts.
- Migrate private and guest route guards while preserving loading states and authentication redirects.
- Replace the shared `history` instance and `history.push` calls with current router navigation APIs.
- Replace `use-react-router` calls with location and parameter hooks.
- Read the registration access code through search parameters.
- Replace `history.block` and `useRouterBlock` with current navigation blocking. Preserve the existing confirmation when leaving a playing watch party.
- Verify direct entry, refresh, browser back/forward, party changes, and nested settings routes.

## Behavior that needs particular care

### Player controls

The existing slider wrapper previews movement locally and commits the final value after dragging or clicking. Preserve that behavior with Base UI's `onValueCommitted`; sending every intermediate seek to the API would change party synchronization. Cover keyboard and touch interactions as well.

Verify play/pause, seeking, volume, mute, fullscreen, keyboard shortcuts, control visibility, subtitles, buffering indicators, and episode changes.

### Effects and real-time events

React 18 and later batch more state updates. Audit code that dispatches an update and immediately reads or changes the DOM, especially chat scrolling and video controls.

The existing `usePusher` cleanup unsubscribes an entire channel for each listener, while multiple listeners share channels. This is a baseline finding, not an authorized bug fix. Check that runtime/hook migration changes introduce no new missing or duplicate events; record existing failures separately.

Preserve authentication initialization, Axios interceptor behavior, and asynchronous effect semantics through the migration. Development Strict Mode repeats effect setup/cleanup and may reveal existing defects; that repeated cycle is a development check, not permission to repair unrelated bugs.

### Textarea sizing and browser support

Support modern stable Chrome, Edge, Firefox, and Safari, including their mobile equivalents. Use Baseline Widely Available features for required functionality, aligned with the selected Vite major's default production target. Baseline Widely Available means a feature has been supported across the core browsers for at least 30 months. Experimental features and preview browser releases are outside the support target.

Newer features may be progressive enhancements when the fallback provides a complete, usable experience. Vite's syntax transformations do not supply missing browser APIs or CSS features, so check those separately.

For textarea sizing, use a bounded, scrollable textarea as the base and enable `field-sizing: content` where supported. It became Baseline Newly Available in June 2026, so auto-sizing must not be required for the chat input to work.

## Confirmed decisions and verification inputs

No product decision blocks preparation or implementation of the migration.

- **Browser support:** Modern stable browsers using the established compatibility policy above. Avoid bleeding-edge requirements.
- **Icons:** Keep Font Awesome 4.7.0. Verify font asset loading, icon rendering, and CSS interactions during the Vite/Base UI migration. Flag any actual compatibility conflicts found; an icon-library replacement is outside the agreed scope.
- **Live verification:** Acceptance testing needs a working API/Pusher environment, playable media, and two test accounts in separate browser sessions. Inspect the existing development setup before requesting any missing access or fixtures.

## Suggested implementation order

1. Record baseline behavior and modernize the Node, TypeScript, and Vite setup.
2. Prepare component replacements and route changes in reviewable changes, respecting each package's supported React versions.
3. Use React 18.3 to identify remaining deprecations, then move to React 19, matching types, and the current router. React Router 8 requires React 19, so install those target versions together.
4. Correct compatibility issues and regressions introduced by the migration; document pre-existing defects without fixing them.
5. Complete build checks and live regression testing before implementing the visual redesign.

The source-based estimate was approximately 1–2 weeks including integration testing, excluding the redesign. Reassess after the migrated build runs against the API.

## Acceptance checklist

- [ ] Dependencies install cleanly without bypassing React peer compatibility checks.
- [ ] Type checking, the production build, the dev server, and production preview work.
- [ ] Production output includes assets, configuration, manifest, and SPA redirects.
- [ ] Required functionality works across the supported modern browsers without experimental features.
- [ ] Font Awesome assets and icons render correctly; any observed compatibility conflicts are reported.
- [ ] Registration, login, session restoration, logout, and settings work.
- [ ] Registration access codes and protected-route redirects are preserved.
- [ ] Movie pagination loads without duplicate requests and handles errors and the last page.
- [ ] Dialogs, tooltips, sliders, and animations work with keyboard, pointer, and touch input.
- [ ] Chat input grows within its bounds where CSS auto-sizing is supported and remains usable with the scrollable fallback elsewhere.
- [ ] Two users can create/join a party and use invitations and presence updates.
- [ ] Playback state and seeking remain synchronized across two sessions.
- [ ] Chat delivery, unread state, scrolling, subtitles, and episode changes work.
- [ ] Leaving a playing party, switching parties, reconnecting, and remounting do not lose or duplicate subscriptions.
- [ ] Developer documentation describes the migrated stack and commands.

## References

- [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [React 18 upgrade guide: batching and Strict Mode](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React document title support](https://react.dev/reference/react-dom/components/title)
- [Vite guide](https://vite.dev/guide/)
- [Vite environment variables](https://vite.dev/guide/env-and-mode)
- [Vite production browser compatibility](https://vite.dev/guide/build.html#browser-compatibility)
- [Web Platform Baseline](https://web.dev/baseline)
- [React Router documentation](https://reactrouter.com/)
- [Base UI quick start](https://base-ui.com/react/overview/quick-start)
- [Base UI Slider](https://base-ui.com/react/components/slider)
- [Base UI Dialog](https://base-ui.com/react/components/dialog)
- [Motion installation](https://motion.dev/docs/react-installation)
- [CSS field-sizing and browser support](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing)
