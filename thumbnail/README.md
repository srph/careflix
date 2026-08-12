# Care.tv — Watch Page Thumbnail

A Vite + React spinoff that recreates the **watch page sidebar** from `../ui` for use as a
portfolio project thumbnail. It reuses the original fonts (`halyard-display` via Typekit +
`Work Sans`), the full color palette, and the actual class structure of the app's
`ChatWidget` and `PlayerModal`.

## Run

```bash
npm install
npm run dev
```

Opens at http://localhost:5273.

## What's here

- **Sidebar (the highlight)** — `src/components/ChatSidebar.tsx`
  - Online presence avatar group + invite button (`.watch-screen-canopy`)
  - Tip card, grouped chat messages (self = pink bubbles), activity logs
  - Chatbar with the `Press / to focus` input + pink send button
- **Video stage** — `src/components/VideoStage.tsx`
  - A swappable dark poster with the player control bar peeking at the bottom.
  - No real `<video>`. Drop in a frame capture by setting `background-image` on
    `.watch-screen-video > .poster` (see `VideoStage.css`).

## Tweaking for the thumbnail

- Chat content lives in `src/data.ts` (users, presence, messages, the tip).
- Design tokens are in `src/global.css` — identical to the app's.
