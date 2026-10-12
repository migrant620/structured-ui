/**
 * The prototype's design tokens.
 *
 * Every number here was measured off the frozen reference frames
 * (spec/baseline-freeze.json) rather than estimated:
 *
 *  - colours come from `.runtime/sample_colour.py`, which samples the same "darkest 1%" the gate's
 *    own colour metric uses;
 *  - geometry is the uiautomator dump converted to dp with the gate's own transform
 *    (`web_dp = px / 2.75 - 49.45`, i.e. the status bar is not part of the page);
 *  - the surfaces are the reference's own flat colours, read off the frames: the page is #F2F2F5,
 *    the timeline is a white sheet with a 22 dp rounded top starting at y 150.2, and the bottom bar
 *    is #EBEBEB from y 713.45;
 *  - the faces come from `.runtime/vf_sweep.py`, which rendered each run on the reference's own
 *    pixel grid and solved for the weight that reproduces the reference's own ink. This browser
 *    draws Roboto heavier than the capture device, and the gap grows as the type shrinks, so the
 *    app registers Roboto instanced at the measured weight for each size rather than at the
 *    nominal 400/500 (see `.runtime/make_font_instances.py` for the whole table).
 */

export const colors = {
  /** The page behind the sheet: the status bar and week strip area. */
  page: '#F2F2F5',
  /** The timeline's own surface. */
  sheet: '#FFFFFF',
  /** The bottom bar. */
  navBar: '#EBEBEB',
  surface: '#FFFFFF',
  /** The grey disc behind a guide task's glyph, and the bottom bar's own fill. */
  surfaceMuted: '#EBEBEB',
  accent: '#F49F99',
  accentWash: '#FDECEB',
  ink: '#000000',
  inkSecondary: '#8A8A8E',
  navInk: '#828286',
  /** The capsule behind the active bar item. Measured directly off the reference (median of the
   *  pill's own pixels), not derived: accent-at-20 % over the bar would land on (237,220,219)
   *  only for the red channel and miss the green and blue. */
  navPill: '#EDDCDB',
  /** The wheel's own rows: one 15-minute step off the pill reads this, two steps off FADED. */
  wheelInk: '#A6A6AA',
  /** A completed task's title in the detail sheet (complete_01's own ink). */
  doneInk: '#59595F',
};

/** Font families registered by `useFonts` in App.tsx; each is Roboto at a measured weight. */
export const fontFamily = {
  /** Grey secondary copy at 12.6-12.8 dp. */
  text: 'RobotoText',
  /** The gutter's time labels at 10.23 dp. */
  gutter: 'RobotoGutter',
  /** The "now" label in the gutter, which the reference sets black and heavy. */
  now: 'RobotoNow',
  /** The footer hint at 13.2 dp. */
  note: 'RobotoNote',
  /** The week strip's day numbers at 16.8 dp. */
  number: 'RobotoNumber',
  /** Row titles at 18.7 dp. */
  title: 'RobotoTitle',
  /** The month header at 23 dp; also the editor's section captions at 20.3 dp (same weight). */
  header: 'RobotoHeader',
  /** The detail sheet's datetime run at 13.8 dp. */
  sub: 'RobotoSub',
  /** The detail sheet's action-card labels at 14.5 dp. */
  action: 'RobotoAction',
  /** The settings rows' titles at 16.6 dp. */
  setting: 'RobotoSetting',
  /** The duration chips and the PRO run at 14.0-14.5 dp. */
  chip: 'RobotoChip',
  /** The section headers' accent "More..." at 17.2 dp. */
  more: 'RobotoMore',
};

/**
 * The `letterSpacing` values are a calibration, not a design choice.
 *
 * The gate compares the prototype's glyph run against the reference's TextView box, and an Android
 * TextView's box is the text's measured advance width; a browser's Range box is the same quantity.
 * With the glyphs themselves matching to about 1% (measured ink extent, `runs` in the run notes),
 * the two still differ by 1.5-2.5 dp on the longer strings, because the device's Roboto has very
 * slightly wider advances than this browser's at the same ink size. Tracking is what closes that
 * gap without touching the glyphs: 0.15 dp over nineteen characters is +2.85 dp of advance and
 * zero change to any glyph's shape, whereas the same correction made by raising the size would
 * also widen every short string that already matches exactly.
 *
 * The note is the one size that is genuinely different, not merely tracked: its ink measures
 * 158.5 x 12.0 dp against 146.6 x 11.6 dp at 12.8, i.e. +3% in the glyphs on top of +8 dp of
 * spacing, so its size moves to 13.2 and the rest is tracking.
 */
export const type = {
  header: { fontSize: 23.0, fontFamily: fontFamily.header, lineHeight: 28 },
  rowTitle: { fontSize: 18.7, fontFamily: fontFamily.title, lineHeight: 21.09, letterSpacing: 0.15 },
  rowTitleTall: { fontSize: 18.7, fontFamily: fontFamily.title, lineHeight: 21.64, letterSpacing: 0.15 },
  rowSub: { fontSize: 12.8, fontFamily: fontFamily.text, lineHeight: 14.18, letterSpacing: 0.08 },
  rowMeta: { fontSize: 12.6, fontFamily: fontFamily.text, lineHeight: 14.18, letterSpacing: 0.08 },
  note: { fontSize: 13.2, fontFamily: fontFamily.note, lineHeight: 16, letterSpacing: 0.3 },
  navLabel: { fontSize: 13.0, fontFamily: fontFamily.text, lineHeight: 16, letterSpacing: 0.08 },
  gutter: { fontSize: 10.23, fontFamily: fontFamily.gutter, lineHeight: 12, letterSpacing: 1.0 },
  count: { fontSize: 12.6, fontFamily: fontFamily.text, lineHeight: 14.18, letterSpacing: 0.08 },
  dayLabel: { fontSize: 12.6, fontFamily: fontFamily.text, lineHeight: 14.18 },
  dayNumber: { fontSize: 16.8, fontFamily: fontFamily.number, lineHeight: 18.91 },
  /** The gutter's "now" label: same size, black, heavier face. */
  gutterNow: { fontSize: 10.23, fontFamily: fontFamily.now, lineHeight: 12, letterSpacing: 1.0 },
};

/** The page is the reference frame minus the platform's own status bar and gesture bar. */
export const frame = {
  width: 392.73,
  height: 777.45,
};

/** Geometry of the header, the week strip, the sheet and the bottom bar, in page dp. */
export const space = {
  header: {
    titleLeft: 16,
    titleTop: 17.82,
    titleHeight: 28,
    /** Where the accent span of "September 2026" starts, measured into the run's own box. */
    titleAccentFrom: 114.9,
    /** And where it ends: past the year's last glyph (its ink stops at 168.4 into the run), far
     *  enough from the month that the span still begins and ends in the reference's word gaps. */
    titleAccentTo: 169,
    calendarsLeft: 340.73,
    calendarsTop: 8,
    button: 48,
  },
  /** The white sheet's top edge and its own corner radius (measured off the frames). */
  sheet: { top: 150.18, radius: 22 },
  /** The bottom bar occupies the last 64 dp of the frame. */
  navBar: { top: 713.45, height: 64 },
  week: {
    labelTop: 65,
    labelHeight: 14.18,
    numberTop: 86.91,
    numberBox: 18.91,
    badgeTop: 122.18,
    /**
     * The badge's accessibility node - the only part the gate sees. The reference reports each
     * mark as a 22 px (8.0 dp) node, so the node stays 8 dp; the disc below is a separate number.
     */
    badge: 8,
    /**
     * The disc actually painted behind the glyph. The reference's mark is an 8 dp node whose disc
     * overflows it: measured off home_01.png by 50 % chroma crossing, the disc is 38.0 px =
     * 13.82 dp across (e.g. the day-1 alarm spans y 463.49..501.50 px against a node at 472..494),
     * i.e. 2.91 dp past the node on every side. The gate only compares the 8 dp node's four edges,
     * so a disc drawn to the node's own 8 dp passes the gate while being 1.7x too small - this is
     * the defect `pipeline/pixel_diff.py` surfaced as a 36-46 % band at dp 119-133.
     */
    badgeDisc: 13.82,
    /**
     * The white glyph inside the disc. The reference's glyphs measure 6.5-7.3 dp across (alarm
     * 7.27x6.55, checklist 6.55x4.73) on the 13.82 dp disc, i.e. about half the disc - *not*
     * proportional to the node, so the glyph size is its own token rather than a function of `d`.
     */
    glyph: 7.2,
    columnPitch: 53.82,
    firstColumnLeft: 8,
  },
  nav: {
    iconTop: 723.64,
    icon: 24,
    labelTop: 755.64,
    labelHeight: 16,
    /**
     * The capsule the reference paints behind the *active* bar item (measured off home_01.png:
     * page-dp x 119.27..174.91, y 719.64..751.28 -> 55.64 x 31.64, centred on the item's own cx
     * of 147.27, fully rounded). It carries no accessibility node, so the gate cannot see it - the
     * bar passed while the pill was missing entirely.
     */
    pill: { w: 55.64, h: 31.64, top: 719.64 },
  },
  fab: { cx: 348.73, cy: 669.45, diameter: 56 },
  /** Every row's disc: the centre column is shared, the diameter follows the row's own height. */
  disc: { cx: 82.18, diameter: 60.5, diameterTall: 76.5 },
  /** The unfinished-task ring on the right of every row. */
  ring: { cx: 368.91, outer: 22.18, stroke: 2.18 },
  textLeft: 128,
  /** The dashed connector between discs. */
  connector: { dash: 5.45, gap: 5.45, width: 2.18 },
};
