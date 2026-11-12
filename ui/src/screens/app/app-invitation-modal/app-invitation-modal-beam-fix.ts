// G2 in the beam tuner (.kier/designs/e9b4) was designed on border-beam 1.4.1, whose candy
// palette has malformed colours (`rgba(r, g, b,, a)`). Browsers drop the inner glow's and bloom's
// backgrounds, so the designed look is the travelling stroke plus the inner layer's soft edge
// shadow. Clearing those backgrounds pins that look, even after the palette is fixed upstream
// (https://github.com/Jakubantalik/Libraries.dev/pull/15).
export const CANDY_LINE_STROKE_ONLY = `
[data-beam="{id}"][data-active]::before,
[data-beam="{id}"][data-fading]::before,
[data-beam="{id}"] [data-beam-bloom] {
  background: none;
}
`
