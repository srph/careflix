import { jsxs as ve, Fragment as Ie, jsx as We } from "react/jsx-runtime";
import { forwardRef as Le, useId as Be, useRef as Pe, useState as E, useEffect as A, useCallback as He, useMemo as Xe } from "react";
const Ee = {
  sm: {
    borderRadius: 32,
    borderWidth: 1,
    width: 70,
    height: 36
  },
  md: {
    borderRadius: 16,
    borderWidth: 1
  },
  line: {
    borderRadius: 16,
    borderWidth: 1
  },
  "pulse-outside": {
    borderRadius: 16,
    borderWidth: 1
  },
  "pulse-inner": {
    borderRadius: 16,
    borderWidth: 1
  }
}, pe = {
  sm: {
    dark: {
      strokeOpacity: 0.46,
      innerOpacity: 0.24,
      bloomOpacity: 0.38,
      innerShadow: "rgba(255, 255, 255, 0.3)",
      saturation: 1.2
    },
    light: {
      strokeOpacity: 0.12,
      innerOpacity: 0.3,
      bloomOpacity: 0.16,
      innerShadow: "rgba(0, 0, 0, 0.14)",
      saturation: 1.8
    }
  },
  md: {
    dark: {
      strokeOpacity: 0.26,
      innerOpacity: 0.42,
      bloomOpacity: 0.24,
      innerShadow: "rgba(255, 255, 255, 0.27)",
      saturation: 1.2
    },
    light: {
      strokeOpacity: 0.12,
      innerOpacity: 0.26,
      bloomOpacity: 0.34,
      innerShadow: "rgba(0, 0, 0, 0.14)",
      saturation: 1.5
    }
  },
  line: {
    dark: {
      strokeOpacity: 1.14,
      innerOpacity: 0.7,
      bloomOpacity: 0.8,
      innerShadow: "rgba(255, 255, 255, 0.1)",
      saturation: 1.2
    },
    light: {
      strokeOpacity: 0.16,
      innerOpacity: 0.32,
      bloomOpacity: 0.3,
      innerShadow: "rgba(0, 0, 0, 0.14)",
      saturation: 1.95
    }
  },
  // Pulse Outside — outward-blooming breathe (ported from v5 "Breathe Outside Uncropped" / c6)
  "pulse-outside": {
    dark: {
      strokeOpacity: 0.94,
      innerOpacity: 0.34,
      bloomOpacity: 0.3,
      innerShadow: "transparent",
      saturation: 1.2,
      brightness: 1.9,
      // v5 Card 5 frames the card with a single 1px hairline (its box-shadow at
      // 0.3). Wrapped components here already supply their own ~equivalent 1px
      // border, so the beam must NOT add a second hairline on top or the edge
      // reads brighter than v5. Kept at 0 to match v5's single-hairline look.
      hairlineOpacity: 0
    },
    light: {
      strokeOpacity: 1.96,
      innerOpacity: 1.04,
      bloomOpacity: 0.42,
      innerShadow: "transparent",
      saturation: 0.6,
      brightness: 1.7,
      hairlineOpacity: 0
    }
  },
  // Pulse Inner — contained breathe (ported from v5 "Breathe" / c4)
  "pulse-inner": {
    dark: {
      strokeOpacity: 1.54,
      innerOpacity: 0.44,
      bloomOpacity: 0.66,
      innerShadow: "transparent",
      saturation: 1.2,
      brightness: 0.75
    },
    light: {
      strokeOpacity: 0.32,
      innerOpacity: 0.4,
      bloomOpacity: 0.8,
      innerShadow: "transparent",
      saturation: 0.75,
      brightness: 1.3
    }
  }
}, vo = {
  dark: { ...pe.md.dark },
  light: { ...pe.md.light }
}, G = {
  colorful: {
    border: [
      { color: "rgb(255, 50, 100)", pos: "33% -7.4%", size: "70px 40px" },
      { color: "rgb(40, 140, 255)", pos: "12% -5%", size: "60px 35px" },
      { color: "rgb(50, 200, 80)", pos: "2.1% 68.3%", size: "40px 70px" },
      { color: "rgb(30, 185, 170)", pos: "2.1% 68.3%", size: "20px 35px" },
      { color: "rgb(100, 70, 255)", pos: "74.4% 100%", size: "180px 32px" },
      { color: "rgb(40, 140, 255)", pos: "55% 100%", size: "85px 26px" },
      { color: "rgb(255, 120, 40)", pos: "93.9% 0%", size: "74px 32px" },
      { color: "rgb(240, 50, 180)", pos: "100% 27.1%", size: "26px 42px" },
      { color: "rgb(180, 40, 240)", pos: "100% 27.1%", size: "52px 48px" }
    ],
    spike: { primary: "rgb(255, 60, 80)", secondary: "rgba(40, 190, 180, 0.98)" },
    spikeLt: { primary: "rgb(200, 30, 60)", secondary: "rgb(20, 150, 140)" }
  },
  mono: {
    border: [
      { color: "rgb(180, 180, 180)", pos: "33% -7.4%", size: "70px 40px" },
      { color: "rgb(140, 140, 140)", pos: "12% -5%", size: "60px 35px" },
      { color: "rgb(160, 160, 160)", pos: "2.1% 68.3%", size: "40px 70px" },
      { color: "rgb(130, 130, 130)", pos: "2.1% 68.3%", size: "20px 35px" },
      { color: "rgb(170, 170, 170)", pos: "74.4% 100%", size: "180px 32px" },
      { color: "rgb(150, 150, 150)", pos: "55% 100%", size: "85px 26px" },
      { color: "rgb(190, 190, 190)", pos: "93.9% 0%", size: "74px 32px" },
      { color: "rgb(145, 145, 145)", pos: "100% 27.1%", size: "26px 42px" },
      { color: "rgb(165, 165, 165)", pos: "100% 27.1%", size: "52px 48px" }
    ],
    spike: { primary: "rgb(200, 200, 200)", secondary: "rgb(170, 170, 170)" },
    spikeLt: { primary: "rgb(80, 80, 80)", secondary: "rgb(120, 120, 120)" }
  },
  ocean: {
    border: [
      { color: "rgb(100, 80, 220)", pos: "33% -7.4%", size: "70px 40px" },
      { color: "rgb(60, 120, 255)", pos: "12% -5%", size: "60px 35px" },
      { color: "rgb(80, 100, 200)", pos: "2.1% 68.3%", size: "40px 70px" },
      { color: "rgb(50, 140, 220)", pos: "2.1% 68.3%", size: "20px 35px" },
      { color: "rgb(120, 80, 255)", pos: "74.4% 100%", size: "180px 32px" },
      { color: "rgb(70, 130, 255)", pos: "55% 100%", size: "85px 26px" },
      { color: "rgb(140, 100, 240)", pos: "93.9% 0%", size: "74px 32px" },
      { color: "rgb(90, 110, 230)", pos: "100% 27.1%", size: "26px 42px" },
      { color: "rgb(130, 70, 255)", pos: "100% 27.1%", size: "52px 48px" }
    ],
    spike: { primary: "rgb(100, 120, 255)", secondary: "rgba(130, 100, 220, 0.98)" },
    spikeLt: { primary: "rgb(60, 60, 180)", secondary: "rgb(80, 100, 200)" }
  },
  sunset: {
    border: [
      { color: "rgb(255, 80, 50)", pos: "33% -7.4%", size: "70px 40px" },
      { color: "rgb(255, 160, 40)", pos: "12% -5%", size: "60px 35px" },
      { color: "rgb(255, 120, 60)", pos: "2.1% 68.3%", size: "40px 70px" },
      { color: "rgb(255, 200, 50)", pos: "2.1% 68.3%", size: "20px 35px" },
      { color: "rgb(255, 100, 80)", pos: "74.4% 100%", size: "180px 32px" },
      { color: "rgb(255, 180, 60)", pos: "55% 100%", size: "85px 26px" },
      { color: "rgb(255, 60, 60)", pos: "93.9% 0%", size: "74px 32px" },
      { color: "rgb(255, 140, 50)", pos: "100% 27.1%", size: "26px 42px" },
      { color: "rgb(255, 90, 70)", pos: "100% 27.1%", size: "52px 48px" }
    ],
    spike: { primary: "rgb(255, 140, 80)", secondary: "rgba(255, 100, 60, 0.98)" },
    spikeLt: { primary: "rgb(200, 80, 40)", secondary: "rgb(220, 120, 30)" }
  },
  forest: {
    border: [
      { color: "rgb(46, 160, 90)", pos: "33% -7.4%", size: "70px 40px" },
      { color: "rgb(30, 190, 120)", pos: "12% -5%", size: "60px 35px" },
      { color: "rgb(70, 180, 70)", pos: "2.1% 68.3%", size: "40px 70px" },
      { color: "rgb(20, 150, 130)", pos: "2.1% 68.3%", size: "20px 35px" },
      { color: "rgb(90, 200, 80)", pos: "74.4% 100%", size: "180px 32px" },
      { color: "rgb(40, 170, 110)", pos: "55% 100%", size: "85px 26px" },
      { color: "rgb(120, 210, 70)", pos: "93.9% 0%", size: "74px 32px" },
      { color: "rgb(35, 145, 100)", pos: "100% 27.1%", size: "26px 42px" },
      { color: "rgb(60, 195, 140)", pos: "100% 27.1%", size: "52px 48px" }
    ],
    spike: { primary: "rgb(46, 160, 90)", secondary: "rgba(30, 190, 120,, 0.98)" },
    spikeLt: { primary: "rgb(33, 115, 65)", secondary: "rgb(22, 137, 86)" }
  },
  candy: {
    border: [
      { color: "rgb(240, 70, 170)", pos: "33% -7.4%", size: "70px 40px" },
      { color: "rgb(255, 90, 140)", pos: "12% -5%", size: "60px 35px" },
      { color: "rgb(215, 60, 200)", pos: "2.1% 68.3%", size: "40px 70px" },
      { color: "rgb(255, 110, 180)", pos: "2.1% 68.3%", size: "20px 35px" },
      { color: "rgb(200, 80, 240)", pos: "74.4% 100%", size: "180px 32px" },
      { color: "rgb(250, 60, 150)", pos: "55% 100%", size: "85px 26px" },
      { color: "rgb(230, 120, 220)", pos: "93.9% 0%", size: "74px 32px" },
      { color: "rgb(245, 85, 165)", pos: "100% 27.1%", size: "26px 42px" },
      { color: "rgb(210, 70, 230)", pos: "100% 27.1%", size: "52px 48px" }
    ],
    spike: { primary: "rgb(240, 70, 170)", secondary: "rgba(255, 90, 140,, 0.98)" },
    spikeLt: { primary: "rgb(173, 50, 122)", secondary: "rgb(184, 65, 101)" }
  },
  ice: {
    border: [
      { color: "rgb(90, 200, 240)", pos: "33% -7.4%", size: "70px 40px" },
      { color: "rgb(60, 175, 230)", pos: "12% -5%", size: "60px 35px" },
      { color: "rgb(130, 220, 250)", pos: "2.1% 68.3%", size: "40px 70px" },
      { color: "rgb(70, 190, 215)", pos: "2.1% 68.3%", size: "20px 35px" },
      { color: "rgb(110, 210, 255)", pos: "74.4% 100%", size: "180px 32px" },
      { color: "rgb(50, 165, 220)", pos: "55% 100%", size: "85px 26px" },
      { color: "rgb(150, 230, 250)", pos: "93.9% 0%", size: "74px 32px" },
      { color: "rgb(85, 195, 235)", pos: "100% 27.1%", size: "26px 42px" },
      { color: "rgb(65, 180, 245)", pos: "100% 27.1%", size: "52px 48px" }
    ],
    spike: { primary: "rgb(90, 200, 240)", secondary: "rgba(60, 175, 230,, 0.98)" },
    spikeLt: { primary: "rgb(65, 144, 173)", secondary: "rgb(43, 126, 166)" }
  },
  gold: {
    border: [
      { color: "rgb(240, 190, 60)", pos: "33% -7.4%", size: "70px 40px" },
      { color: "rgb(255, 210, 90)", pos: "12% -5%", size: "60px 35px" },
      { color: "rgb(225, 165, 40)", pos: "2.1% 68.3%", size: "40px 70px" },
      { color: "rgb(250, 200, 70)", pos: "2.1% 68.3%", size: "20px 35px" },
      { color: "rgb(255, 225, 120)", pos: "74.4% 100%", size: "180px 32px" },
      { color: "rgb(230, 175, 50)", pos: "55% 100%", size: "85px 26px" },
      { color: "rgb(245, 205, 85)", pos: "93.9% 0%", size: "74px 32px" },
      { color: "rgb(215, 155, 35)", pos: "100% 27.1%", size: "26px 42px" },
      { color: "rgb(255, 215, 100)", pos: "100% 27.1%", size: "52px 48px" }
    ],
    spike: { primary: "rgb(240, 190, 60)", secondary: "rgba(255, 210, 90,, 0.98)" },
    spikeLt: { primary: "rgb(173, 137, 43)", secondary: "rgb(184, 151, 65)" }
  }
}, Se = {
  colorful: {
    border: [
      { color: "rgb(50, 200, 80)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgb(30, 185, 170)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgb(255, 120, 40)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgb(100, 70, 255)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgb(240, 50, 180)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgb(180, 40, 240)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgb(40, 140, 255)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgb(255, 50, 100)", pos: "100% 27%", size: "11px 12px" }
    ],
    inner: [
      { color: "rgba(50, 200, 80, 0.5)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgba(30, 185, 170, 0.45)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgba(255, 120, 40, 0.35)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgba(100, 70, 255, 0.35)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgba(240, 50, 180, 0.3)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgba(180, 40, 240, 0.4)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgba(40, 140, 255, 0.3)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgba(255, 50, 100, 0.3)", pos: "100% 27%", size: "11px 12px" }
    ]
  },
  mono: {
    border: [
      { color: "rgb(160, 160, 160)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgb(140, 140, 140)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgb(180, 180, 180)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgb(150, 150, 150)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgb(170, 170, 170)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgb(155, 155, 155)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgb(145, 145, 145)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgb(165, 165, 165)", pos: "100% 27%", size: "11px 12px" }
    ],
    inner: [
      { color: "rgba(160, 160, 160, 0.25)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgba(140, 140, 140, 0.22)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgba(180, 180, 180, 0.17)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgba(150, 150, 150, 0.17)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgba(170, 170, 170, 0.15)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgba(155, 155, 155, 0.20)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgba(145, 145, 145, 0.15)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgba(165, 165, 165, 0.15)", pos: "100% 27%", size: "11px 12px" }
    ]
  },
  ocean: {
    border: [
      { color: "rgb(60, 140, 200)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgb(50, 120, 180)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgb(100, 80, 220)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgb(80, 100, 255)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgb(120, 70, 240)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgb(90, 80, 220)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgb(70, 110, 255)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgb(110, 90, 230)", pos: "100% 27%", size: "11px 12px" }
    ],
    inner: [
      { color: "rgba(60, 140, 200, 0.5)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgba(50, 120, 180, 0.45)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgba(100, 80, 220, 0.35)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgba(80, 100, 255, 0.35)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgba(120, 70, 240, 0.3)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgba(90, 80, 220, 0.4)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgba(70, 110, 255, 0.3)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgba(110, 90, 230, 0.3)", pos: "100% 27%", size: "11px 12px" }
    ]
  },
  sunset: {
    border: [
      { color: "rgb(255, 180, 50)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgb(255, 150, 40)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgb(255, 80, 60)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgb(255, 100, 80)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgb(255, 60, 80)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgb(255, 120, 60)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgb(255, 200, 50)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgb(255, 90, 70)", pos: "100% 27%", size: "11px 12px" }
    ],
    inner: [
      { color: "rgba(255, 180, 50, 0.5)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgba(255, 150, 40, 0.45)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgba(255, 80, 60, 0.35)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgba(255, 100, 80, 0.35)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgba(255, 60, 80, 0.3)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgba(255, 120, 60, 0.4)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgba(255, 200, 50, 0.3)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgba(255, 90, 70, 0.3)", pos: "100% 27%", size: "11px 12px" }
    ]
  },
  forest: {
    border: [
      { color: "rgb(46, 160, 90)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgb(30, 190, 120)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgb(70, 180, 70)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgb(20, 150, 130)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgb(90, 200, 80)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgb(40, 170, 110)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgb(120, 210, 70)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgb(35, 145, 100)", pos: "100% 27%", size: "11px 12px" }
    ],
    inner: [
      { color: "rgba(60, 195, 140,, 0.5)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgba(46, 160, 90,, 0.45)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgba(30, 190, 120,, 0.35)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgba(70, 180, 70,, 0.35)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgba(20, 150, 130,, 0.3)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgba(90, 200, 80,, 0.4)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgba(40, 170, 110,, 0.3)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgba(120, 210, 70,, 0.3)", pos: "100% 27%", size: "11px 12px" }
    ]
  },
  candy: {
    border: [
      { color: "rgb(240, 70, 170)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgb(255, 90, 140)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgb(215, 60, 200)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgb(255, 110, 180)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgb(200, 80, 240)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgb(250, 60, 150)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgb(230, 120, 220)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgb(245, 85, 165)", pos: "100% 27%", size: "11px 12px" }
    ],
    inner: [
      { color: "rgba(210, 70, 230,, 0.5)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgba(240, 70, 170,, 0.45)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgba(255, 90, 140,, 0.35)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgba(215, 60, 200,, 0.35)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgba(255, 110, 180,, 0.3)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgba(200, 80, 240,, 0.4)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgba(250, 60, 150,, 0.3)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgba(230, 120, 220,, 0.3)", pos: "100% 27%", size: "11px 12px" }
    ]
  },
  ice: {
    border: [
      { color: "rgb(90, 200, 240)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgb(60, 175, 230)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgb(130, 220, 250)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgb(70, 190, 215)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgb(110, 210, 255)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgb(50, 165, 220)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgb(150, 230, 250)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgb(85, 195, 235)", pos: "100% 27%", size: "11px 12px" }
    ],
    inner: [
      { color: "rgba(65, 180, 245,, 0.5)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgba(90, 200, 240,, 0.45)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgba(60, 175, 230,, 0.35)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgba(130, 220, 250,, 0.35)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgba(70, 190, 215,, 0.3)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgba(110, 210, 255,, 0.4)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgba(50, 165, 220,, 0.3)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgba(150, 230, 250,, 0.3)", pos: "100% 27%", size: "11px 12px" }
    ]
  },
  gold: {
    border: [
      { color: "rgb(240, 190, 60)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgb(255, 210, 90)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgb(225, 165, 40)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgb(250, 200, 70)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgb(255, 225, 120)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgb(230, 175, 50)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgb(245, 205, 85)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgb(215, 155, 35)", pos: "100% 27%", size: "11px 12px" }
    ],
    inner: [
      { color: "rgba(255, 215, 100,, 0.5)", pos: "2% 68%", size: "9px 18px" },
      { color: "rgba(240, 190, 60,, 0.45)", pos: "2% 68%", size: "4px 8px" },
      { color: "rgba(255, 210, 90,, 0.35)", pos: "72% -3%", size: "59px 9px" },
      { color: "rgba(225, 165, 40,, 0.35)", pos: "74% 100%", size: "42px 7px" },
      { color: "rgba(250, 200, 70,, 0.3)", pos: "100% 27%", size: "10px 17px" },
      { color: "rgba(255, 225, 120,, 0.4)", pos: "100% 27%", size: "10px 18px" },
      { color: "rgba(230, 175, 50,, 0.3)", pos: "100% 27%", size: "5px 10px" },
      { color: "rgba(245, 205, 85,, 0.3)", pos: "100% 27%", size: "11px 12px" }
    ]
  }
};
function Ae(a) {
  return Se[a].border.map((o) => `radial-gradient(ellipse ${o.size} at ${o.pos}, ${o.color}, transparent)`).join(`,
    `);
}
function _e(a) {
  return Se[a].inner.map((o) => `radial-gradient(ellipse ${o.size} at ${o.pos}, ${o.color}, transparent)`).join(`,
    `);
}
function je(a) {
  return G[a].border.map((o) => `radial-gradient(ellipse ${o.size} at ${o.pos}, ${o.color}, transparent)`).join(`,
    `);
}
function Te(a) {
  const e = G[a], o = a === "mono" ? 0.225 : 0.45;
  return e.border.map((r) => {
    const t = r.color.replace("rgb(", "rgba(").replace(")", `, ${o})`);
    return `radial-gradient(ellipse ${r.size.split(" ").map((i) => {
      const c = parseInt(i);
      return `${Math.round(c * 0.9)}px`;
    }).join(" ")} at ${r.pos}, ${t}, transparent)`;
  }).join(`,
    `);
}
function Ne(a, e) {
  const o = G[a];
  return e ? o.spike : o.spikeLt;
}
const Ve = {
  colorful: {
    dark: [
      { color: "rgb(255, 50, 100)", sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(40, 180, 220)", sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: "rgb(50, 200, 80)", sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: "rgb(180, 40, 240)", sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: "rgb(255, 160, 30)", sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: "rgb(100, 70, 255)", sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: "rgb(40, 140, 255)", sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: "rgb(240, 50, 180)", sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: "rgb(30, 185, 170)", sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 }
    ],
    light: [
      { color: "rgb(255, 50, 100)", sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(40, 140, 255)", sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: "rgb(50, 200, 80)", sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: "rgb(180, 40, 240)", sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: "rgb(30, 185, 170)", sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: "rgb(100, 70, 255)", sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: "rgb(40, 140, 255)", sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: "rgb(255, 120, 40)", sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: "rgb(240, 50, 180)", sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 }
    ]
  },
  mono: {
    dark: [
      { color: "rgb(200, 200, 200)", sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(170, 170, 170)", sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: "rgb(155, 155, 155)", sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: "rgb(185, 185, 185)", sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: "rgb(165, 165, 165)", sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: "rgb(180, 180, 180)", sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: "rgb(160, 160, 160)", sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: "rgb(175, 175, 175)", sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: "rgb(190, 190, 190)", sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 }
    ],
    light: [
      { color: "rgb(100, 100, 100)", sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(80, 80, 80)", sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: "rgb(90, 90, 90)", sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: "rgb(70, 70, 70)", sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: "rgb(85, 85, 85)", sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: "rgb(95, 95, 95)", sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: "rgb(75, 75, 75)", sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: "rgb(105, 105, 105)", sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: "rgb(65, 65, 65)", sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 }
    ]
  },
  ocean: {
    dark: [
      { color: "rgb(100, 80, 220)", sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(60, 120, 255)", sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: "rgb(80, 100, 200)", sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: "rgb(130, 70, 255)", sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: "rgb(70, 130, 255)", sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: "rgb(120, 80, 255)", sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: "rgb(90, 110, 230)", sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: "rgb(110, 90, 240)", sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: "rgb(140, 100, 255)", sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 }
    ],
    light: [
      { color: "rgb(80, 60, 200)", sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(50, 100, 220)", sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: "rgb(70, 90, 190)", sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: "rgb(110, 60, 220)", sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: "rgb(60, 110, 230)", sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: "rgb(100, 70, 240)", sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: "rgb(80, 100, 210)", sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: "rgb(90, 80, 225)", sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: "rgb(120, 90, 245)", sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 }
    ]
  },
  sunset: {
    dark: [
      { color: "rgb(255, 100, 60)", sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(255, 180, 50)", sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: "rgb(255, 140, 70)", sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: "rgb(255, 80, 80)", sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: "rgb(255, 200, 60)", sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: "rgb(255, 120, 50)", sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: "rgb(255, 160, 80)", sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: "rgb(255, 90, 60)", sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: "rgb(255, 70, 70)", sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 }
    ],
    light: [
      { color: "rgb(220, 80, 40)", sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(230, 150, 30)", sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: "rgb(210, 110, 50)", sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: "rgb(200, 60, 60)", sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: "rgb(220, 170, 40)", sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: "rgb(210, 100, 30)", sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: "rgb(230, 130, 60)", sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: "rgb(190, 70, 50)", sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: "rgb(180, 50, 50)", sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 }
    ]
  },
  forest: {
    dark: [
      { color: "rgb(46, 160, 90)", sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(30, 190, 120)", sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: "rgb(70, 180, 70)", sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: "rgb(20, 150, 130)", sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: "rgb(90, 200, 80)", sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: "rgb(40, 170, 110)", sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: "rgb(120, 210, 70)", sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: "rgb(35, 145, 100)", sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: "rgb(60, 195, 140)", sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 }
    ],
    light: [
      { color: "rgb(33, 115, 65)", sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(22, 137, 86)", sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: "rgb(50, 130, 50)", sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: "rgb(14, 108, 94)", sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: "rgb(65, 144, 58)", sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: "rgb(29, 122, 79)", sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: "rgb(86, 151, 50)", sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: "rgb(25, 104, 72)", sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: "rgb(43, 140, 101)", sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 }
    ]
  },
  candy: {
    dark: [
      { color: "rgb(240, 70, 170)", sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(255, 90, 140)", sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: "rgb(215, 60, 200)", sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: "rgb(255, 110, 180)", sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: "rgb(200, 80, 240)", sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: "rgb(250, 60, 150)", sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: "rgb(230, 120, 220)", sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: "rgb(245, 85, 165)", sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: "rgb(210, 70, 230)", sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 }
    ],
    light: [
      { color: "rgb(173, 50, 122)", sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(184, 65, 101)", sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: "rgb(155, 43, 144)", sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: "rgb(184, 79, 130)", sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: "rgb(144, 58, 173)", sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: "rgb(180, 43, 108)", sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: "rgb(166, 86, 158)", sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: "rgb(176, 61, 119)", sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: "rgb(151, 50, 166)", sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 }
    ]
  },
  ice: {
    dark: [
      { color: "rgb(90, 200, 240)", sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(60, 175, 230)", sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: "rgb(130, 220, 250)", sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: "rgb(70, 190, 215)", sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: "rgb(110, 210, 255)", sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: "rgb(50, 165, 220)", sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: "rgb(150, 230, 250)", sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: "rgb(85, 195, 235)", sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: "rgb(65, 180, 245)", sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 }
    ],
    light: [
      { color: "rgb(65, 144, 173)", sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(43, 126, 166)", sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: "rgb(94, 158, 180)", sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: "rgb(50, 137, 155)", sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: "rgb(79, 151, 184)", sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: "rgb(36, 119, 158)", sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: "rgb(108, 166, 180)", sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: "rgb(61, 140, 169)", sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: "rgb(47, 130, 176)", sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 }
    ]
  },
  gold: {
    dark: [
      { color: "rgb(240, 190, 60)", sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(255, 210, 90)", sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: "rgb(225, 165, 40)", sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: "rgb(250, 200, 70)", sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: "rgb(255, 225, 120)", sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: "rgb(230, 175, 50)", sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: "rgb(245, 205, 85)", sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: "rgb(215, 155, 35)", sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: "rgb(255, 215, 100)", sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 }
    ],
    light: [
      { color: "rgb(173, 137, 43)", sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: "rgb(184, 151, 65)", sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: "rgb(162, 119, 29)", sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: "rgb(180, 144, 50)", sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: "rgb(184, 162, 86)", sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: "rgb(166, 126, 36)", sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: "rgb(176, 148, 61)", sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: "rgb(155, 112, 25)", sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: "rgb(184, 155, 72)", sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 }
    ]
  }
};
function De(a, e, o) {
  return Ve[a][e ? "dark" : "light"].map((t) => {
    const s = t.offsetX === 0 ? "" : t.offsetX > 0 ? ` + ${t.offsetX}px` : ` - ${Math.abs(t.offsetX)}px`, i = t.offsetY === 0 ? "" : t.offsetY > 0 ? ` + ${t.offsetY}px` : ` - ${Math.abs(t.offsetY)}px`;
    return `radial-gradient(ellipse calc(${t.sizeW}px * var(--beam-w-${o})) calc(${t.sizeH}px * var(--beam-h-${o})) at calc(var(--beam-x-${o}) * 100%${s}) calc(100%${i}), ${t.color}, transparent)`;
  }).join(`,
       `);
}
const Ue = {
  colorful: [
    { color: "rgba(255, 50, 100, 0.48)", sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: "rgba(40, 180, 220, 0.42)", sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: "rgba(50, 200, 80, 0.48)", sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: "rgba(180, 40, 240, 0.42)", sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: "rgba(255, 160, 30, 0.50)", sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: "rgba(100, 70, 255, 0.45)", sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: "rgba(40, 140, 255, 0.40)", sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: "rgba(240, 50, 180, 0.45)", sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: "rgba(30, 185, 170, 0.52)", sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 }
  ],
  mono: [
    { color: "rgba(200, 200, 200, 0.48)", sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: "rgba(170, 170, 170, 0.42)", sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: "rgba(155, 155, 155, 0.48)", sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: "rgba(185, 185, 185, 0.42)", sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: "rgba(165, 165, 165, 0.50)", sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: "rgba(180, 180, 180, 0.45)", sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: "rgba(160, 160, 160, 0.40)", sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: "rgba(175, 175, 175, 0.45)", sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: "rgba(190, 190, 190, 0.52)", sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 }
  ],
  ocean: [
    { color: "rgba(100, 80, 220, 0.48)", sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: "rgba(60, 120, 255, 0.42)", sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: "rgba(80, 100, 200, 0.48)", sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: "rgba(130, 70, 255, 0.42)", sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: "rgba(70, 130, 255, 0.50)", sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: "rgba(120, 80, 255, 0.45)", sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: "rgba(90, 110, 230, 0.40)", sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: "rgba(110, 90, 240, 0.45)", sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: "rgba(140, 100, 255, 0.52)", sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 }
  ],
  sunset: [
    { color: "rgba(255, 100, 60, 0.48)", sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: "rgba(255, 180, 50, 0.42)", sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: "rgba(255, 140, 70, 0.48)", sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: "rgba(255, 80, 80, 0.42)", sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: "rgba(255, 200, 60, 0.50)", sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: "rgba(255, 120, 50, 0.45)", sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: "rgba(255, 160, 80, 0.40)", sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: "rgba(255, 90, 60, 0.45)", sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: "rgba(255, 70, 70, 0.52)", sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 }
  ],
  forest: [
    { color: "rgba(46, 160, 90,, 0.48)", sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: "rgba(30, 190, 120,, 0.42)", sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: "rgba(70, 180, 70,, 0.48)", sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: "rgba(20, 150, 130,, 0.42)", sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: "rgba(90, 200, 80,, 0.50)", sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: "rgba(40, 170, 110,, 0.45)", sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: "rgba(120, 210, 70,, 0.40)", sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: "rgba(35, 145, 100,, 0.45)", sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: "rgba(60, 195, 140,, 0.52)", sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 }
  ],
  candy: [
    { color: "rgba(240, 70, 170,, 0.48)", sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: "rgba(255, 90, 140,, 0.42)", sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: "rgba(215, 60, 200,, 0.48)", sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: "rgba(255, 110, 180,, 0.42)", sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: "rgba(200, 80, 240,, 0.50)", sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: "rgba(250, 60, 150,, 0.45)", sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: "rgba(230, 120, 220,, 0.40)", sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: "rgba(245, 85, 165,, 0.45)", sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: "rgba(210, 70, 230,, 0.52)", sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 }
  ],
  ice: [
    { color: "rgba(90, 200, 240,, 0.48)", sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: "rgba(60, 175, 230,, 0.42)", sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: "rgba(130, 220, 250,, 0.48)", sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: "rgba(70, 190, 215,, 0.42)", sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: "rgba(110, 210, 255,, 0.50)", sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: "rgba(50, 165, 220,, 0.45)", sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: "rgba(150, 230, 250,, 0.40)", sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: "rgba(85, 195, 235,, 0.45)", sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: "rgba(65, 180, 245,, 0.52)", sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 }
  ],
  gold: [
    { color: "rgba(240, 190, 60,, 0.48)", sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: "rgba(255, 210, 90,, 0.42)", sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: "rgba(225, 165, 40,, 0.48)", sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: "rgba(250, 200, 70,, 0.42)", sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: "rgba(255, 225, 120,, 0.50)", sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: "rgba(230, 175, 50,, 0.45)", sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: "rgba(245, 205, 85,, 0.40)", sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: "rgba(215, 155, 35,, 0.45)", sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: "rgba(255, 215, 100,, 0.52)", sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 }
  ]
};
function Ke(a, e) {
  return Ue[a].map((r) => {
    const t = r.offsetX === 0 ? "" : r.offsetX > 0 ? ` + ${r.offsetX}px` : ` - ${Math.abs(r.offsetX)}px`, s = r.offsetY === 0 ? "" : ` - ${Math.abs(r.offsetY)}px`;
    return `radial-gradient(ellipse calc(${r.sizeW}px * var(--beam-w-${e})) calc(${r.sizeH}px * var(--beam-h-${e})) at calc(var(--beam-x-${e}) * 100%${t}) calc(100%${s}), ${r.color}, transparent)`;
  }).join(`,
    `);
}
const Qe = {
  colorful: {
    dark: {
      spikes: [
        { color1: "rgb(100, 70, 255)", color2: "rgba(100, 70, 255, 1)" },
        // 36%
        { color1: "rgba(255, 170, 40, 0.59)", color2: "rgba(255, 170, 40, 0.29)" },
        // 50%
        { color1: "rgb(50, 200, 100)", color2: "rgba(50, 200, 100, 1)" },
        // 64%
        { color1: "rgba(200, 50, 240, 0.91)", color2: "rgba(200, 50, 240, 0.45)" },
        // 78%
        { color1: "rgb(40, 140, 255)", color2: "rgba(40, 140, 255, 1)" }
        // 92%
      ]
    },
    light: {
      spikes: [
        { color1: "rgb(80, 50, 200)", color2: "rgba(80, 50, 200, 0.8)" },
        // 36%
        { color1: "rgba(210, 130, 0, 0.7)", color2: "rgba(210, 130, 0, 0.46)" },
        // 50%
        { color1: "rgb(30, 160, 70)", color2: "rgba(30, 160, 70, 0.82)" },
        // 64%
        { color1: "rgb(160, 30, 190)", color2: "rgba(160, 30, 190, 0.7)" },
        // 78%
        { color1: "rgb(30, 100, 200)", color2: "rgba(30, 100, 200, 0.78)" }
        // 92%
      ]
    }
  },
  mono: {
    dark: {
      spikes: [
        { color1: "rgb(200, 200, 200)", color2: "rgba(200, 200, 200, 1)" },
        { color1: "rgba(180, 180, 180, 0.59)", color2: "rgba(180, 180, 180, 0.29)" },
        { color1: "rgb(190, 190, 190)", color2: "rgba(190, 190, 190, 1)" },
        { color1: "rgba(170, 170, 170, 0.91)", color2: "rgba(170, 170, 170, 0.45)" },
        { color1: "rgb(185, 185, 185)", color2: "rgba(185, 185, 185, 1)" }
      ]
    },
    light: {
      spikes: [
        { color1: "rgb(80, 80, 80)", color2: "rgba(80, 80, 80, 0.8)" },
        { color1: "rgba(100, 100, 100, 0.7)", color2: "rgba(100, 100, 100, 0.46)" },
        { color1: "rgb(70, 70, 70)", color2: "rgba(70, 70, 70, 0.82)" },
        { color1: "rgb(90, 90, 90)", color2: "rgba(90, 90, 90, 0.7)" },
        { color1: "rgb(85, 85, 85)", color2: "rgba(85, 85, 85, 0.78)" }
      ]
    }
  },
  ocean: {
    dark: {
      spikes: [
        { color1: "rgb(100, 80, 255)", color2: "rgb(100, 80, 255)" },
        { color1: "rgba(80, 130, 220, 0.59)", color2: "rgba(80, 130, 220, 0.29)" },
        { color1: "rgb(60, 100, 255)", color2: "rgb(60, 100, 255)" },
        { color1: "rgba(90, 120, 200, 0.91)", color2: "rgba(90, 120, 200, 0.45)" },
        { color1: "rgb(120, 90, 255)", color2: "rgb(120, 90, 255)" }
      ]
    },
    light: {
      spikes: [
        { color1: "rgb(50, 40, 180)", color2: "rgba(50, 40, 180, 0.8)" },
        { color1: "rgba(40, 80, 200, 0.7)", color2: "rgba(40, 80, 200, 0.46)" },
        { color1: "rgb(30, 50, 190)", color2: "rgba(30, 50, 190, 0.82)" },
        { color1: "rgb(60, 90, 180)", color2: "rgba(60, 90, 180, 0.7)" },
        { color1: "rgb(70, 60, 200)", color2: "rgba(70, 60, 200, 0.78)" }
      ]
    }
  },
  sunset: {
    dark: {
      spikes: [
        { color1: "rgb(255, 100, 80)", color2: "rgb(255, 100, 80)" },
        { color1: "rgba(255, 150, 80, 0.59)", color2: "rgba(255, 150, 80, 0.29)" },
        { color1: "rgb(255, 80, 60)", color2: "rgb(255, 80, 60)" },
        { color1: "rgba(255, 120, 50, 0.91)", color2: "rgba(255, 120, 50, 0.45)" },
        { color1: "rgb(255, 140, 70)", color2: "rgb(255, 140, 70)" }
      ]
    },
    light: {
      spikes: [
        { color1: "rgb(200, 60, 30)", color2: "rgba(200, 60, 30, 0.8)" },
        { color1: "rgba(220, 100, 20, 0.7)", color2: "rgba(220, 100, 20, 0.46)" },
        { color1: "rgb(180, 40, 20)", color2: "rgba(180, 40, 20, 0.82)" },
        { color1: "rgb(210, 80, 10)", color2: "rgba(210, 80, 10, 0.7)" },
        { color1: "rgb(190, 70, 30)", color2: "rgba(190, 70, 30, 0.78)" }
      ]
    }
  },
  forest: {
    dark: {
      spikes: [
        { color1: "rgb(46, 160, 90)", color2: "rgb(30, 190, 120)" },
        { color1: "rgba(70, 180, 70,, 0.59)", color2: "rgba(20, 150, 130,, 0.29)" },
        { color1: "rgb(90, 200, 80)", color2: "rgb(40, 170, 110)" },
        { color1: "rgba(120, 210, 70,, 0.91)", color2: "rgba(35, 145, 100,, 0.45)" },
        { color1: "rgb(60, 195, 140)", color2: "rgb(46, 160, 90)" }
      ]
    },
    light: {
      spikes: [
        { color1: "rgb(33, 115, 65)", color2: "rgba(22, 137, 86,, 0.8)" },
        { color1: "rgba(50, 130, 50,, 0.7)", color2: "rgba(14, 108, 94,, 0.46)" },
        { color1: "rgb(65, 144, 58)", color2: "rgba(29, 122, 79,, 0.82)" },
        { color1: "rgb(86, 151, 50)", color2: "rgba(25, 104, 72,, 0.7)" },
        { color1: "rgb(43, 140, 101)", color2: "rgba(33, 115, 65,, 0.78)" }
      ]
    }
  },
  candy: {
    dark: {
      spikes: [
        { color1: "rgb(240, 70, 170)", color2: "rgb(255, 90, 140)" },
        { color1: "rgba(215, 60, 200,, 0.59)", color2: "rgba(255, 110, 180,, 0.29)" },
        { color1: "rgb(200, 80, 240)", color2: "rgb(250, 60, 150)" },
        { color1: "rgba(230, 120, 220,, 0.91)", color2: "rgba(245, 85, 165,, 0.45)" },
        { color1: "rgb(210, 70, 230)", color2: "rgb(240, 70, 170)" }
      ]
    },
    light: {
      spikes: [
        { color1: "rgb(173, 50, 122)", color2: "rgba(184, 65, 101,, 0.8)" },
        { color1: "rgba(155, 43, 144,, 0.7)", color2: "rgba(184, 79, 130,, 0.46)" },
        { color1: "rgb(144, 58, 173)", color2: "rgba(180, 43, 108,, 0.82)" },
        { color1: "rgb(166, 86, 158)", color2: "rgba(176, 61, 119,, 0.7)" },
        { color1: "rgb(151, 50, 166)", color2: "rgba(173, 50, 122,, 0.78)" }
      ]
    }
  },
  ice: {
    dark: {
      spikes: [
        { color1: "rgb(90, 200, 240)", color2: "rgb(60, 175, 230)" },
        { color1: "rgba(130, 220, 250,, 0.59)", color2: "rgba(70, 190, 215,, 0.29)" },
        { color1: "rgb(110, 210, 255)", color2: "rgb(50, 165, 220)" },
        { color1: "rgba(150, 230, 250,, 0.91)", color2: "rgba(85, 195, 235,, 0.45)" },
        { color1: "rgb(65, 180, 245)", color2: "rgb(90, 200, 240)" }
      ]
    },
    light: {
      spikes: [
        { color1: "rgb(65, 144, 173)", color2: "rgba(43, 126, 166,, 0.8)" },
        { color1: "rgba(94, 158, 180,, 0.7)", color2: "rgba(50, 137, 155,, 0.46)" },
        { color1: "rgb(79, 151, 184)", color2: "rgba(36, 119, 158,, 0.82)" },
        { color1: "rgb(108, 166, 180)", color2: "rgba(61, 140, 169,, 0.7)" },
        { color1: "rgb(47, 130, 176)", color2: "rgba(65, 144, 173,, 0.78)" }
      ]
    }
  },
  gold: {
    dark: {
      spikes: [
        { color1: "rgb(240, 190, 60)", color2: "rgb(255, 210, 90)" },
        { color1: "rgba(225, 165, 40,, 0.59)", color2: "rgba(250, 200, 70,, 0.29)" },
        { color1: "rgb(255, 225, 120)", color2: "rgb(230, 175, 50)" },
        { color1: "rgba(245, 205, 85,, 0.91)", color2: "rgba(215, 155, 35,, 0.45)" },
        { color1: "rgb(255, 215, 100)", color2: "rgb(240, 190, 60)" }
      ]
    },
    light: {
      spikes: [
        { color1: "rgb(173, 137, 43)", color2: "rgba(184, 151, 65,, 0.8)" },
        { color1: "rgba(162, 119, 29,, 0.7)", color2: "rgba(180, 144, 50,, 0.46)" },
        { color1: "rgb(184, 162, 86)", color2: "rgba(166, 126, 36,, 0.82)" },
        { color1: "rgb(176, 148, 61)", color2: "rgba(155, 112, 25,, 0.7)" },
        { color1: "rgb(184, 155, 72)", color2: "rgba(173, 137, 43,, 0.78)" }
      ]
    }
  }
};
function J(a, e) {
  const o = a.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*[\d.]+\s*\)$/);
  if (o) return `rgba(${o[1]}, ${o[2]}, ${o[3]}, ${e})`;
  const r = a.match(/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
  return r ? `rgba(${r[1]}, ${r[2]}, ${r[3]}, ${e})` : a;
}
function q(a, e) {
  const o = a.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
  if (o) return `rgba(${o[1]}, ${o[2]}, ${o[3]}, ${(parseFloat(o[4]) * e).toFixed(2)})`;
  const r = a.match(/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
  return r ? `rgba(${r[1]}, ${r[2]}, ${r[3]}, ${e.toFixed(2)})` : a;
}
function Ze(a, e, o) {
  const r = Ne(a, e), t = Qe[a][e ? "dark" : "light"], s = a === "mono", i = s ? 0.14 : 1, c = s ? q(r.primary, 0.14) : r.primary, p = s ? q(r.primary, 0.09) : r.primary, b = s ? q(r.secondary, 0.12) : r.secondary, g = s ? J(r.secondary, 0.06) : J(r.secondary, 0.49), n = t.spikes.map(
    (k) => s ? { color1: q(k.color1, i), color2: q(k.color2, i * 0.7) } : k
  ), l = s ? "12px" : "0.8px", f = s ? "14px" : "2px", W = s ? "12px" : "1.2px", y = s ? "10px" : "0.6px", d = s ? "42px" : "92px", m = s ? "38px" : "72px", H = s ? "40px" : "85px", X = s ? "32px" : "60px", O = s ? "12px" : "1px", $ = s ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 1)", Y = s ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0.9)", x = s ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.5)", w = s ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.3)", v = s ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.12)", u = s ? "rgba(255, 255, 255, 0.015)" : "rgba(255, 255, 255, 0.03)";
  if (e)
    return `radial-gradient(ellipse calc(${l} * var(--beam-spike-${o}) * var(--beam-spike-mul, 1)) calc(${d} * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 8% calc(100% - 2px), ${c}, ${p} 30%, transparent 88%),
       radial-gradient(ellipse calc(10px * var(--beam-spike2-${o}) * var(--beam-spike-mul, 1)) calc(35px * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 22% calc(100% - 4px), ${b}, ${g} 50%, transparent 95%),
       radial-gradient(ellipse calc(${f} * (2 - var(--beam-spike-${o})) * var(--beam-spike-mul, 1)) calc(${m} * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 36% calc(100% - 3px), ${n[0].color1}, ${n[0].color2} 40%, transparent 90%),
       radial-gradient(ellipse calc(14px * var(--beam-spike2-${o}) * var(--beam-spike-mul, 1)) calc(28px * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 50% calc(100% - 2px), ${n[1].color1}, ${n[1].color2} 55%, transparent 96%),
       radial-gradient(ellipse calc(${W} * (2 - var(--beam-spike2-${o})) * var(--beam-spike-mul, 1)) calc(${H} * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 64% calc(100% - 4px), ${n[2].color1}, ${n[2].color2} 35%, transparent 89%),
       radial-gradient(ellipse calc(7px * var(--beam-spike-${o}) * var(--beam-spike-mul, 1)) calc(45px * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 78% calc(100% - 2px), ${n[3].color1}, ${n[3].color2} 48%, transparent 94%),
       radial-gradient(ellipse calc(${y} * (2 - var(--beam-spike-${o})) * var(--beam-spike-mul, 1)) calc(${X} * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 92% calc(100% - 3px), ${n[4].color1}, ${n[4].color2} 42%, transparent 91%),
       radial-gradient(ellipse calc(21px * var(--beam-spike-${o})) calc(15px * var(--beam-spike2-${o})) at calc(var(--beam-x-${o}) * 100%) calc(100% + 1px), ${$} 0%, ${Y} 20%, ${x} 50%, transparent 100%),
       radial-gradient(ellipse calc(42px * var(--beam-w-${o})) calc(40px * var(--beam-h-${o})) at calc(var(--beam-x-${o}) * 100%) 100%, ${w} 0%, ${v} 25%, ${u} 55%, transparent 80%)`;
  {
    const k = s ? q(r.primary, 0.11) : J(r.primary, 0.85), z = s ? q(r.secondary, 0.09) : J(r.secondary, 0.7);
    return `radial-gradient(ellipse calc(${l} * var(--beam-spike-${o}) * var(--beam-spike-mul, 1)) calc(${d} * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 8% calc(100% - 2px), ${c}, ${k} 30%, transparent 88%),
       radial-gradient(ellipse calc(10px * var(--beam-spike2-${o}) * var(--beam-spike-mul, 1)) calc(35px * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 22% calc(100% - 4px), ${b}, ${z} 50%, transparent 95%),
       radial-gradient(ellipse calc(${f} * (2 - var(--beam-spike-${o})) * var(--beam-spike-mul, 1)) calc(${m} * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 36% calc(100% - 3px), ${n[0].color1}, ${n[0].color2} 40%, transparent 90%),
       radial-gradient(ellipse calc(14px * var(--beam-spike2-${o}) * var(--beam-spike-mul, 1)) calc(28px * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 50% calc(100% - 2px), ${n[1].color1}, ${n[1].color2} 55%, transparent 96%),
       radial-gradient(ellipse calc(${W} * (2 - var(--beam-spike2-${o})) * var(--beam-spike-mul, 1)) calc(${H} * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 64% calc(100% - 4px), ${n[2].color1}, ${n[2].color2} 35%, transparent 89%),
       radial-gradient(ellipse calc(7px * var(--beam-spike-${o}) * var(--beam-spike-mul, 1)) calc(45px * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 78% calc(100% - 2px), ${n[3].color1}, ${n[3].color2} 48%, transparent 94%),
       radial-gradient(ellipse calc(${O} * (2 - var(--beam-spike-${o})) * var(--beam-spike-mul, 1)) calc(${X} * var(--beam-h-${o}) * var(--beam-spike-mul, 1)) at 92% calc(100% - 3px), ${n[4].color1}, ${n[4].color2} 42%, transparent 91%),
       radial-gradient(ellipse calc(50px * var(--beam-w-${o})) calc(32px * var(--beam-h-${o})) at calc(var(--beam-x-${o}) * 100%) calc(100%), rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.18) 30%, rgba(0, 0, 0, 0.03) 60%, transparent 85%)`;
  }
}
const Fe = [
  { region: 1, quad: "tl" },
  { region: 2, quad: "tl" },
  { region: 3, quad: "bl" },
  { region: 1, quad: "bl" },
  { region: 2, quad: "br" },
  { region: 3, quad: "br" },
  { region: 1, quad: "tr" },
  { region: 2, quad: "tr" },
  { region: 3, quad: "tr" }
], Je = [
  [65, 35],
  [55, 30],
  [35, 65],
  [15, 30],
  [173, 28],
  [80, 22],
  [69, 28],
  [22, 38],
  [47, 44]
], eo = [
  { ci: 0, region: 1, quad: "tl", w: 84, h: 48 },
  { ci: 1, region: 2, quad: "tl", w: 72, h: 42 },
  { ci: 2, region: 3, quad: "bl", w: 48, h: 84 },
  { ci: 4, region: 2, quad: "br", w: 216, h: 38 },
  { ci: 5, region: 3, quad: "br", w: 102, h: 31 },
  { ci: 6, region: 1, quad: "tr", w: 89, h: 38 },
  { ci: 8, region: 3, quad: "tr", w: 62, h: 58 }
], Ye = [
  { ci: 0, region: 1, quad: "tl", w: 80, h: 19, x: "27%", y: "0%" },
  { ci: 6, region: 2, quad: "tr", w: 74, h: 11, x: "73%", y: "-1%" },
  { ci: 7, region: 3, quad: "tr", w: 15, h: 44, x: "100%", y: "33%" },
  { ci: 8, region: 1, quad: "br", w: 19, h: 38, x: "101%", y: "72%" },
  { ci: 4, region: 2, quad: "br", w: 84, h: 13, x: "67%", y: "100%" },
  { ci: 1, region: 3, quad: "bl", w: 60, h: 21, x: "24%", y: "101%" },
  { ci: 2, region: 1, quad: "bl", w: 17, h: 40, x: "0%", y: "60%" },
  { ci: 3, region: 2, quad: "tl", w: 13, h: 32, x: "-1%", y: "28%" }
], oo = [
  { ci: 0, region: 1, quad: "tl", w: 110, h: 30, x: "27%", y: "3%" },
  { ci: 6, region: 2, quad: "tr", w: 100, h: 20, x: "73%", y: "1%" },
  { ci: 7, region: 3, quad: "tr", w: 26, h: 62, x: "100%", y: "33%" },
  { ci: 8, region: 1, quad: "br", w: 30, h: 56, x: "101%", y: "72%" },
  { ci: 4, region: 2, quad: "br", w: 120, h: 22, x: "67%", y: "99%" },
  { ci: 1, region: 3, quad: "bl", w: 88, h: 32, x: "24%", y: "99%" },
  { ci: 2, region: 1, quad: "bl", w: 28, h: 58, x: "0%", y: "60%" }
];
function ro(a, e, o) {
  const r = a.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  return `rgba(${r ? `${r[1]}, ${r[2]}, ${r[3]}` : "255, 255, 255"}, var(--bop-${e}-${o}))`;
}
function fe(a, e, o, r, t, s, i, c) {
  return `radial-gradient(ellipse calc(${e}px * var(--bw${r}-${c}) * var(--pulse-glow-sx, 1) * var(--pulse-glow-boost, 1)) calc(${o}px * var(--bh${r}-${c}) * var(--bgh-${c}) * var(--pulse-glow-sy, 1) * var(--pulse-glow-boost, 1)) at calc(${s} + var(--bx${r}-${c})) calc(${i} + var(--by${r}-${c})), ${ro(a, t, c)}, transparent)`;
}
function ao(a, e) {
  return G[a].border.map((o, r) => {
    const { region: t, quad: s } = Fe[r], [i, c] = o.pos.split(" "), [p, b] = o.size.split(" ").map(parseFloat);
    return fe(o.color, p, b, t, s, i, c, e);
  }).join(`,
    `);
}
function to(a, e, o) {
  const t = G[a].border.map((b, g) => {
    const { region: n, quad: l } = Fe[g], [f, W] = b.pos.split(" "), [y, d] = Je[g];
    return fe(b.color, y, d, n, l, f, W, e);
  }), s = o ? "255, 255, 255" : "0, 0, 0", i = o ? 0.18 : 0.08, p = [
    ["0%", "0%", "tl"],
    ["100%", "0%", "tr"],
    ["0%", "100%", "bl"],
    ["100%", "100%", "br"]
  ].map(
    ([b, g, n]) => `radial-gradient(ellipse 60px 60px at ${b} ${g}, rgba(${s}, calc(${i} * var(--bop-${n}-${e}))), transparent 70%)`
  );
  return [...t, ...p].join(`,
    `);
}
function we(a, e, o) {
  const r = G[e].border;
  return a.map((t) => {
    const s = r[t.ci], [i, c] = s.pos.split(" ");
    return fe(s.color, t.w, t.h, t.region, t.quad, t.x ?? i, t.y ?? c, o);
  }).join(`,
    `);
}
function Re(a, e, o) {
  const r = G[e].border, t = +o.toFixed(3);
  return a.map((s) => {
    const i = r[s.ci], [c, p] = i.pos.split(" "), b = s.x ?? c, g = s.y ?? p, n = i.color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/), l = n ? `${n[1]}, ${n[2]}, ${n[3]}` : "255, 255, 255";
    return `radial-gradient(ellipse calc(${s.w}px * var(--pulse-glow-sx, 1) * var(--pulse-glow-boost, 1)) calc(${s.h}px * var(--pulse-glow-sy, 1) * var(--pulse-glow-boost, 1)) at ${b} ${g}, rgba(${l}, ${t}), transparent)`;
  }).join(`,
    `);
}
function N(a) {
  return `
[data-beam="${a}"][data-paused],
[data-beam="${a}"][data-paused]::after,
[data-beam="${a}"][data-paused]::before,
[data-beam="${a}"][data-paused] [data-beam-bloom] {
  animation-play-state: paused !important;
}`;
}
function Me(a) {
  const e = ["bw1", "bh1", "bw2", "bh2", "bw3", "bh3", "bgh", "bop-tl", "bop-tr", "bop-bl", "bop-br"], o = ["bx1", "by1", "bx2", "by2", "bx3", "by3"], r = e.map(
    (s) => `@property --${s}-${a} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}`
  ).join(`

`), t = o.map(
    (s) => `@property --${s}-${a} {
  syntax: "<length>";
  initial-value: 0px;
  inherits: true;
}`
  ).join(`

`);
  return `${r}

${t}

@property --beam-opacity-${a} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

@property --beam-hue-${a} {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: true;
}`;
}
function ge(a, e, o) {
  const r = e === "dark", t = o / 2.3;
  return a === "pulse-inner" ? {
    sp: 0.28,
    dr: r ? 33 : 40,
    op: r ? 0.48 : 0.45,
    gh: r ? 0.34 : 0.22,
    bs: (r ? 1.9 : 2.6) * t,
    ss: (r ? 2.6 : 4.6) * t,
    ghs: (r ? 2.4 : 5.5) * t,
    // Full hue revolution period (seconds) — colors continuously cycle.
    huePeriod: 16
  } : {
    sp: r ? 0.28 : 0.36,
    dr: r ? 14 : 19,
    op: r ? 0.46 : 0,
    gh: r ? 0.16 : 0.58,
    bs: (r ? 2.3 : 3.7) * t,
    ss: (r ? 6.4 : 4.6) * t,
    ghs: (r ? 2.4 : 3.8) * t,
    // Full hue revolution period (seconds) — colors continuously cycle.
    huePeriod: 14
  };
}
function so(a, e) {
  const { sp: o, dr: r, op: t, gh: s, bs: i, ss: c, ghs: p } = e;
  return [
    { prop: `--bw1-${a}`, a: 1 - o, b: 1 + o * 1.1, period: c * 0.9, delay: 0, unit: "" },
    { prop: `--bh1-${a}`, a: 1 + o * 0.9, b: 1 - o * 0.85, period: c * 1.26, delay: 0, unit: "" },
    { prop: `--bx1-${a}`, a: -r, b: r * 0.9, period: i * 1.6, delay: 0, unit: "px" },
    { prop: `--by1-${a}`, a: r * 0.55, b: -r * 0.7, period: i * 1.6, delay: 0, unit: "px" },
    { prop: `--bw2-${a}`, a: 1 + o, b: 1 - o * 0.85, period: c * 1.1, delay: 0, unit: "" },
    { prop: `--bh2-${a}`, a: 1 - o * 0.8, b: 1 + o * 1.05, period: c * 0.81, delay: 0, unit: "" },
    { prop: `--bx2-${a}`, a: r * 0.8, b: -r * 0.9, period: i * 1.88, delay: 0, unit: "px" },
    { prop: `--by2-${a}`, a: -r, b: r * 0.65, period: i * 1.88, delay: 0, unit: "px" },
    { prop: `--bw3-${a}`, a: 1 - o * 0.6, b: 1 + o * 1.15, period: c * 0.98, delay: 0, unit: "" },
    { prop: `--bh3-${a}`, a: 1 + o * 0.75, b: 1 - o, period: c * 1.4, delay: 0, unit: "" },
    { prop: `--bx3-${a}`, a: -r * 0.6, b: r, period: i * 1.45, delay: 0, unit: "px" },
    { prop: `--by3-${a}`, a: -r * 0.85, b: r * 0.45, period: i * 1.45, delay: 0, unit: "px" },
    { prop: `--bgh-${a}`, a: 1 - s, b: 1 + s, period: p, delay: 0, unit: "" },
    { prop: `--bop-tl-${a}`, a: 1 - t, b: 1, period: i, delay: 0, unit: "" },
    { prop: `--bop-tr-${a}`, a: 1 - t, b: 1, period: i * 1.32, delay: i * 0.28, unit: "" },
    { prop: `--bop-bl-${a}`, a: 1 - t, b: 1, period: i * 0.84, delay: i * 0.55, unit: "" },
    { prop: `--bop-br-${a}`, a: 1 - t, b: 1, period: i * 1.58, delay: i * 0.83, unit: "" }
  ];
}
function io(a, e, o, r, t, s) {
  if (a !== "pulse-inner" && a !== "pulse-outside") return null;
  const i = ge(a, e, o);
  return {
    oscillators: so(s, i),
    // Pulse colors continuously rotate a full hue circle so the palette is never
    // pinned to fixed edges (no more "always red top-right / green left").
    hue: t ? null : { prop: `--beam-hue-${s}`, range: 360, period: i.huePeriod, continuous: !0 }
  };
}
function ee(a, e, o) {
  return `  animation: ${e}-${a} ${o}s ease forwards;`;
}
function R(a, e = 1) {
  return Math.max(0.5, Math.round(a * e * 100) / 100);
}
function no(a) {
  const { size: e } = a;
  return e === "line" ? fo(a) : e === "sm" ? co(a) : e === "pulse-inner" ? po(a) : e === "pulse-outside" ? lo(a) : bo(a);
}
function co(a) {
  const {
    id: e,
    borderRadius: o,
    borderWidth: r,
    duration: t,
    strokeOpacity: s,
    innerOpacity: i,
    bloomOpacity: c,
    innerShadow: p,
    colorVariant: b,
    staticColors: g,
    brightness: n,
    saturation: l,
    hueRange: f,
    theme: W,
    glowSize: y = 1
  } = a, d = Math.max(0, o - r), m = b === "mono" ? 0.5 : 1, H = s * m, X = i * m, O = c * m, $ = g ? "" : `animation: beam-hue-shift-${e} 12s ease-in-out infinite;`, Y = g ? "" : `
@keyframes beam-hue-shift-${e} {
  0% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) - ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
  50% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) + ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
  100% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) - ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
}`, x = W === "dark", w = x ? `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 54%,
        rgba(255, 255, 255, 0.1) 57%,
        rgba(255, 255, 255, 0.3) 60%,
        rgba(255, 255, 255, 0.6) 63%,
        rgba(255, 255, 255, 0.75) 66%,
        rgba(255, 255, 255, 0.6) 69%,
        rgba(255, 255, 255, 0.3) 72%,
        rgba(255, 255, 255, 0.1) 75%,
        transparent 78%, transparent 100%
      )` : `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 54%,
        rgba(0, 0, 0, 0.08) 57%,
        rgba(0, 0, 0, 0.2) 60%,
        rgba(0, 0, 0, 0.4) 63%,
        rgba(0, 0, 0, 0.55) 66%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.2) 72%,
        rgba(0, 0, 0, 0.08) 75%,
        transparent 78%, transparent 100%
      )`, v = Ae(b), u = _e(b), k = x ? `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 58%,
        rgba(255, 255, 255, 0.03) 62%,
        rgba(255, 255, 255, 0.08) 65%,
        rgba(255, 255, 255, 0.2) 67%,
        rgba(255, 255, 255, 0.45) 69%,
        rgba(255, 255, 255, 0.85) 70%,
        rgba(255, 255, 255, 0.85) 70.5%,
        rgba(255, 255, 255, 0.45) 71.5%,
        rgba(255, 255, 255, 0.2) 73%,
        rgba(255, 255, 255, 0.08) 75%,
        rgba(255, 255, 255, 0.03) 78%,
        transparent 82%
      )` : `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 58%,
        rgba(0, 0, 0, 0.02) 62%,
        rgba(0, 0, 0, 0.08) 65%,
        rgba(0, 0, 0, 0.2) 67%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.6) 70%,
        rgba(0, 0, 0, 0.6) 70.5%,
        rgba(0, 0, 0, 0.4) 71.5%,
        rgba(0, 0, 0, 0.2) 73%,
        rgba(0, 0, 0, 0.08) 75%,
        rgba(0, 0, 0, 0.02) 78%,
        transparent 82%
      )`, z = `conic-gradient(
    from var(--beam-angle-${e}),
    transparent 0%, transparent 22%,
    rgba(255, 255, 255, 0.12) 28%, rgba(255, 255, 255, 0.4) 36%,
    white 46%, white 82%,
    rgba(255, 255, 255, 0.4) 88%, rgba(255, 255, 255, 0.12) 94%,
    transparent 97%, transparent 100%
  )`;
  return `
@property --beam-angle-${e} {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: true;
}

@property --beam-opacity-${e} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-beam="${e}"] {
  position: relative;
  border-radius: ${o}px;
  overflow: hidden;
}

[data-beam="${e}"][data-active] {
  animation:
    beam-spin-${e} ${t}s linear infinite,
    beam-fade-in-${e} 0.6s ease forwards;
}

[data-beam="${e}"][data-fading] {
  animation:
    beam-spin-${e} ${t}s linear infinite,
    beam-fade-out-${e} 0.5s ease forwards;
}

[data-beam="${e}"][data-active]::after,
[data-beam="${e}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${d}px;
  padding: ${r}px;
  clip-path: inset(0 round ${o}px);
  background: ${w},${v};
  -webkit-mask:
    conic-gradient(
      from var(--beam-angle-${e}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    conic-gradient(
      from var(--beam-angle-${e}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  z-index: 2;
  opacity: calc(var(--beam-opacity-${e}) * ${H.toFixed(2)} * var(--beam-stroke-opacity, 1) * var(--beam-strength, 1));
  ${$}
}

[data-beam="${e}"][data-active]::before,
[data-beam="${e}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${o}px;
  clip-path: inset(0 round ${o}px);
  background: ${u};
  box-shadow: inset 0 0 5px 1px ${p};
  -webkit-mask-image: ${z};
  -webkit-mask-composite: source-over;
  mask-image: ${z};
  mask-composite: add;
  pointer-events: none;
  z-index: 1;
  opacity: calc(var(--beam-opacity-${e}) * ${X.toFixed(2)} * var(--beam-inner-opacity, 1) * var(--beam-strength, 1));
  ${$}
}

[data-beam="${e}"] [data-beam-bloom] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${d}px;
  clip-path: inset(0 round ${o}px);
  background: ${k};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: ${r}px;
  filter: blur(${R(8, y)}px) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)});
  pointer-events: none;
  z-index: 3;
  opacity: 0;
}

[data-beam="${e}"][data-active] [data-beam-bloom],
[data-beam="${e}"][data-fading] [data-beam-bloom] {
  display: block;
  opacity: calc(var(--beam-opacity-${e}) * ${O.toFixed(2)} * var(--beam-bloom-opacity, 1) * var(--beam-strength, 1));
}

@keyframes beam-spin-${e} {
  to { --beam-angle-${e}: 360deg; }
}

@keyframes beam-fade-in-${e} {
  to { --beam-opacity-${e}: 1; }
}

@keyframes beam-fade-out-${e} {
  from { --beam-opacity-${e}: 1; }
  to { --beam-opacity-${e}: 0; }
}
${Y}
${N(e)}
`;
}
function bo(a) {
  const {
    id: e,
    borderRadius: o,
    borderWidth: r,
    duration: t,
    strokeOpacity: s,
    innerOpacity: i,
    bloomOpacity: c,
    innerShadow: p,
    colorVariant: b,
    staticColors: g,
    brightness: n,
    saturation: l,
    hueRange: f,
    theme: W,
    glowSize: y = 1
  } = a, d = Math.max(0, o - r), m = b === "mono" ? 0.5 : 1, H = s * m, X = i * m, O = c * m, $ = g ? "" : `animation: beam-hue-shift-${e} 12s ease-in-out infinite;`, Y = g ? "" : `
@keyframes beam-hue-shift-${e} {
  0% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) - ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
  50% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) + ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
  100% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) - ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
}`, x = W === "dark", w = x ? `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 54%,
        rgba(255, 255, 255, 0.1) 57%,
        rgba(255, 255, 255, 0.3) 60%,
        rgba(255, 255, 255, 0.6) 63%,
        rgba(255, 255, 255, 0.75) 66%,
        rgba(255, 255, 255, 0.6) 69%,
        rgba(255, 255, 255, 0.3) 72%,
        rgba(255, 255, 255, 0.1) 75%,
        transparent 78%, transparent 100%
      )` : `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 54%,
        rgba(0, 0, 0, 0.08) 57%,
        rgba(0, 0, 0, 0.2) 60%,
        rgba(0, 0, 0, 0.4) 63%,
        rgba(0, 0, 0, 0.55) 66%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.2) 72%,
        rgba(0, 0, 0, 0.08) 75%,
        transparent 78%, transparent 100%
      )`, v = je(b), u = Te(b), k = x ? `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 58%,
        rgba(255, 255, 255, 0.03) 62%,
        rgba(255, 255, 255, 0.08) 65%,
        rgba(255, 255, 255, 0.2) 67%,
        rgba(255, 255, 255, 0.45) 69%,
        rgba(255, 255, 255, 0.85) 70%,
        rgba(255, 255, 255, 0.85) 70.5%,
        rgba(255, 255, 255, 0.45) 71.5%,
        rgba(255, 255, 255, 0.2) 73%,
        rgba(255, 255, 255, 0.08) 75%,
        rgba(255, 255, 255, 0.03) 78%,
        transparent 82%
      )` : `conic-gradient(
        from var(--beam-angle-${e}),
        transparent 0%, transparent 58%,
        rgba(0, 0, 0, 0.02) 62%,
        rgba(0, 0, 0, 0.08) 65%,
        rgba(0, 0, 0, 0.2) 67%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.6) 70%,
        rgba(0, 0, 0, 0.6) 70.5%,
        rgba(0, 0, 0, 0.4) 71.5%,
        rgba(0, 0, 0, 0.2) 73%,
        rgba(0, 0, 0, 0.08) 75%,
        rgba(0, 0, 0, 0.02) 78%,
        transparent 82%
      )`;
  return `
@property --beam-angle-${e} {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: true;
}

@property --beam-opacity-${e} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-beam="${e}"] {
  position: relative;
  border-radius: ${o}px;
  overflow: hidden;
}

[data-beam="${e}"][data-active] {
  animation:
    beam-spin-${e} ${t}s linear infinite,
    beam-fade-in-${e} 0.6s ease forwards;
}

[data-beam="${e}"][data-fading] {
  animation:
    beam-spin-${e} ${t}s linear infinite,
    beam-fade-out-${e} 0.5s ease forwards;
}

[data-beam="${e}"][data-active]::after,
[data-beam="${e}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${d}px;
  padding: ${r}px;
  clip-path: inset(0 round ${o}px);
  background: ${w},${v};
  -webkit-mask:
    conic-gradient(
      from var(--beam-angle-${e}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    conic-gradient(
      from var(--beam-angle-${e}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  z-index: 2;
  opacity: calc(var(--beam-opacity-${e}) * ${H.toFixed(2)} * var(--beam-stroke-opacity, 1) * var(--beam-strength, 1));
  ${$}
}

[data-beam="${e}"][data-active]::before,
[data-beam="${e}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${o}px;
  background: ${u};
  box-shadow: inset 0 0 9px 1px ${p};
  -webkit-mask-image:
    conic-gradient(
      from var(--beam-angle-${e}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  -webkit-mask-composite: source-in, source-over;
  mask-image:
    conic-gradient(
      from var(--beam-angle-${e}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  mask-composite: intersect, add;
  pointer-events: none;
  z-index: 1;
  opacity: calc(var(--beam-opacity-${e}) * ${X.toFixed(2)} * var(--beam-inner-opacity, 1) * var(--beam-strength, 1));
  clip-path: inset(0 round ${o}px);
  ${$}
}

[data-beam="${e}"] [data-beam-bloom] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${d}px;
  clip-path: inset(0 round ${o}px);
  background: ${k};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: ${r}px;
  filter: blur(${R(8, y)}px) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)});
  pointer-events: none;
  z-index: 3;
  opacity: 0;
}

[data-beam="${e}"][data-active] [data-beam-bloom],
[data-beam="${e}"][data-fading] [data-beam-bloom] {
  display: block;
  opacity: calc(var(--beam-opacity-${e}) * ${O.toFixed(2)} * var(--beam-bloom-opacity, 1) * var(--beam-strength, 1));
}

@keyframes beam-spin-${e} {
  to { --beam-angle-${e}: 360deg; }
}

@keyframes beam-fade-in-${e} {
  to { --beam-opacity-${e}: 1; }
}

@keyframes beam-fade-out-${e} {
  from { --beam-opacity-${e}: 1; }
  to { --beam-opacity-${e}: 0; }
}
${Y}
${N(e)}
`;
}
function po(a) {
  const {
    id: e,
    borderRadius: o,
    borderWidth: r,
    duration: t,
    strokeOpacity: s,
    innerOpacity: i,
    bloomOpacity: c,
    colorVariant: p,
    staticColors: b,
    brightness: g,
    saturation: n,
    hueRange: l,
    theme: f,
    glowSize: W = 1
  } = a, y = f === "dark", d = p === "mono" ? 0.5 : 1, m = (s * d).toFixed(2), H = (i * d).toFixed(2), X = (c * d).toFixed(2), { op: O } = ge("pulse-inner", f, t), $ = R(8, W), Y = g.toFixed(2), x = n.toFixed(2), w = b ? `filter: brightness(${Y}) saturate(${x});` : `filter: hue-rotate(calc(var(--beam-hue-base, 0deg) + var(--beam-hue-${e}))) brightness(${Y}) saturate(${x});`, v = b ? `filter: blur(${$}px) brightness(${Y}) saturate(${x});` : `filter: blur(${$}px) hue-rotate(calc(var(--beam-hue-base, 0deg) + var(--beam-hue-${e}))) brightness(${Y}) saturate(${x});`, u = ao(p, e), k = to(p, e, y), z = Re(eo, p, 1 - O * 0.5);
  return `
${Me(e)}

[data-beam="${e}"] {
  position: relative;
  border-radius: ${o}px;
  overflow: hidden;
  isolation: isolate;
}

[data-beam="${e}"][data-active] {
${ee(e, "beam-fade-in", 0.6)}
}

[data-beam="${e}"][data-fading] {
${ee(e, "beam-fade-out", 0.5)}
}

[data-beam="${e}"][data-active]::after,
[data-beam="${e}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${o}px;
  padding: ${r}px;
  clip-path: inset(0 round ${o}px);
  background: ${u};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
  will-change: opacity, filter;
  opacity: calc(var(--beam-opacity-${e}) * ${m} * var(--beam-stroke-opacity, 1) * var(--beam-strength, 1));
  ${w}
}

[data-beam="${e}"][data-active]::before,
[data-beam="${e}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${o}px;
  clip-path: inset(0 round ${o}px);
  background: ${k};
  -webkit-mask-image:
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  -webkit-mask-composite: source-over;
  mask-image:
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  mask-composite: add;
  pointer-events: none;
  z-index: 1;
  will-change: opacity, filter;
  opacity: calc(var(--beam-opacity-${e}) * ${H} * var(--beam-inner-opacity, 1) * var(--beam-strength, 1));
  ${w}
}

[data-beam="${e}"] [data-beam-bloom] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${o}px;
  clip-path: inset(0 round ${o}px);
  background: ${z};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: ${r}px;
  pointer-events: none;
  z-index: 3;
  will-change: opacity;
  opacity: 0;
}

[data-beam="${e}"][data-active] [data-beam-bloom],
[data-beam="${e}"][data-fading] [data-beam-bloom] {
  display: block;
  opacity: calc(var(--beam-opacity-${e}) * ${X} * var(--beam-bloom-opacity, 1) * var(--beam-strength, 1));
  ${v}
}

@keyframes beam-fade-in-${e} { to { --beam-opacity-${e}: 1; } }
@keyframes beam-fade-out-${e} { from { --beam-opacity-${e}: 1; } to { --beam-opacity-${e}: 0; } }
${N(e)}

@media (prefers-reduced-motion: reduce) {
  [data-beam="${e}"][data-active],
  [data-beam="${e}"][data-fading],
  [data-beam="${e}"][data-active]::after,
  [data-beam="${e}"][data-fading]::after,
  [data-beam="${e}"][data-active]::before,
  [data-beam="${e}"][data-fading]::before,
  [data-beam="${e}"][data-active] [data-beam-bloom],
  [data-beam="${e}"][data-fading] [data-beam-bloom] {
    animation: none !important;
  }
}
`;
}
function lo(a) {
  const {
    id: e,
    borderRadius: o,
    duration: r,
    strokeOpacity: t,
    innerOpacity: s,
    bloomOpacity: i,
    colorVariant: c,
    staticColors: p,
    brightness: b,
    saturation: g,
    hueRange: n,
    theme: l,
    hairlineOpacity: f = 0,
    glowSize: W = 1
  } = a, y = l === "dark", d = c === "mono" ? 0.5 : 1, m = (t * d).toFixed(2), H = (s * d).toFixed(2), X = (i * d).toFixed(2), O = y ? "70, 70, 70" : "0, 0, 0", $ = f.toFixed(2), Y = `linear-gradient(rgba(${O}, ${$}), rgba(${O}, ${$}))`, { op: x } = ge("pulse-outside", l, r), w = 0.95, v = 0.9, u = R(y ? 3 : 6, W), k = R(y ? 22.5 : 15, W), z = b.toFixed(2), C = g.toFixed(2), j = p ? `filter: brightness(${z}) saturate(${C});` : `filter: hue-rotate(calc(var(--beam-hue-base, 0deg) + var(--beam-hue-${e}))) brightness(${z}) saturate(${C});`, I = `brightness(var(--beam-glow-brightness, ${z})) saturate(var(--beam-glow-saturate, ${C}))`, re = p ? `filter: blur(var(--beam-core-blur, ${u}px)) ${I};` : `filter: blur(var(--beam-core-blur, ${u}px)) hue-rotate(calc(var(--beam-hue-base, 0deg) + var(--beam-hue-${e}))) ${I};`, ae = p ? `filter: blur(var(--beam-bloom-blur, ${k}px)) ${I};` : `filter: blur(var(--beam-bloom-blur, ${k}px)) hue-rotate(calc(var(--beam-hue-base, 0deg) + var(--beam-hue-${e}))) ${I};`, T = we(Ye, c, e), V = we(Ye, c, e), te = Re(oo, c, 1 - x * 0.5), M = f > 0 ? `${T},
    ${Y}` : T;
  return `
${Me(e)}

[data-beam="${e}"] {
  position: relative;
  border-radius: ${o}px;
  overflow: visible;
  isolation: isolate;
}

[data-beam="${e}"][data-active] {
${ee(e, "beam-fade-in", 0.6)}
}

[data-beam="${e}"][data-fading] {
${ee(e, "beam-fade-out", 0.5)}
}
${f > 0 ? `
/* Idle hairline — painted above the (opaque) child in the inner 1px edge ring so
   it overlaps a standard inset component border exactly. */
[data-beam="${e}"]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${o}px;
  padding: 1px;
  clip-path: inset(0 round ${o}px);
  background: ${Y};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
}
` : ""}
[data-beam="${e}"][data-active]::after,
[data-beam="${e}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${o}px;
  padding: 1px;
  clip-path: inset(0 round ${o}px);
  background: ${M};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
  will-change: opacity, filter;
  opacity: calc(var(--beam-opacity-${e}) * ${m} * var(--beam-stroke-opacity, 1) * var(--beam-strength, 1));
  ${j}
}

[data-beam="${e}"][data-active]::before,
[data-beam="${e}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: -10px;
  z-index: -1;
  border-radius: ${o + 10}px;
  background: ${V};
  transform: scale(${w}, ${v});
  pointer-events: none;
  will-change: opacity, filter;
  opacity: calc(var(--beam-opacity-${e}) * ${H} * var(--beam-inner-opacity, 1) * var(--beam-strength, 1));
  ${re}
}

[data-beam="${e}"] [data-beam-bloom] {
  display: none;
  position: absolute;
  inset: -30px;
  z-index: -1;
  border-radius: ${o + 30}px;
  background: ${te};
  transform: scale(${w}, ${v});
  pointer-events: none;
  will-change: transform;
  opacity: 0;
}

[data-beam="${e}"][data-active] [data-beam-bloom],
[data-beam="${e}"][data-fading] [data-beam-bloom] {
  display: block;
  opacity: calc(var(--beam-opacity-${e}) * ${X} * var(--beam-bloom-opacity, 1) * var(--beam-strength, 1));
  ${ae}
}

@keyframes beam-fade-in-${e} { to { --beam-opacity-${e}: 1; } }
@keyframes beam-fade-out-${e} { from { --beam-opacity-${e}: 1; } to { --beam-opacity-${e}: 0; } }
${N(e)}

@media (prefers-reduced-motion: reduce) {
  [data-beam="${e}"][data-active],
  [data-beam="${e}"][data-fading],
  [data-beam="${e}"][data-active]::after,
  [data-beam="${e}"][data-fading]::after,
  [data-beam="${e}"][data-active]::before,
  [data-beam="${e}"][data-fading]::before,
  [data-beam="${e}"][data-active] [data-beam-bloom],
  [data-beam="${e}"][data-fading] [data-beam-bloom] {
    animation: none !important;
  }
}
`;
}
function fo(a) {
  const {
    id: e,
    borderRadius: o,
    borderWidth: r,
    duration: t,
    strokeOpacity: s,
    innerOpacity: i,
    bloomOpacity: c,
    innerShadow: p,
    colorVariant: b,
    staticColors: g,
    brightness: n,
    saturation: l,
    hueRange: f,
    theme: W,
    glowSize: y = 1
  } = a, d = Math.max(0, o - r), m = W === "dark", H = s, X = i, O = c, $ = g ? "" : `animation: beam-hue-shift-${e} 12s ease-in-out infinite;`, Y = g ? "" : `animation: beam-hue-shift-bloom-${e} 8s ease-in-out infinite;`, x = g ? "" : `
@keyframes beam-hue-shift-${e} {
  0% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) - ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
  50% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) + ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
  100% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) - ${f}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
}

@keyframes beam-hue-shift-bloom-${e} {
  0% { filter: blur(${R(8, y)}px) hue-rotate(calc(var(--beam-hue-base, 0deg) - ${f + 10}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
  50% { filter: blur(${R(8, y)}px) hue-rotate(calc(var(--beam-hue-base, 0deg) + ${f + 10}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
  100% { filter: blur(${R(8, y)}px) hue-rotate(calc(var(--beam-hue-base, 0deg) - ${f + 10}deg)) brightness(${n.toFixed(2)}) saturate(${l.toFixed(2)}); }
}`, w = m ? `radial-gradient(
        ellipse calc(24px * var(--beam-w-${e})) calc(28px * var(--beam-h-${e})) at calc(var(--beam-x-${e}) * 100%) calc(100% + 2px),
        rgba(255, 255, 255, 0.38) 0%,
        rgba(255, 255, 255, 0.12) 30%,
        transparent 65%
      )` : `radial-gradient(
        ellipse calc(35px * var(--beam-w-${e})) calc(28px * var(--beam-h-${e})) at calc(var(--beam-x-${e}) * 100%) calc(100% + 2px),
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.25) 35%,
        transparent 70%
      )`, v = De(b, m, e), u = Ke(b, e), k = Ze(b, m, e), z = b === "mono" ? "filter: blur(6px);" : "";
  return `
@property --beam-x-${e} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

@property --beam-w-${e} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --beam-h-${e} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --beam-spike-${e} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --beam-spike2-${e} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --beam-edge-${e} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --beam-opacity-${e} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-beam="${e}"] {
  position: relative;
  border-radius: ${o}px;
  overflow: hidden;
}

[data-beam="${e}"][data-active] {
  animation:
    beam-travel-${e} ${t}s linear infinite,
    beam-edge-fade-${e} ${t}s linear infinite,
    beam-breathe-${e} ${(t * 1.3).toFixed(1)}s ease-in-out infinite,
    beam-spike-${e} ${(t * 1.33).toFixed(1)}s ease-in-out infinite,
    beam-spike2-${e} ${(t * 1.7).toFixed(1)}s ease-in-out infinite,
    beam-fade-in-${e} 0.6s ease forwards;
}

[data-beam="${e}"][data-fading] {
  animation:
    beam-travel-${e} ${t}s linear infinite,
    beam-edge-fade-${e} ${t}s linear infinite,
    beam-breathe-${e} ${(t * 1.3).toFixed(1)}s ease-in-out infinite,
    beam-spike-${e} ${(t * 1.33).toFixed(1)}s ease-in-out infinite,
    beam-spike2-${e} ${(t * 1.7).toFixed(1)}s ease-in-out infinite,
    beam-fade-out-${e} 0.5s ease forwards;
}

[data-beam="${e}"][data-active]::after,
[data-beam="${e}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${d}px;
  padding: ${r}px;
  clip-path: inset(0 round ${o}px);
  background: ${w}, ${v};
  -webkit-mask:
    radial-gradient(
      ellipse calc(78px * var(--beam-w-${e})) calc(60px * var(--beam-h-${e})) at calc(var(--beam-x-${e}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    radial-gradient(
      ellipse calc(78px * var(--beam-w-${e})) calc(60px * var(--beam-h-${e})) at calc(var(--beam-x-${e}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  z-index: 2;
  opacity: calc(var(--beam-opacity-${e}) * var(--beam-edge-${e}) * ${H.toFixed(2)} * var(--beam-stroke-opacity, 1) * var(--beam-strength, 1));
  ${$}
}

[data-beam="${e}"][data-active]::before,
[data-beam="${e}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${o}px;
  background: ${u};
  box-shadow: inset 0 0 9px 1px ${p};
  -webkit-mask-image:
    radial-gradient(
      ellipse calc(78px * var(--beam-w-${e})) calc(60px * var(--beam-h-${e})) at calc(var(--beam-x-${e}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  -webkit-mask-composite: source-in, source-over;
  mask-image:
    radial-gradient(
      ellipse calc(78px * var(--beam-w-${e})) calc(60px * var(--beam-h-${e})) at calc(var(--beam-x-${e}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  mask-composite: intersect, add;
  pointer-events: none;
  z-index: 1;
  opacity: calc(var(--beam-opacity-${e}) * var(--beam-edge-${e}) * ${X.toFixed(2)} * var(--beam-inner-opacity, 1) * var(--beam-strength, 1));
  clip-path: inset(0 round ${o}px);
  ${$}
}

[data-beam="${e}"] [data-beam-bloom] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${d}px;
  clip-path: inset(0 round ${o}px);
  padding: 0;
  -webkit-mask: radial-gradient(
    ellipse calc(84px * var(--beam-w-${e})) calc(110px * var(--beam-h-${e})) at calc(var(--beam-x-${e}) * 100%) 100%,
    white 0%, rgba(255, 255, 255, 0.5) 35%, transparent 100%
  );
  -webkit-mask-composite: source-over;
  mask: radial-gradient(
    ellipse calc(84px * var(--beam-w-${e})) calc(110px * var(--beam-h-${e})) at calc(var(--beam-x-${e}) * 100%) 100%,
    white 0%, rgba(255, 255, 255, 0.5) 35%, transparent 100%
  );
  mask-composite: add;
  background: ${k};
  ${z}
  pointer-events: none;
  z-index: 3;
  opacity: 0;
}

[data-beam="${e}"][data-active] [data-beam-bloom],
[data-beam="${e}"][data-fading] [data-beam-bloom] {
  display: block;
  opacity: calc(var(--beam-opacity-${e}) * var(--beam-edge-${e}) * ${O.toFixed(2)} * var(--beam-bloom-opacity, 1) * var(--beam-strength, 1));
  ${Y}
}

@keyframes beam-travel-${e} {
  0%   { --beam-x-${e}: 0.06;  --beam-w-${e}: 0.5; }
  10%  { --beam-x-${e}: 0.15;  --beam-w-${e}: 0.8; }
  20%  { --beam-x-${e}: 0.25;  --beam-w-${e}: 1.1; }
  30%  { --beam-x-${e}: 0.35;  --beam-w-${e}: 1.3; }
  40%  { --beam-x-${e}: 0.44;  --beam-w-${e}: 1.45; }
  50%  { --beam-x-${e}: 0.5;   --beam-w-${e}: 1.5; }
  60%  { --beam-x-${e}: 0.56;  --beam-w-${e}: 1.45; }
  70%  { --beam-x-${e}: 0.65;  --beam-w-${e}: 1.3; }
  80%  { --beam-x-${e}: 0.75;  --beam-w-${e}: 1.1; }
  90%  { --beam-x-${e}: 0.85;  --beam-w-${e}: 0.8; }
  100% { --beam-x-${e}: 0.94;  --beam-w-${e}: 0.5; }
}

@keyframes beam-edge-fade-${e} {
  0%    { --beam-edge-${e}: 0; }
  12.5% { --beam-edge-${e}: 0; }
  32.5% { --beam-edge-${e}: 1; }
  67.5% { --beam-edge-${e}: 1; }
  87.5% { --beam-edge-${e}: 0; }
  100%  { --beam-edge-${e}: 0; }
}

@keyframes beam-breathe-${e} {
  0%, 100% { --beam-h-${e}: 0.8; }
  25%      { --beam-h-${e}: 1.25; }
  55%      { --beam-h-${e}: 0.85; }
  80%      { --beam-h-${e}: 1.3; }
}

@keyframes beam-spike-${e} {
  0%   { --beam-spike-${e}: 0.8; }
  25%  { --beam-spike-${e}: 1.3; }
  50%  { --beam-spike-${e}: 0.9; }
  75%  { --beam-spike-${e}: 1.4; }
  100% { --beam-spike-${e}: 0.8; }
}

@keyframes beam-spike2-${e} {
  0%   { --beam-spike2-${e}: 1.2; }
  25%  { --beam-spike2-${e}: 0.7; }
  50%  { --beam-spike2-${e}: 1.4; }
  75%  { --beam-spike2-${e}: 0.8; }
  100% { --beam-spike2-${e}: 1.2; }
}

@keyframes beam-fade-in-${e} {
  to { --beam-opacity-${e}: 1; }
}

@keyframes beam-fade-out-${e} {
  from { --beam-opacity-${e}: 1; }
  to { --beam-opacity-${e}: 0; }
}
${x}
${N(e)}
`;
}
const oe = /* @__PURE__ */ new Set();
let _ = null, le = 0;
const go = 1e3 / 30 - 2, mo = Math.PI * 2;
function Oe(a) {
  return (1 - Math.cos(mo * a)) / 2;
}
function qe(a) {
  if (_ = requestAnimationFrame(qe), a - le < go) return;
  le = a;
  const e = a / 1e3;
  oe.forEach(({ el: o, config: r }) => {
    for (const t of r.oscillators) {
      const s = (e - t.delay) / t.period, i = t.a + (t.b - t.a) * Oe(s);
      o.style.setProperty(
        t.prop,
        t.unit === "px" ? `${i.toFixed(2)}px` : i.toFixed(4)
      );
    }
    if (r.hue) {
      const { prop: t, range: s, period: i, continuous: c } = r.hue, p = c ? e / i % 1 * s : -s + 2 * s * Oe(e / i);
      o.style.setProperty(t, `${p.toFixed(2)}deg`);
    }
  });
}
function xo() {
  _ == null && (le = 0, _ = requestAnimationFrame(qe));
}
function $o() {
  oe.size === 0 && _ != null && (cancelAnimationFrame(_), _ = null);
}
function zo(a, e) {
  const o = { el: a, config: e };
  return oe.add(o), xo(), () => {
    oe.delete(o), $o();
  };
}
function uo() {
  const [a, e] = E(() => typeof window > "u" || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  return A(() => {
    if (typeof window > "u") return;
    const o = window.matchMedia("(prefers-color-scheme: dark)"), r = (t) => {
      e(t.matches ? "dark" : "light");
    };
    return o.addEventListener("change", r), () => o.removeEventListener("change", r);
  }, []), a;
}
function ho(a, e) {
  return a === "auto" ? e : a;
}
const Wo = Le(
  function({
    children: e,
    size: o = "md",
    colorVariant: r = "colorful",
    theme: t = "dark",
    staticColors: s = !1,
    duration: i,
    active: c = !0,
    borderRadius: p,
    brightness: b,
    saturation: g,
    hueRange: n = 30,
    glowSize: l = 1,
    strength: f = 1,
    className: W,
    style: y,
    css: d,
    onActivate: m,
    onDeactivate: H,
    onAnimationEnd: X,
    ...O
  }, $) {
    const x = Be().replace(/:/g, "-"), w = uo(), v = Pe(null), [u, k] = E(c), [z, C] = E(!1), [j, I] = E(!0), [re, ae] = E(null), [T, V] = E({ x: 1, y: 1 });
    A(() => {
      if (p != null) return;
      const h = v.current;
      if (!h) return;
      const S = () => {
        const B = h.firstElementChild;
        if (!B) return;
        const ce = getComputedStyle(B), P = parseFloat(ce.borderTopLeftRadius);
        !isNaN(P) && P > 0 && ae(P);
      };
      S();
      const L = new MutationObserver(S);
      return L.observe(h, { childList: !0, subtree: !1 }), () => L.disconnect();
    }, [p, e]), A(() => {
      c && !u && !z ? k(!0) : !c && u && !z && C(!0);
    }, [c, u, z]), A(() => {
      const h = v.current;
      if (!h || typeof IntersectionObserver > "u") return;
      const S = new IntersectionObserver(
        (L) => {
          for (const B of L) I(B.isIntersecting);
        },
        // Start animating slightly before the element scrolls into view.
        { rootMargin: "256px" }
      );
      return S.observe(h), () => S.disconnect();
    }, []), A(() => {
      if (o !== "pulse-outside") {
        V({ x: 1, y: 1 });
        return;
      }
      const h = v.current;
      if (!h) return;
      const S = 350, L = 140, B = 0.35, ce = 4, P = (Q) => Math.max(B, Math.min(ce, Q)), ze = () => {
        const Q = h.firstElementChild;
        if (!Q) return;
        const Z = Q.getBoundingClientRect();
        if (!Z.width || !Z.height) return;
        const ye = +P(Z.width / S).toFixed(3), ke = +P(Z.height / L).toFixed(3);
        V((be) => be.x === ye && be.y === ke ? be : { x: ye, y: ke });
      };
      if (ze(), typeof ResizeObserver > "u") return;
      const ue = h.firstElementChild;
      if (!ue) return;
      const he = new ResizeObserver(ze);
      return he.observe(ue), () => he.disconnect();
    }, [o, e]);
    const te = He(
      (h) => {
        const S = h.animationName;
        S.includes("fade-out") ? (k(!1), C(!1), H == null || H()) : S.includes("fade-in") && (m == null || m()), X == null || X(h);
      },
      [m, H, X]
    ), M = ho(t, w), F = pe[o][M], se = Ee[o], ie = o === "pulse-inner" || o === "pulse-outside", de = p ?? re ?? se.borderRadius, D = i ?? (o === "line" ? 3.1 : ie ? 2.3 : 1.96), me = g ?? F.saturation, xe = b ?? F.brightness ?? 1.3, U = o === "line" ? Math.min(n, 13) : n, K = r === "mono" ? !0 : s, $e = Xe(
      () => no({
        id: x,
        borderRadius: de,
        borderWidth: se.borderWidth,
        duration: D,
        strokeOpacity: F.strokeOpacity,
        innerOpacity: F.innerOpacity,
        bloomOpacity: F.bloomOpacity,
        innerShadow: F.innerShadow,
        size: o,
        colorVariant: r,
        staticColors: K,
        brightness: xe,
        saturation: me,
        hueRange: U,
        theme: M,
        hairlineOpacity: F.hairlineOpacity,
        glowSize: l
      }),
      [
        x,
        de,
        se.borderWidth,
        D,
        F.strokeOpacity,
        F.innerOpacity,
        F.bloomOpacity,
        F.innerShadow,
        F.hairlineOpacity,
        o,
        r,
        K,
        xe,
        me,
        U,
        l,
        M
      ]
    ), ne = Xe(
      () => ie ? io(o, M, D, U, K, x) : null,
      [ie, o, M, D, U, K, x]
    );
    A(() => {
      var S;
      if (!ne || !(u || z) || !j) return;
      const h = v.current;
      if (h && !(typeof window < "u" && ((S = window.matchMedia) != null && S.call(window, "(prefers-reduced-motion: reduce)").matches)))
        return zo(h, ne);
    }, [ne, u, z, j]);
    const Ge = He(
      (h) => {
        v.current = h, typeof $ == "function" ? $(h) : $ && ($.current = h);
      },
      [$]
    ), Ce = {
      ...y ?? {},
      "--beam-strength": Math.max(0, Math.min(1, f)),
      ...o === "pulse-outside" ? { "--pulse-glow-sx": T.x, "--pulse-glow-sy": T.y } : {}
    };
    return /* @__PURE__ */ ve(Ie, { children: [
      /* @__PURE__ */ We("style", { children: d ? `${$e}
${d.split("{id}").join(x)}` : $e }),
      /* @__PURE__ */ ve(
        "div",
        {
          ...O,
          ref: Ge,
          "data-beam": x,
          "data-active": u && !z ? "" : void 0,
          "data-fading": z ? "" : void 0,
          "data-paused": u && !z && !j ? "" : void 0,
          className: W,
          style: Ce,
          onAnimationEnd: te,
          children: [
            e,
            /* @__PURE__ */ We("div", { "data-beam-bloom": !0 })
          ]
        }
      )
    ] });
  }
);
export {
  Wo as BorderBeam,
  Wo as default,
  Ee as sizePresets,
  pe as sizeThemePresets,
  vo as themeColors
};
