# Care.tv — Watch Party (Fable cut)

A reimagined fork of `../thumbnail` — same scene (video stage + watch-party chat), different
mood. The aesthetic is **candlelit cinema**: the "screen" is the room's only light source,
spilling warm amber/rose onto a near-black interface, with film grain over everything.

## Run

```bash
npm install
npm run dev
```

Opens at http://localhost:5274.

## What changed from the original

- **The screen is the light** — the CSS-painted poster (orange-and-teal grade, anamorphic
  lens flare, vignette) glows beyond its rounded frame onto the whole page, Ambilight-style.
- **Type system** — `Fraunces` (italic serif) for the film-title lockup, `Instrument Sans`
  for UI/chat, `Spline Sans Mono` for timecodes, labels, and activity lines.
- **Motion** (via the `motion` library) — staggered chat entrances, an animated seeker fill,
  a breathing play button, a live typing indicator, and floating emoji reactions drifting
  up over the video. The party auto-reacts every few seconds to keep the scene alive.
- **Real interactions** — click the poster to play/pause, press `/` to focus the chatbar,
  send messages (they group iMessage-style), tap the quick-reaction row to launch emoji.

## Tweaking for the thumbnail

- Chat content, members, and show metadata live in `src/data.ts`.
- Palette + fonts are Tailwind theme tokens in `src/global.css` (`@theme` block).
- The poster art is `PosterArt` in `src/components/VideoStage.tsx` — swap in a real frame
  capture by replacing its gradient layers with an `<img>`.
