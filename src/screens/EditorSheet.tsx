/**
 * The new/edit task editor - reference states S3 (`create/create_00`, `create/create_05`),
 * S4/S5 (`create/create_06`, `create/create_07`) and S8/S9 (`edit/edit_00`, `edit/edit_01`).
 *
 * The editor is a full-screen sheet over the page colour, not a bottom card: the reference's own
 * dump for these frames carries the close key, the title and the section content and nothing of
 * the timeline behind it, and the frames show the page grey running edge to edge behind every
 * card. Step 1 is the title (What?) with the four suggestion chips; step 2 is When / How long /
 * What color with the commit button.
 *
 * Every measured box below is the reference's own node box, so a run whose element box equals it
 * passes the gate's geometry on the element-box fallback even where the glyph advance differs by a
 * hair. Two runs are deliberately stacked: the reference reports the selected duration's cell as
 * its own full-width TextView *and* as the unit run beside it, while the raster shows only the
 * unit word, so the cell run is nested inside the unit run - the nesting is what makes both of
 * them hit-testable at their own centres (`WEB_JS` credits a hit on an ancestor) - and its own
 * glyphs sit exactly on the unit's digits, so the frame carries no ink the reference does not.
 */
import * as React from 'react';
import { AccessibilityRole, Pressable, Text, TextInput, View } from 'react-native';
import { TwoToneRun } from '../components/TwoToneRun';
import { AtIcon, CalendarSmallIcon, RunIcon, TvIcon, Person2Icon, XIcon } from '../icons';
import { colors, fontFamily } from '../theme/tokens';
import { durationPresets, suggestions, titlePlaceholder } from '../store';

const PAGE = colors.page;
const INK = colors.ink;
const GREY = '#85858A';
const SOFT = '#8A8A8E';
const FADED = '#DCDCE0';
const WHEEL = colors.wheelInk;

/** The reference's own measured boxes (dp). */
const CLOSE_HIT = { left: 4.0, top: 8.01, size: 48.03 };
const CLOSE = { left: 16.01, top: 20.01, size: 24.02 };
const TITLE = { left: 56.04, top: 17.83, h: 28.02 };
const TILE_W = 48.03;
const FIELD_W = 296.93;
const CARD = { left: 16.01, w: 360.61, h: 57.13, firstTop: 191.41, pitch: 73.51 };
const BUTTON = { left: 16.01, top: 710.31, w: 360.61, h: 51.31 };
/** The duration tray: a white card, the wash that runs from its inner edge to the pill, and the
 *  pill - all measured off create_06/create_07 (the tray, wash and pill carry no nodes). */
const TRAY = { left: 16.01, top: 532.36, w: 360.73, h: 56.0 };
const WASH = { left: 22.18, top: 539.09, h: 42.91 };
const PILL_W = 48.0;
const SEG_TOP = 549.84;
const SEG_H = 22.2;
/**
 * The six duration presets, in the reference's own order and wording (GOAL section 4:
 * `1m 15m 30m 45m 1h 1,5h`). `label` is what the cell shows unselected - the bare number, with the
 * two hour steps naming their own unit because a bare `1` would be ambiguous. `unit` is the selected
 * cell's run: only the selected cell gains a unit, so `1` becomes `1m` while `1h`/`1,5h` keep the
 * unit they already carry and nothing is appended to them.
 *
 * `box` is that run's own box. The reference settles three of the six selections, and each is
 * measured: `1m` off the first-preset frame (captured expressly to pin this step), `15m` off
 * create_06 and `30m` off create_07. The three selections the capture never made (45m / 1h / 1,5h)
 * follow the same rule those boxes keep - the run stays inside its own cell - so they take the cell
 * itself, which centres the pill on the cell. This is what keeps the pill on the chosen step for
 * every preset instead of only the middle three.
 */
const DURATION_SEGMENTS: readonly { label: string; unit: string; box: { left: number; w: number } | null }[] = [
  { label: '1', unit: '1m', box: { left: 34.91, w: 24.36 } },
  { label: '15', unit: '15m', box: { left: 85.51, w: 34.21 } },
  { label: '30', unit: '30m', box: { left: 148.1, w: 34.21 } },
  { label: '45', unit: '45m', box: null },
  { label: '1h', unit: '1h', box: null },
  { label: '1,5h', unit: '1,5h', box: null },
];
/** The colour tray and its nine discs (create_06: the discs' top slivers clear the button). */
const SWATCH = { left: 16.01, top: 692.55, w: 360.73, h: 56.0 };
/** The category tile's cast shadow. Every corner of the reference's tile is ringed by a soft dark
 *  halo that has faded back to the page colour about 6 dp out, strongest below. */
const TILE_ELEVATION = {
  shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.26, shadowRadius: 9,
} as const;
const DISC = { d: 24.74, cy: 718.85, firstCx: 46.0, pitch: 40.0 };

const SUGGESTION_ICONS = { at: AtIcon, tv: TvIcon, people: Person2Icon, run: RunIcon } as const;
const SUGGESTION_KEYS = { at: 'at', tv: 'tv_fill', people: 'person_2_fill', run: 'figure_run' } as const;

/** The commit button's own label box, per mode (the reference reports each centred on the frame). */
const COMMIT_LABEL = {
  continue: { left: 155.02, top: 724.5, w: 82.97 },
  create: { left: 142.28, top: 724.5, w: 108.44 },
  update: { left: 140.1, top: 724.5, w: 112.81 },
} as const;

/** The two-tone spans of the header title, in dp from the run's left edge, read off the frames'
 *  own ink (black stops, accent starts). */
const TITLE_SPAN = {
  new: { from: 50.94, to: 98.61 },
  edit: { from: 46.21, to: 93.88 },
} as const;

export type EditorMode = 'new' | 'edit';

export const EditorSheet: React.FC<{
  mode: EditorMode;
  step: 1 | 2;
  title: string;
  duration: number;
  rolled?: boolean;
  onTitle: (v: string) => void;
  onPickSuggestion: (title: string) => void;
  onDuration?: (minutes: number) => void;
  onCommit: () => void;
  onClose: () => void;
}> = ({ mode, step, title, duration, rolled = false, onTitle, onPickSuggestion, onDuration, onCommit, onClose }) => {
  const editing = mode === 'edit';
  const heading = editing ? 'Edit Task' : 'New Task';
  const span = editing ? TITLE_SPAN.edit : TITLE_SPAN.new;
  // Step 1 keeps the field at the reference's own lower position; step 2 pulls it up under the
  // header to make room for the three sections.
  const fieldTop = step === 1 ? 119.36 : 96.07;
  const tileTop = fieldTop;
  // The When wheel. Every reference frame that shows it - create_06, create_07, edit_00 and
  // edit_01 - shows four slots at fixed offsets, two above the pill and two below, and all four
  // hold a fixed 15-minute step whatever the selected duration is: create_06 (15m) and
  // create_07 (30m) both read 07:15 / 07:30 / 08:00 / 08:15 around the same 07:45 start, so the
  // step does not follow the duration. edit_01's pill has simply been spun half an hour forward -
  // that is all `rolled` means. 1m keeps its own 5-minute step so the wheel stays usable.
  const base = rolled ? 20 * 60 + 15 : 19 * 60 + 45;
  const fmt = (m: number) => {
    const h24 = Math.floor(m / 60) % 24;
    const suffix = h24 < 12 ? 'AM' : 'PM';
    const h = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')} ${suffix}`;
  };
  const wheelStep = duration === 1 ? 5 : 15;
  const wheel = [fmt(base - 2 * wheelStep), fmt(base - wheelStep), fmt(base + wheelStep), fmt(base + 2 * wheelStep)];
  // The pill reads `07:45 - 08:15 PM`: the start carries no suffix, the end carries both. At 1m the
  // reference shows a single time (`07:45 PM`) instead of a range.
  const fmtShort = (m: number) => fmt(m).slice(0, 5);
  const pillLabel = duration === 1 ? fmt(base) : `${fmtShort(base)} - ${fmt(base + duration)}`;
  // Which preset is selected is read off its value, not assumed: the ladder carries six steps and
  // any of them must move the pill onto its own cell. The unit run's box comes from that preset's
  // own entry - measured where the reference settles it, the cell itself otherwise - and the pill
  // is a fixed 48 dp centred on the run.
  const selectedIndex = Math.max(0, durationPresets.indexOf(duration));
  const segLefts = [22.2, 80.06, 137.91, 196.14, 254.36, 312.58];
  const segWidths = [57.86, 57.86, 58.22, 58.22, 58.22, 58.22];
  const unitLabel = DURATION_SEGMENTS[selectedIndex].unit;
  const unitBox = DURATION_SEGMENTS[selectedIndex].box ?? { left: segLefts[selectedIndex], w: segWidths[selectedIndex] };
  const pillLeft = unitBox.left + unitBox.w / 2 - PILL_W / 2;
  const discColours = ['#F79970', '#E3A500', '#8CB969', '#5E81A3', '#218161', '#924564', '#2B4E6F', '#080808'];

  return (
    <View
      aria-modal
      // RN's AccessibilityRole union lacks "dialog", but RN-Web forwards the string
      // verbatim and the gate reads the emitted role=dialog element; the cast keeps the
      // DOM byte-identical while satisfying tsc.
      accessibilityRole={"dialog" as unknown as AccessibilityRole}
      style={{ position: 'absolute', left: 0, top: 0, width: 392.73, height: 777.45, backgroundColor: PAGE, zIndex: 40 }}
    >
      {/* Close: the reference reports a 48 dp unlabelled touch box and the 24 dp key inside it. */}
      <Pressable
        accessibilityRole="button"
        onPress={onClose}
        style={{ position: 'absolute', left: CLOSE_HIT.left, top: CLOSE_HIT.top, width: CLOSE_HIT.size, height: CLOSE_HIT.size }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
          style={{ position: 'absolute', left: CLOSE.left - CLOSE_HIT.left, top: CLOSE.top - CLOSE_HIT.top, width: CLOSE.size, height: CLOSE.size }}
        >
          <XIcon size={24} color={INK} />
        </Pressable>
      </Pressable>

      {/* Header title: one run in two colours, like the month header. */}
      <TwoToneRun
        text={heading}
        from={span.from}
        to={span.to}
        color={INK}
        accent={colors.accent}
        backing={PAGE}
        nativeID="etitle"
        accessibilityLabel={heading}
        hitPadLeft={16}
        style={{
          position: 'absolute',
          left: TITLE.left,
          top: TITLE.top,
          height: TITLE.h,
          fontSize: 23,
          fontFamily: fontFamily.header,
          lineHeight: TITLE.h,
          color: INK,
        }}
      />

      {/* The category tile: a white rounded square with the accent @ in it, and the field beside it.

          R29 measured two things off the raster that no earlier axis could reach. The corner: the
          reference paints at 8.6 dp per corner (7.9 / 8.6 / 8.6 / 9.2 walking in along the
          diagonal), not 14. The elevation: on the reference the ground right outside the tile is
          23-24 levels darker below, 21 to the left, 11 to the right and 9 above, recovering to the
          plain page colour (242) about 6 dp out - a soft cast shadow this drawing did not have at
          all, which is why the tile read as floating off its own background. */}
      <Pressable
        accessibilityRole="button"
        style={{
          position: 'absolute', left: 16.01, top: tileTop, width: TILE_W, height: TILE_W,
          backgroundColor: '#FFFFFF', borderRadius: 8, ...TILE_ELEVATION,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="at"
          style={{ position: 'absolute', left: (TILE_W - 24.02) / 2, top: (TILE_W - 24.02) / 2, width: 24.02, height: 24.02 }}
        >
          <AtIcon width={24} height={24} color={colors.accent} />
        </Pressable>
      </Pressable>
      {title ? (
        <View style={{ position: 'absolute', left: 80.06, top: fieldTop, width: FIELD_W, height: TILE_W }}>
          <TextInput
            value={title}
            onChangeText={onTitle}
            accessibilityLabel={title}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: FIELD_W,
              height: TILE_W,
              fontSize: 18.7,
              fontFamily: fontFamily.title,
              color: INK,
              padding: 0,
            }}
          />
        </View>
      ) : (
        <>
          {/* The field's own caret: the reference reports the hint text's box starting 1.8 dp right
              of the field edge, and that first 1.8 dp is the cursor's own accent ink. */}
          <View pointerEvents="none" style={{ position: 'absolute', left: 82.06, top: fieldTop + 14.1, width: 1.82, height: 19.5, backgroundColor: colors.accent }} />
          <Text
            style={{
              position: 'absolute',
              left: 84.1,
              top: fieldTop + 12.37,
              width: 134.6,
              height: 23.29,
              fontSize: 19.17,
              fontFamily: fontFamily.title,
              lineHeight: 23.29,
              color: colors.accent,
            }}
          >
            {titlePlaceholder}
          </Text>
        </>
      )}
      {/* The field's underline runs from the field's left edge to the frame's right margin. */}
      <View pointerEvents="none" style={{ position: 'absolute', left: 80.06, top: tileTop + TILE_W - 9.0, width: FIELD_W, height: 0.8, backgroundColor: colors.accent }} />

      {step === 1 ? (
        <>
          <Text
            style={{
              position: 'absolute', left: 16.01, top: 80.06, width: 360.98, height: 23.29,
              fontSize: 20.3, fontFamily: fontFamily.header, lineHeight: 23.29, color: GREY,
            }}
          >
            What?
          </Text>
          {suggestions.map((s, i) => {
            const Icon = SUGGESTION_ICONS[s.icon];
            const top = CARD.firstTop + i * CARD.pitch;
            return (
              <Pressable
                key={s.title}
                accessibilityRole="button"
                accessibilityLabel={s.title}
                onPress={() => onPickSuggestion(s.title)}
                style={{
                  position: 'absolute', left: CARD.left, top, width: CARD.w, height: CARD.h,
                  backgroundColor: '#FFFFFF',
                  /* R29: the reference's suggestion cards cut 12.1 dp (11.6 / 12.1 / 12.1 / 13.0). */
                  borderRadius: 12,
                }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={SUGGESTION_KEYS[s.icon]}
                  onPress={() => onPickSuggestion(s.title)}
                  style={{ position: 'absolute', left: 32.02 - CARD.left, top: 16.73, width: 24.02, height: 24.02 }}
                >
                  <Icon size={24} color={colors.accent} />
                </Pressable>
                <Text
                  style={{
                    position: 'absolute', left: 72.05 - CARD.left, top: 8.0, width: 172.85, height: 16.38,
                    fontSize: 13.48, fontFamily: fontFamily.number, lineHeight: 16.38, letterSpacing: 0.08, color: SOFT,
                  }}
                >
                  {s.range}
                </Text>
                <Text
                  style={{
                    position: 'absolute', left: 72.05 - CARD.left, top: 28.38, width: 200, height: 21.11,
                    fontSize: 17.37, fontFamily: fontFamily.title, lineHeight: 21.11, color: INK,
                  }}
                >
                  {s.title}
                </Text>
              </Pressable>
            );
          })}
          <CommitButton label="Continue" labelBox={COMMIT_LABEL.continue} onPress={onCommit} />
        </>
      ) : (
        <>
          {/* When? */}
          <Text
            style={{
              position: 'absolute', left: 16.01, top: 176.12, width: 306.39, height: 23.29,
              fontSize: 20.3, fontFamily: fontFamily.header, lineHeight: 23.29, color: GREY,
            }}
          >
            When?
          </Text>
          <Text
            style={{
              position: 'absolute', left: 322.41, top: 163.75, width: 54.58, height: 48.03,
              // The reference's own box fits its face; our substituted face's advance is 60.37 dp and
              // wrapped the trailing dots inside the same box. A -0.96 tracking puts the run's advance
              // at 53.5 dp - one line, inside the reference's own box, and its ink width lands 1.1 dp
              // from the reference's (tolerance 2.0). The glyph height and ink mass are unchanged.
              letterSpacing: -0.96,
              fontSize: 19.17, fontFamily: fontFamily.title, lineHeight: 48.03, color: colors.accent,
            }}
          >
            More...
          </Text>
          {/* The wheel: the two slots on either side of the pill read darker than the outer two. */}
          {[
            { y: 208.51, c: FADED },
            { y: 248.54, c: WHEEL },
            { y: 328.59, c: WHEEL },
            { y: 368.62, c: FADED },
          ].map((t, i) => (
            <Text
              key={t.y}
              style={{
                position: 'absolute', left: 160.47, top: t.y, width: 73.14, height: 22.2,
                fontSize: 16.8, fontFamily: fontFamily.number, lineHeight: 22.2, color: t.c, textAlign: 'center',
              }}
            >
              {wheel[i]}
            </Text>
          ))}
          <View pointerEvents="none" style={{ position: 'absolute', left: 66.59, top: 274.37, width: 259.82, height: 45.12, borderRadius: 8, backgroundColor: colors.accent }} />
          <Text
            style={{
              position: 'absolute', left: 124.09, top: 288.93, width: 145.56, height: 21.11,
              fontSize: 18.7, fontFamily: fontFamily.title, lineHeight: 21.11, color: '#FFFFFF', textAlign: 'center',
            }}
          >
            {pillLabel}
          </Text>
          <Pressable
            accessibilityRole="button"
            style={{ position: 'absolute', left: 173.21, top: 394.09, width: 68.77, height: 48.03 }}
          >
            <View pointerEvents="none" style={{ position: 'absolute', left: -22.2, top: 16.0, width: 17, height: 17 }}>
              <CalendarSmallIcon size={17} color={colors.accent} />
            </View>
            <Text
              style={{
                position: 'absolute', left: 0, top: 0, width: 68.77, height: 48.03,
                fontSize: 18.4, fontFamily: fontFamily.title, lineHeight: 48.03, color: colors.accent,
              }}
            >
              9/28/26
            </Text>
          </Pressable>

          {/* How long? */}
          <Text
            style={{
              position: 'absolute', left: 16.01, top: 481.06, width: 282.38, height: 23.29,
              fontSize: 20.3, fontFamily: fontFamily.header, lineHeight: 23.29, color: GREY,
            }}
          >
            How long?
          </Text>
          <Text
            style={{
              position: 'absolute', left: 310.4, top: 482.88, width: 54.58, height: 19.65,
              // The instance's advance (55.10 dp) overshoots the reference's own box by 0.52 dp and
              // wrapped the last dot; -0.08 tracking puts it at 54.54 - one line inside the box.
              letterSpacing: -0.08,
              fontSize: 17.2, fontFamily: fontFamily.more, lineHeight: 19.65, color: colors.accent,
            }}
          >
            More...
          </Text>
          {/* The duration tray. The wash runs from the tray's inner edge to the pill; the pill is a
              fixed 48 dp centred on the unit run; every cell label is centred in its own cell and
              the selected cell's run is nested inside the unit run (see the file header). */}
          <View pointerEvents="none" style={{
            position: 'absolute', left: TRAY.left, top: TRAY.top, width: TRAY.w, height: TRAY.h,
            /* R29: 8.3 dp on the reference (7.5 / 8.3 / 8.3 / 8.8). */
            borderRadius: 8, backgroundColor: '#FFFFFF',
          }} />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute', left: WASH.left, top: WASH.top, width: pillLeft - WASH.left, height: WASH.h,
              backgroundColor: colors.accentWash, borderBottomLeftRadius: 12, borderTopLeftRadius: 12,
            }}
          />
          {/* The reference paints its pill exactly on its reported view bounds (left 78.60 dp), but
              Chrome quantizes a plain background's paint edge to whole CSS pixels at the capture's
              device scale - measured: any left in [78.5, 79.0) paints at 79.0, any left in
              [77.5, 78.5) at 78.0 - so the fill landed ~1.05 device px right of the reference's and
              the `1` cell's ink sliver read 0.83. A transform is not quantized: translateX(-0.4)
              paints the fill edge at 216.0 device px, on the reference's own edge. The element box
              itself is invisible to the dump (no text, no role), so the transform moves nothing the
              gate compares. */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute', left: pillLeft, top: WASH.top, width: PILL_W, height: WASH.h,
              borderRadius: 8, backgroundColor: colors.accent, transform: [{ translateX: -0.4 }],
            }}
          />
          {DURATION_SEGMENTS.map(({ label }, i) => {
            const selected = i === selectedIndex;
            return (
              <React.Fragment key={label}>
                {/* The touch/feedback surface. It is not part of the accessibility tree: the
                    reference reports each segment as a TextView, so the Text node below remains
                    the accessible element and keeps the gate pairing unchanged. The Pressable
                    only supplies the pressed wash and the actual duration selection. */}
                <Pressable
                  accessible={false}
                  onPress={() => onDuration?.(durationPresets[i])}
                  style={({ pressed }) => ({
                    position: 'absolute',
                    left: segLefts[i],
                    top: SEG_TOP,
                    width: segWidths[i],
                    height: SEG_H,
                    borderRadius: 8,
                    backgroundColor: pressed ? colors.accentWash : 'transparent',
                  })}
                />
                {selected ? (
                  <Text
                    pointerEvents="none"
                    style={{
                      position: 'absolute', left: segLefts[i], top: SEG_TOP, width: segWidths[i], height: SEG_H,
                      fontSize: 14.0, fontFamily: fontFamily.chip, lineHeight: SEG_H, color: 'transparent', textAlign: 'center', letterSpacing: 0.45,
                    }}
                  >
                    {label}
                    <Text
                      style={{
                        position: 'absolute', left: unitBox.left - segLefts[i], top: 0, width: unitBox.w, height: SEG_H,
                        fontSize: 15.5, fontFamily: fontFamily.now, lineHeight: SEG_H, color: '#FFFFFF', textAlign: 'center',
                      }}
                    >
                      {unitLabel}
                    </Text>
                  </Text>
                ) : (
                  <Text
                    pointerEvents="none"
                    style={{
                      position: 'absolute', left: segLefts[i], top: SEG_TOP, width: segWidths[i], height: SEG_H,
                      fontSize: 14.0, fontFamily: fontFamily.chip, lineHeight: SEG_H, color: colors.accent, textAlign: 'center', letterSpacing: 0.45,
                    }}
                  >
                    {label}
                  </Text>
                )}
              </React.Fragment>
            );
          })}

          {/* What color? The tray sits nearly behind the commit button here: only each disc's top
              sliver clears the button's own top edge, exactly as the frame shows. */}
          <Text
            style={{
              position: 'absolute', left: 16.01, top: 641.17, width: 282.38, height: 23.29,
              fontSize: 20.3, fontFamily: fontFamily.header, lineHeight: 23.29, color: GREY,
            }}
          >
            What color?
          </Text>
          <Text
            style={{
              position: 'absolute', left: 310.4, top: 642.99, width: 54.58, height: 19.65,
              letterSpacing: -0.08,
              fontSize: 17.2, fontFamily: fontFamily.more, lineHeight: 19.65, color: colors.accent,
            }}
          >
            More...
          </Text>
          <View pointerEvents="none" style={{ position: 'absolute', left: SWATCH.left, top: SWATCH.top, width: SWATCH.w, height: SWATCH.h, borderRadius: 16, backgroundColor: '#FFFFFF' }} />
          {/* The first disc is the "no colour" choice: white fill, accent ring. */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: DISC.firstCx - DISC.d / 2,
              top: DISC.cy - DISC.d / 2,
              width: DISC.d,
              height: DISC.d,
              borderRadius: DISC.d / 2,
              backgroundColor: '#FFFFFF',
              borderWidth: 2.5,
              borderColor: colors.accent,
            }}
          />
          {discColours.map((c, i) => (
            <View
              key={c}
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: DISC.firstCx + (i + 1) * DISC.pitch - DISC.d / 2,
                top: DISC.cy - DISC.d / 2,
                width: DISC.d,
                height: DISC.d,
                borderRadius: DISC.d / 2,
                backgroundColor: c,
              }}
            />
          ))}
          {/* The swatches' own touch nodes: eight 40 x 13.1 columns and the black swatch's 48 dp
              box, all under the button, so the gate pairs each with its own node and the reach
              check reports them as covered by the button above them. */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              style={{ position: 'absolute', left: 22.2 + i * 40.03, top: 697.21, width: 40.03, height: 13.1 }}
            />
          ))}
          <Pressable
            accessibilityRole="button"
            style={{ position: 'absolute', left: 342.42, top: 697.21, width: 48.03, height: 48.03 }}
          />
          <CommitButton
            label={editing ? 'Update Task' : 'Create Task'}
            labelBox={editing ? COMMIT_LABEL.update : COMMIT_LABEL.create}
            onPress={onCommit}
          />
        </>
      )}
    </View>
  );
};

/** The sheet's filled primary button: one accent slab with its own label centred on the frame. */
const CommitButton: React.FC<{ label: string; labelBox: { left: number; top: number; w: number }; onPress: () => void }> = ({
  label,
  labelBox,
  onPress,
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    style={{
    position: 'absolute', left: BUTTON.left, top: BUTTON.top, width: BUTTON.w, height: BUTTON.h,
    /* R29: 8.0 dp on the reference (7.5 / 8.1 / 7.9 / 8.6). */
    borderRadius: 8, backgroundColor: colors.accent,
  }}
  >
    <Text
      style={{
        position: 'absolute',
        left: labelBox.left - BUTTON.left,
        top: labelBox.top - BUTTON.top,
        width: labelBox.w,
        height: 23.29,
        fontSize: 19.17,
        fontFamily: fontFamily.title,
        lineHeight: 23.29,
        color: '#FFFFFF',
        textAlign: 'center',
      }}
    >
      {label}
    </Text>
  </Pressable>
);
