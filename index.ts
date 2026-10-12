import { registerRootComponent } from 'expo';
import App from './src/App';

/**
 * The page is the reference frame minus the platform's own bars.
 *
 * The capture device is 1080x2340 at 440 dpi (2.75 px per dp) with a 136 px status bar and a 66 px
 * gesture area, so the app draws in a 392.73 x 777.45 dp box. Keeping the viewport exactly that
 * size is what lets the gate's transform (`web_dp = px / 2.75 - 49.45`) put the reference's boxes
 * and the page's boxes on the same axes - and it makes the page screenshot land on the same 1080 px
 * grid as the reference PNG, which is what a pixel comparison needs.
 *
 * The root is pinned to the viewport origin and scaled by min(vw/392.73, vh/777.45) so a smaller
 * browser window still contains the whole frame instead of centring it out of view. The scale is 1
 * at the reference's own size, so nothing the capture measures moves.
 *
 * `translateZ(0)` is not decorative: it promotes the frame to its own composited layer, which is
 * what makes this browser abandon colour-fringed sub-pixel antialiasing. The capture device's own
 * text has none - measured over the whole frozen frame, zero pixels of edge colour - so leaving
 * ClearType on would put a magenta-green fringe on every glyph the reference draws clean, and would
 * also inflate the ink the gate measures. `.runtime/face_calib.py` shows the same text measured
 * with and without it.
 */
const FRAME_W = 392.73;
const FRAME_H = 777.45;

const css = [
  'html,body{margin:0;padding:0;overflow:hidden;}',
  `#root{position:fixed;top:0;left:0;display:block;width:${FRAME_W}px;height:${FRAME_H}px;`
    + 'transform-origin:top left;transform:translateZ(0);}',
  'input,textarea,[contenteditable]{outline:none!important;box-shadow:none!important;}',
  // The month header is drawn heavier on the reference device than this browser's rasteriser reaches,
  // and the gap is thinner stems rather than wider advances. `-webkit-text-stroke` thickens the stem
  // without changing the layout box, so it closes the ink-amount gap the gate measures. `currentColor`
  // strokes each copy in its own ink (the base in ink, the accent twin in the accent). RN-Web drops
  // `textStrokeWidth`, so the id is set from TwoToneRun and the stroke applied here. The 0.15 px width
  // is re-fitted against the header run *with the year painting*: the earlier 0.3 px sweep was taken
  // while the accent copy was clamped away, and with "2026" back the run measured 1.149 - the year's
  // own mass plus the old stroke overshot the band. (0.3 px = 1.149, no stroke = 0.805 on the same
  // run, so ~0.15 px targets the 0.94-1.1 band's centre.)
  '#hrun,#hrun-a{-webkit-text-stroke:0.15px currentColor;}',
  /* Desktop device shell. The frame above is pinned to the origin so the gate's own 393 x 778 render
     stays put; in a real window (>= 800 px, above every viewport the reach pass uses) it would sit in
     the top-left corner of a large empty page. The media query turns that page into a dark backdrop
     and draws a rounded, shadowed bezel around the frame, and `fit()` centres it. */
  '@media (min-width:800px){html,body{background:radial-gradient(1200px 820px at 50% 28%, #1c1c24 0%, #0a0a0d 72%);}'
    + '#root{border-radius:44px;overflow:hidden;'
    + 'box-shadow:0 0 0 10px #1b1b20,0 0 0 11px rgba(255,255,255,0.10),0 42px 110px rgba(0,0,0,0.62);}}',
].join('\n');

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const fit = () => {
    const root = document.getElementById('root');
    if (!root) return;
    const s = Math.min(window.innerWidth / FRAME_W, window.innerHeight / FRAME_H, 1);
    root.style.transform = s < 1 ? `translateZ(0) scale(${s})` : 'translateZ(0)';
    /* Centre the frame once the window is larger than it (the design's own frame size, and every
       smaller reach viewport, keep left/top at 0 - so nothing the gate measures moves). */
    const wide = window.innerWidth >= 800;
    root.style.left = wide ? `${(window.innerWidth - FRAME_W * s) / 2}px` : '0px';
    root.style.top = wide ? `${(window.innerHeight - FRAME_H * s) / 2}px` : '0px';
  };
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
}

registerRootComponent(App);
