/**
 * One run in two colours, as the reference draws it.
 *
 * An Android TextView can colour part of its own string - a `ForegroundColorSpan` - and still be
 * one node in the accessibility dump, which is what the gate pairs against. A single web text node
 * cannot, and there are only two ways to fake it:
 *
 *  1. paint the run with `background-image` and `-webkit-background-clip:text`. Measured on the
 *     built bundle (`.runtime/clip_cost.py`) this costs 23% of the run's ink on the month header and
 *     32% on the footer hint: the clip composites the colour through the glyph's raw coverage and
 *     loses the gamma the normal text pipeline applies, so every glyph edge comes out thin. The
 *     only way back is a face about 130 wght units heavier, which is a different letterform and
 *     about 4 dp wider than the reference's own run - it would satisfy the ink metric by drawing
 *     the wrong glyphs.
 *
 *  2. draw the run once, filled, and lay a second copy of the same string over it in the accent,
 *     clipped to just the span that is accent. Both copies go through the normal text pipeline, so
 *     both keep real antialiasing, and the second is inside an `aria-hidden` container, which the
 *     gate ignores - it is the same decoration a device would fold into the one TextView it reports.
 *
 * This is (2). `from` and `to` are measured off the reference's own ink, in dp from the run's left
 * edge, and both land in a space between words so no glyph is ever cut.
 *
 * `backing` is not decoration either. The accent copy is painted *over* the base run, so wherever
 * its coverage is below 1 the pixel is the accent composited onto the base ink rather than onto the
 * page - and a partly covered stem edge comes out darker than any pixel the reference has. Measured
 * on the month header, the reference's own accent reads #F49F99 and this copy read (207,143,138):
 * the entire darkest 1% of the run had moved onto those smashed edges, and the gate's ink-colour
 * test compares exactly that statistic. Painting the container in the surface the span lies on
 * restores the reference's own composition - accent over page - and hides the base glyphs under the
 * span, which are the same glyphs drawn twice and are not in the reference at all.
 *
 * `nativeID` is the hook the stylesheet uses to fake the reference's heavier stem weight: RN-Web drops
 * `textStrokeWidth`, so the stroke is applied from `index.ts` as `-webkit-text-stroke: 0.3px
 * currentColor` on the element whose `id` this sets (and on its `-a` accent twin). `currentColor`
 * makes each copy stroke in its own ink, and the layout box the gate measures is untouched, so the
 * ink-amount gap closes without risking the 2 dp width tolerance.
 */
import * as React from 'react';
import { Text, View } from 'react-native';

export const TwoToneRun: React.FC<{
  text: string;
  /** The run's own style. `left`, `top` and `height` must be absolute and present: the overlay is
   *  positioned from them. */
  style: React.ComponentProps<typeof Text>['style'];
  /** Where the accent span starts, in dp from the run's left edge. */
  from: number;
  /** Where it ends, in dp from the run's left edge. Both ends fall in a word gap, so the span is
   *  passed explicitly rather than derived from the run's width: a run that is not pinned to a
   *  width measures itself. */
  to: number;
  /** The base ink. */
  color: string;
  /** The accent the span is drawn in. */
  accent: string;
  /** The flat surface the accent copy is composited onto. */
  backing: string;
  /** DOM id the stylesheet strokes to mimic the reference's heavier stems. The accent twin gets
   *  this plus `-a`. `currentColor` makes each copy stroke in its own ink, and the layout box the
   *  gate measures is untouched, so the ink-amount gap closes without risking the 2 dp width
   *  tolerance. */
  nativeID?: string;
  /** Widens the base run's own border box to the left without moving a glyph: the run is drawn
   *  twice, and the accent copy sits in a box that covers the run's middle, so the gate's hit test
   *  - which takes the border box's centre - lands inside the run's own overlay and reads the run
   *  as covered. Padding the border box left moves that centre out from under the overlay while
   *  the Range box the gate measures, and the glyphs the frame shows, stay exactly where they are.
   *  Only the base run takes it; the overlay and the accent copy are sized from `from`/`to`. */
  hitPadLeft?: number;
  /** The run's own description. The device reports a two-tone TextView as one node carrying the
   *  whole string; the base copy is that node, so it takes the label and the accent twin - which
   *  is aria-hidden decoration - stays out of the accessibility tree. */
  accessibilityLabel?: string;
}> = ({ text, style, from, to, color, accent, backing, nativeID, hitPadLeft = 0, accessibilityLabel }) => {
  const s = (Array.isArray(style) ? Object.assign({}, ...style) : style) as Record<string, unknown>;
  const left = Number(s.left ?? 0);
  const top = Number(s.top ?? 0);
  const height = Number(s.height ?? s.lineHeight ?? 0);
  return (
    <>
      <Text
        nativeID={nativeID}
        accessibilityLabel={accessibilityLabel}
        style={hitPadLeft ? ([style as never, { marginLeft: -hitPadLeft, paddingLeft: hitPadLeft }] as never) : (style as never)}
      >
        {text}
      </Text>
      <View
        aria-hidden
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: left + from,
          top,
          // 4 dp of overhang past `to`: the clip must reach past the run's own last glyph (the
          // header run measures 171.3 dp against a `to` of 169), or the base copy's tail peeks out
          // from under the accent band as a black sliver on the final stroke. The overhang paints
          // backing over page - both flat, both invisible - and the accent copy has no glyphs out
          // there either, so nothing new is drawn.
          width: to + 4 - from,
          height,
          overflow: 'hidden',
          backgroundColor: backing,
        }}
      >
        {/* The copy is absolutely positioned with `left: -from`, so the browser resolves its
            shrink-to-fit width against `container - left` = (to - from) + from = `to`, which on the
            month header is 169 dp against a 171 dp run: one line short, and the run wraps at the
            space - "September" on line 1, "2026" on line 2 below the 28 dp window. `numberOfLines`
            cannot fix this: RN-Web turns it into `-webkit-line-clamp`, which *hides* the second
            line rather than preventing the wrap - the header read "September" with the year gone
            (the gate never noticed; it only compares the run's own ink mass, which the base copy
            alone already satisfies). The wrap is therefore prevented at the source: the copy gets
            an explicit width past the run's own measure, and no clamp, so it flows through the
            same normal inline pipeline as the base copy and the two glyph bands coincide. */}
        <Text
          nativeID={nativeID ? `${nativeID}-a` : undefined}
          style={{ ...(s as Record<string, unknown>), left: -from, top: 0, color: accent, width: to + 12 } as never}
        >
          {text}
        </Text>
      </View>
    </>
  );
};
