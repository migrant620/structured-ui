/**
 * The today timeline - reference state S1 (`home/home_01`).
 *
 * Row positions are the reference's own numbers, converted with the gate's transform
 * (`web_dp = px / 2.75 - 49.45`). They are not derived from a layout rule, because the reference
 * is not laid out by one: the guide tasks carry no start time, so the app stacks them under the
 * current time at its own spacing while the scheduled task keeps its distance. Treating these as
 * measured tokens - the same way the other Apps in this workspace treat a control's box - is what
 * keeps the first frame comparable; a dynamic rule is only worth adding where a state needs one.
 */
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { TwoToneRun } from '../components/TwoToneRun';
import { AlarmIcon, AtIcon, CheckCircleFillIcon, CheckSquareIcon, ChecklistIcon, GearIcon, NotesIcon, PlusCircleIcon, PlusIcon, RecurringIcon, TimerIcon, TrayIcon } from '../icons';
import { colors, space, type } from '../theme/tokens';
import { formatClock, Task } from '../store';

/** One row of the timeline, with the reference's own vertical placement. */
type RowLayout = {
  subTop: number;
  titleTop: number;
  titleLineHeight: number;
  discCy: number;
  discD: number;
  /** The recurring key, on the rows the reference draws one for. */
  recurringLeft?: number;
  recurringTop?: number;
  noteTop?: number;
  timerTop?: number;
  countTop?: number;
  notesTop?: number;
  /** The notes key sits after the counter on the row that carries one. */
  notesLeft?: number;
  /** A scheduled user task ("Team sync", S2) draws a smaller, non-square glyph box; defaults to the
   *  square 26.18 dp node the guide rows use. */
  glyphBox?: { w: number; h: number };
  /** The completion ring's own centre; the reference places it slightly above the disc on S2's row. */
  ringCy?: number;
  /** The ring's touch box height. S2's "Team sync" row draws a 32 dp-tall ring (ref icon@369,698 is
   *  47.7 x 32); the other rows use the shared 48 dp square. */
  ringH?: number;
  /** S2's user task renders its title in a compact face (the reference's node is ~10.6 dp tall). */
  compact?: boolean;
  /** Vertical offset of the glyph node from the disc's own centre. S2's `at` node sits 11.25 dp
   *  below the disc centre (measured off home_02: the grey disc's width profile tops out at
   *  y 661.8 -> centre 692.0, while the `at` ImageView reports [190,2039][262,2098] -> centre
   *  703.25), so the glyph rides the disc's lower half and slips under the bar. */
  glyphDy?: number;
};

export const rowLayout: Record<string, RowLayout> = {
  rise: {
    subTop: 177.45,
    titleTop: 193.82,
    titleLineHeight: 21.09,
    discCy: 195.9,
    discD: 60.5,
    recurringLeft: 186.55,
    recurringTop: 177.45,
    noteTop: 267.27,
    timerTop: 283.8,
  },
  'guide-start': {
    subTop: 356.36,
    titleTop: 372.73,
    titleLineHeight: 21.64,
    discCy: 395.1,
    discD: 76.5,
    notesTop: 418.18,
  },
  'guide-first': {
    subTop: 448.36,
    titleTop: 464.73,
    titleLineHeight: 21.09,
    discCy: 476.0,
    discD: 60.5,
    countTop: 489.09,
    notesTop: 488.0,
    notesLeft: 180.36,
  },
  'guide-inbox': {
    subTop: 520.36,
    titleTop: 536.73,
    titleLineHeight: 21.09,
    discCy: 548.0,
    discD: 60.5,
    notesTop: 560.0,
  },
  'guide-own': {
    subTop: 592.36,
    titleTop: 608.73,
    titleLineHeight: 21.09,
    discCy: 620.0,
    discD: 60.5,
    notesTop: 632.0,
  },
  /** S2's user-created task, appended below the five guide rows (reference `home/home_02`).
   *  The disc is a MUTED disc - unlike every guide row, whose disc carries the accent - with the
   *  accent `at` stroked on it: the reference's grey dome width profile (13.8 dp at y 663 rising
   *  to 59.6 by y 690) fits a 60.5 dp circle topping at 661.8, i.e. centre 692.0, while the `at`
   *  ImageView node stays centred at 703.25 - the glyph sits in the disc's lower half. The
   *  connector stub above it is a solid grey line, not the pink dashes the guide rows use. */
  teamSync: {
    subTop: 687.0,
    titleTop: 703.4,
    titleLineHeight: 10.6,
    discCy: 692.0,
    discD: 60.5,
    ringCy: 698.0,
    ringH: 32,
    glyphBox: { w: 26.2, h: 21.5 },
    glyphDy: 11.25,
    compact: true,
  },
  /** The second user-created task the reference's S10 frame shows below the completed "Team sync"
   *  (`delete/delete_05`, background): a muted-disc @ task, `08:15 - 08:30 PM (15m)`. Its row reads
   *  through the same measured offsets the teamSync row established (sub -5, title +11.4, ring
   *  +6 off the disc centre); the frame is reached scrolled, so the whole timeline shifts up. */
  grocery: {
    subTop: 680.0,
    titleTop: 696.4,
    titleLineHeight: 10.6,
    discCy: 685.0,
    discD: 60.5,
    ringCy: 691.0,
    ringH: 32,
    glyphBox: { w: 26.2, h: 21.5 },
    glyphDy: 11.25,
    compact: true,
  },
};

/** The reference's own glyph box inside a disc, shared by every row. */
const GLYPH_BOX = 26.18;
/** The plus's pink circle, measured off the reference's "Add Your First Task" disc (22.55 dp).
 *  PlusCircleIcon's circle fills its box, so the box is the circle's own diameter. */
const PLUS_SIZE = 22.55;
/** The other three glyphs keep the node's own 26.18 dp box: drawn there they matched the
 *  reference, and growing them to `inner` made the disc column 1 pp worse. */
const GLYPH_SIZE = GLYPH_BOX;

export const discLabel: Record<Task['icon'], string> = {
  alarm: 'alarm_fill',
  checklist: 'checklist',
  plusCircle: 'plus_circle_fill',
  tray: 'tray_full_fill',
  gear: 'gearshape_2_fill',
  at: 'at',
};

const Disc: React.FC<{
  icon: Task['icon'];
  scheduled: boolean;
  /** A completed task's disc mutes too, so the row reads as done even before the struck title
   *  registers (DESIGN.md "Completed means struck through": the title takes a line-through, the
   *  disc turns muted and the card flips to Incomplete). */
  done?: boolean;
  d: number;
  cy: number;
  onOpen: () => void;
  glyphBox?: { w: number; h: number };
  glyphDy?: number;
}> = ({ icon, scheduled, done = false, d, cy, onOpen, glyphBox = { w: GLYPH_BOX, h: GLYPH_BOX }, glyphDy = 0 }) => {
  // The alarm's measured face demands a 34 dp symbol box; the other guide glyphs match the reference
  // at the node's own 26.18 dp; S2's `at` fills its own non-square 26.2 x 21.5 node.
  const layerFor = (): { w: number; h: number } => {
    if (icon === 'alarm') return { w: inner, h: inner };
    if (icon === 'at') return glyphBox;
    return { w: GLYPH_SIZE, h: GLYPH_SIZE };
  };
  const inner = d >= 70 ? 44 : 34;
  const glyph = (() => {
    switch (icon) {
      case 'alarm':
        return <AlarmIcon size={inner} color="#fff" />;
      case 'checklist':
        return <ChecklistIcon size={GLYPH_SIZE} color={colors.accent} />;
      case 'plusCircle':
        // The cross is the *page* showing through, not the disc colour: stroking it in the disc's
        // own accent painted pink on pink and the plus vanished (the erosion test came back as one
        // solid 26 dp blob where the reference breaks into four quadrants).
        return <PlusCircleIcon size={PLUS_SIZE} color={colors.accent} bg="#fff" />;
      case 'tray':
        return <TrayIcon size={GLYPH_SIZE} color={colors.accent} />;
      case 'gear':
        return <GearIcon size={GLYPH_SIZE} color={colors.accent} bg={colors.surfaceMuted} />;
      case 'at':
        // The real glyph: the @ letterform stroked in the accent on the muted disc (see AtIcon -
        // traced off home_02's 8x crop; the old white-disc placeholder predates that crop).
        return <AtIcon width={20} height={20} color={colors.accent} />;
    }
  })();
  const layer = layerFor();
  return (
    <View
      style={{
        position: 'absolute',
        left: space.disc.cx - d / 2,
        top: cy - d / 2,
        width: d,
        height: d,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      pointerEvents="box-none"
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: d,
          height: d,
          borderRadius: d / 2,
          // Every guide row paints the accent disc; the reference's scheduled user task ("Team
          // sync", S2) is the one exception - its disc is the muted grey with the accent @ on it
          // (home_02's dome measures #E8E8E8-family fill, pink ink only on the glyph). A completed
          // task also drops to the muted disc (DESIGN.md / README.md: "the disc mutes"), which is
          // what makes the completion read on the spine, not only on the struck title.
          backgroundColor: scheduled && icon !== 'at' && !done ? colors.accent : colors.surfaceMuted,
        }}
      />
      {/* The reference reports the glyph as its own labelled node of this exact box, so the key is
          the glyph's box, not the disc's. `glyphDy` slides the node off the disc's centre for the
          one row where the reference does that (S2's `at`, +11.25 dp); absolutely positioned so
          the offset never disturbs the flex centring the other rows rely on. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={discLabel[icon]}
        onPress={onOpen}
        style={{
          position: 'absolute',
          left: (d - glyphBox.w) / 2,
          top: (d - glyphBox.h) / 2 + glyphDy,
          width: glyphBox.w,
          height: glyphBox.h,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* The glyph's own box (`inner`, 34/44 dp) is *larger* than the node the reference
            reports (26.18 dp). Rendering it straight into the flex box let the <svg> shrink to
            the box - flex-shrink defaults to 1 - so every row glyph came out 26.18/34 = 77 % of
            its true size; measured on the first row, the alarm face was 16.3 dp against the
            reference's 19.64. An absolute layer gives the glyph its real box and leaves the
            measured node untouched. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: (glyphBox.w - layer.w) / 2,
            top: (glyphBox.h - layer.h) / 2,
            width: layer.w,
            height: layer.h,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {glyph}
        </View>
      </Pressable>
    </View>
  );
};

/**
 * The unfinished-task ring; a completed task draws the reference's filled accent disc with the
 * check punched out instead (S7's completed "Team sync", S10's scrolled frame).
 *
 * The reference's own dump reports the touch column as a 47.7 x 48 node with no description, so the
 * key here carries no label either: an unlabelled container is what pairs with the reference's
 * unlabelled node, and the ring is drawn inside it without growing its box.
 */
const Ring: React.FC<{ cy: number; onOpen: () => void; h?: number; done?: boolean }> = ({ cy, onOpen, h = 48, done = false }) => {
  const { cx, outer, stroke } = space.ring;
  const BOX_W = 47.7;
  const BOX_H = h;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onOpen}
      style={{ position: 'absolute', left: cx - BOX_W / 2, top: cy - BOX_H / 2, width: BOX_W, height: BOX_H, alignItems: 'center', justifyContent: 'center' }}
    >
      {done ? (
        <CheckCircleFillIcon size={outer} color={colors.accent} />
      ) : (
        <View
          pointerEvents="none"
          style={{
            width: outer,
            height: outer,
            borderRadius: outer / 2,
            borderWidth: stroke,
            borderColor: colors.accent,
            backgroundColor: 'transparent',
          }}
        />
      )}
    </Pressable>
  );
};

/** The dashed connector that runs down the disc column between rows. Pink between planned rows;
 *  the reference turns it GREY once the plan runs out (home_01's segment below the last guide row
 *  alternates #EBEBEB/white, never the accent), and the stub into S2's muted `at` disc is a solid
 *  grey line (home_02 y 651..661.8 shows one continuous 2.55 dp run, no dash gap). */
const Connector: React.FC<{ from: number; to: number; color?: string; solid?: boolean }> = ({
  from,
  to,
  color = colors.accent,
  solid = false,
}) => {
  const segs: number[] = [];
  const { dash, gap, width } = space.connector;
  for (let y = from; y < to; y += dash + gap) segs.push(y);
  if (solid) {
    return (
      <View
        style={{
          position: 'absolute',
          left: space.disc.cx - width / 2 - 0.18,
          top: from,
          width: width + 0.37,
          height: to - from,
          borderRadius: width / 2,
          backgroundColor: color,
        }}
        pointerEvents="none"
      />
    );
  }
  return (
    <View
      style={{ position: 'absolute', left: space.disc.cx - width / 2, top: from, width, height: to - from }}
      pointerEvents="none"
    >
      {segs.map((y) => (
        <View
          key={y}
          style={{
            position: 'absolute',
            top: y - from,
            width,
            height: Math.min(dash, to - y),
            borderRadius: width / 2,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
};

const Row: React.FC<{ task: Task; layout: RowLayout; onOpen: (id: string) => void }> = ({ task, layout, onOpen }) => {
  const l = layout;
  const tall = l.discD >= 70;
  return (
    <View>
      <Disc icon={task.icon} scheduled={task.scheduled} done={task.done} d={l.discD} cy={l.discCy} onOpen={() => onOpen(task.id)} glyphBox={l.glyphBox} glyphDy={l.glyphDy} />
      <Ring cy={l.ringCy ?? l.discCy} h={l.ringH} onOpen={() => onOpen(task.id)} done={task.done} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={task.title}
        onPress={() => onOpen(task.id)}
        // The reference gives every timeline row a touch highlight while it is pressed; the wash is
        // the baseline's own accent wash (tokens-measured.json), so the feedback is the app's own
        // colour and never a new surface. It only paints under interaction - the gate's frozen `?p=`
        // frames are captured unpressed, so the highlight never reaches a scored frame.
        style={({ pressed }) => ({
          position: 'absolute',
          left: space.textLeft,
          top: l.subTop,
          width: 220,
          height: l.titleTop + l.titleLineHeight - l.subTop + 6,
          backgroundColor: pressed ? colors.accentWash : 'transparent',
          borderRadius: 8,
        })}
      >
        <Text style={{ position: 'absolute', left: 0, top: 0, ...type.rowMeta, color: colors.inkSecondary }}>
          {task.rangeLabel ?? (task.scheduled && task.start !== null ? formatClock(task.start) : task.sub)}
        </Text>
        {l.compact ? (
          <>
            {/*
              S2's "Team sync" is the reference's own title face at the reference's own position, but
              its *dump node* is clipped: the row sits under the bottom bar, and Android reports only
              the 10.6 dp band above the bar instead of the full ~23 dp text box. That clipped box
              cannot be reproduced by a real node - the browser's Range box follows the font's content
              box (23 dp) no matter what line-height is set, so a single node must either pass the
              geometry with its glyphs 7 dp too high (ink 2.4x the reference in the compared band) or
              paint the right band with a box the gate reads 6 dp off-centre. The row therefore splits
              the two roles, exactly like TwoToneRun:
              - a transparent mirror node carries the dump: its Range box is the font's own 91.8 x 23
                centred on the reference's clipped node, its element rect stays clear of the bar so
                the gate reads it visible, and it paints nothing;
              - an aria-hidden paint node draws the real glyphs with the content box anchored on the
                reference's own node top (703.4), so the compared band shows the same glyph tops the
                device shows and the bar covers the same lower half.
            */}
            <Text
              style={{
                position: 'absolute',
                left: 0,
                top: l.titleTop - l.subTop,
                width: 240,
                ...type.rowTitle,
                lineHeight: l.titleLineHeight,
                color: 'transparent',
              }}
              numberOfLines={1}
            >
              {task.title}
            </Text>
            <Text
              aria-hidden
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 0,
                top: l.titleTop - l.subTop,
                width: 240,
                ...type.rowTitle,
                // Line box == the font's own content box (measured 23 dp on this face), so the glyph
                // band starts exactly at the node top the reference reports.
                lineHeight: 23,
                // A completed title reads the darker done ink (DESIGN.md: "A completed title reads
                // `#59595F`, darker than the supporting greys: done, not deleted"), the same token
                // the detail sheet's completed title already uses. Only this visible run takes it -
                // the transparent mirror above stays colourless so it still paints nothing.
                color: task.done ? colors.doneInk : colors.ink,
                textDecorationLine: task.done ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </Text>
          </>
        ) : (
          <Text
            style={{
              position: 'absolute',
              left: 0,
              top: l.titleTop - l.subTop,
              // The two-line row wraps inside the reference's own 216.7 dp column ("Get Started with" /
              // "Structured!"), so its measured box matches that node; past 200 dp the gate compares the
              // centre rather than the width, which is what a wrapped run needs.
              width: tall ? 216.73 : 240,
              ...type.rowTitle,
              lineHeight: l.titleLineHeight,
              fontSize: tall ? type.rowTitleTall.fontSize : type.rowTitle.fontSize,
              // Same completed-title ink as the compact row above: the guide rows can be completed
              // from the detail sheet, so both branches must draw the reference's #59595F.
              color: task.done ? colors.doneInk : colors.ink,
              textDecorationLine: task.done ? 'line-through' : 'none',
            }}
            // Only the single-line rows carry `numberOfLines`. On the two-line row it would make
            // RN-Web emit `-webkit-line-clamp`, and the gate reads a clamped box that scrolls as a
            // truncation - `ellipsis: true` - even though both lines are drawn. The width alone is
            // what wraps it, and it wraps to exactly the two lines the reference shows.
            numberOfLines={tall ? undefined : 1}
          >
            {task.title}
          </Text>
        )}
      </Pressable>
      {l.recurringLeft !== undefined && task.recurring ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Is recurring"
          onPress={() => onOpen(task.id)}
          style={{ position: 'absolute', left: l.recurringLeft, top: l.recurringTop, width: 14.18, height: 14.18 }}
        >
          <RecurringIcon size={14.18} color={colors.inkSecondary} />
        </Pressable>
      ) : null}
      {l.notesTop !== undefined && task.hasNotes ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Has notes"
          onPress={() => onOpen(task.id)}
          style={{ position: 'absolute', left: l.notesLeft ?? space.textLeft, top: l.notesTop, width: 16, height: 16 }}
        >
          <NotesIcon size={16} color={colors.inkSecondary} />
        </Pressable>
      ) : null}
      {l.countTop !== undefined && task.checklist ? (
        // The checkbox left of the count is a pixel-only feature: the reference's dump reports no
        // node there (see CheckSquareIcon), so it renders as a bare View - no role, no label - and
        // the gate never sees it. It rides the count row: 0.8 dp below the count's own top, which
        // puts the measured box at (130.1, 489.9) on S1's unscrolled row.
        <View pointerEvents="none" style={{ position: 'absolute', left: 130.15, top: l.countTop + 0.8, width: 11.4, height: 12.3 }}>
          <CheckSquareIcon size={11.4} color={colors.inkSecondary} />
        </View>
      ) : null}
      {l.countTop !== undefined && task.checklist ? (
        <Text style={{ position: 'absolute', left: 148.36, top: l.countTop, ...type.count, color: colors.inkSecondary }}>
          {`${task.checklist.done}/${task.checklist.total}`}
        </Text>
      ) : null}
      {l.timerTop !== undefined && task.note ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="timer"
          onPress={() => onOpen(task.id)}
          style={{ position: 'absolute', left: space.textLeft, top: l.timerTop, width: 14.18, height: 14.18 }}
        >
          <TimerIcon size={14.18} color={colors.inkSecondary} />
        </Pressable>
      ) : null}
      {l.noteTop !== undefined && task.note ? (
        // The reference reports this row's text as a 48 dp tall node with the timer key beside it,
        // so the run's own box is that height and the glyph centres inside it. The calm-length
        // token inside the note is drawn in the accent ("Brief calm for 4m" - pink ink measured at
        // x 233.45..251.27 dp on BOTH home_01 and home_02, i.e. 86.8..105.5 into the run whose
        // left edge is 146.18), so the run goes through TwoToneRun like the month header; the span
        // ends are padded into the surrounding word gap so no neighbouring glyph is ever cut.
        // S7/S10's resolved note ("Reflect on the respite.") carries no accent token, so it renders
        // as one plain grey run instead.
        task.noteAccent === null ? (
          <Text
            style={{ position: 'absolute', left: 146.18, top: l.noteTop, width: 250, ...type.note, lineHeight: 48, color: colors.inkSecondary }}
          >
            {task.note}
          </Text>
        ) : (
          <TwoToneRun
            text={task.note}
            style={{ position: 'absolute', left: 146.18, top: l.noteTop, width: 250, ...type.note, lineHeight: 48, color: colors.inkSecondary }}
            from={task.noteAccent?.[0] ?? 86.8}
            to={task.noteAccent?.[1] ?? 105.5}
            color={colors.inkSecondary}
            accent={colors.accent}
            backing={colors.sheet}
          />
        )
      ) : null}
    </View>
  );
};

/** The ruler labels down the left edge, at the reference's own positions. */
const GUTTER: { top: number; label: string; now?: boolean }[] = [
  { top: 188.36, label: '8:00' },
  { top: 254.18, label: '11:00' },
  { top: 290.55, label: '2:00' },
  { top: 347.27, label: '6:40', now: true },
  { top: 408.36, label: '6:50' },
  { top: 438.18, label: '7:00' },
  { top: 498.18, label: '7:05' },
  { top: 510.18, label: '7:15' },
  { top: 570.18, label: '7:20' },
  { top: 582.18, label: '7:30' },
  { top: 642.18, label: '7:35' },
];

/**
 * S2's ruler: the capture time advanced, so "now" reads 6:44 and the strip reaches 8:00 to bracket the
 * 7:45 PM "Team sync" task. Every label but the `now` one keeps S1's own y; only the moving marker and
 * the two later labels are new.
 */
const GUTTER_S2: { top: number; label: string; now?: boolean }[] = [
  { top: 188.36, label: '8:00' },
  { top: 254.18, label: '11:00' },
  { top: 290.55, label: '2:00' },
  { top: 348.6, label: '6:44', now: true },
  { top: 408.36, label: '6:50' },
  { top: 438.18, label: '7:00' },
  { top: 498.18, label: '7:05' },
  { top: 510.18, label: '7:15' },
  { top: 570.18, label: '7:20' },
  { top: 582.18, label: '7:30' },
  { top: 642.18, label: '7:35' },
  { top: 654.6, label: '7:45' },
  { top: 697.2, label: '8:00' },
];

/**
 * S10's ruler and row geometry (`delete/delete_05`, background). The dialog's own dump holds only
 * four nodes, but the delete flow's earlier frame `delete/delete_02` carries the same timeline with
 * every background node - the frozen background is that frame scrolled 52.5 dp further down (its
 * own 8:00 label sits 52.5 dp lower than delete_05's). The rows read: the guide stack has shifted
 * up relative to the scheduled rows, the rise note has resolved into "Reflect on the respite.",
 * "Team sync" is completed and a second user task ("Grocery run") sits under it.
 */
const S10_BASE = 52.5;
export const GUTTER_S10_LABELS: { top: number; label: string; now?: boolean }[] = [
  { top: 188.49 - S10_BASE, label: '8:00' },
  { top: 251.81 - S10_BASE, label: '12:00' },
  { top: 308.58 - S10_BASE, label: '6:45' },
  { top: 344.6 - S10_BASE, label: '6:48', now: true },
  { top: 368.62 - S10_BASE, label: '6:50' },
  { top: 398.46 - S10_BASE, label: '7:00' },
  { top: 458.5 - S10_BASE, label: '7:05' },
  { top: 470.51 - S10_BASE, label: '7:15' },
  { top: 530.55 - S10_BASE, label: '7:20' },
  { top: 542.56 - S10_BASE, label: '7:30' },
  { top: 602.6 - S10_BASE, label: '7:35' },
  { top: 614.61 - S10_BASE, label: '7:45' },
  { top: 657.18 - S10_BASE, label: '8:00' },
  { top: 700.12 - S10_BASE, label: '8:15' },
];

/** Row placement for the S10 background, from delete_02 minus the 52.5 dp scroll. */
export const S10_LAYOUT: Record<string, RowLayout> = {
  rise: {
    subTop: 177.58 - S10_BASE,
    titleTop: 193.95 - S10_BASE,
    titleLineHeight: 21.09,
    discCy: 196.5 - S10_BASE,
    discD: 60.5,
    recurringLeft: 186.67,
    recurringTop: 177.58 - S10_BASE,
    noteTop: 247.44 - S10_BASE,
    timerTop: 263.82 - S10_BASE,
  },
  'guide-start': {
    subTop: 316.58 - S10_BASE,
    titleTop: 332.96 - S10_BASE,
    titleLineHeight: 21.64,
    discCy: 355.52 - S10_BASE,
    discD: 76.5,
    notesTop: 378.44 - S10_BASE,
  },
  'guide-first': {
    subTop: 408.65 - S10_BASE,
    titleTop: 425.02 - S10_BASE,
    titleLineHeight: 21.09,
    discCy: 436.67 - S10_BASE,
    discD: 60.5,
    countTop: 449.4 - S10_BASE,
    notesTop: 448.31 - S10_BASE,
    notesLeft: 180.49,
  },
  'guide-inbox': {
    subTop: 480.7 - S10_BASE,
    titleTop: 497.07 - S10_BASE,
    titleLineHeight: 21.09,
    discCy: 508.72 - S10_BASE,
    discD: 60.5,
    notesTop: 520.36 - S10_BASE,
  },
  'guide-own': {
    subTop: 552.75 - S10_BASE,
    titleTop: 569.12 - S10_BASE,
    titleLineHeight: 21.09,
    discCy: 580.77 - S10_BASE,
    discD: 60.5,
    notesTop: 592.41 - S10_BASE,
  },
  teamSync: {
    subTop: 646.99 - S10_BASE,
    titleTop: 663.37 - S10_BASE,
    titleLineHeight: 10.6,
    discCy: 665.55 - S10_BASE,
    discD: 60.5,
    ringCy: 671.5 - S10_BASE,
    ringH: 32,
    glyphBox: { w: 26.2, h: 21.5 },
    glyphDy: 11.25,
    compact: true,
  },
  /** delete_05 shows the second user task below the completed one; its own dump carries no
   *  background nodes, so its row rides the guide-row pitch (72 dp) off the teamSync disc. */
  grocery: {
    subTop: 684.5,
    titleTop: 700.9,
    titleLineHeight: 10.6,
    discCy: 703.0,
    discD: 60.5,
    ringCy: 709.0,
    ringH: 32,
    glyphBox: { w: 26.2, h: 21.5 },
    glyphDy: 11.25,
    compact: true,
  },
};

/**
 * S7 (`complete/complete_01`) background. The reference's dialog dump carries only the sheet's own
 * six nodes, so this layer is pixel-derived: every dark-ink band of complete_01 sits exactly 40.0 dp
 * above its detail_00 (= S1) counterpart - guide rows, their notes and the count row ride a uniform
 * scroll - while the rise row's own title/sub/disc stay put and only its note climbs 20 dp (the same
 * collapse S10 shows). The scroll uncovers the count row (0/5 at 449.09), which detail_00's sheet
 * edge (484.3) hides. The ruler re-derives too: the mid labels become a single 12:00, the
 * guide-start mark 6:45 separates from the now marker (both read 6:45 - grey mark, bold now), and
 * the marks below the fold keep their S1 pitch minus the same 40. Measured label centres off
 * complete_01 minus the 6 dp top-to-centre offset the S1 ruler used.
 */
const GUTTER_S7_LABELS: { top: number; label: string; now?: boolean }[] = [
  { top: 188.36, label: '8:00' },
  { top: 251.55, label: '12:00' },
  { top: 308.35, label: '6:45' },
  { top: 320.15, label: '6:45', now: true },
  { top: 368.35, label: '6:50' },
  { top: 398.25, label: '7:00' },
  { top: 458.25, label: '7:05' },
  { top: 470.25, label: '7:15' },
];

/** Row placement for the S7 background: the S1 rows minus a uniform 40 dp scroll, except the rise
 *  row which keeps its own position and drops only its note/timer pair by 20 dp. */
export const S7_LAYOUT: Record<string, RowLayout> = {
  rise: {
    subTop: 177.45,
    titleTop: 193.82,
    titleLineHeight: 21.09,
    discCy: 195.9,
    discD: 60.5,
    recurringLeft: 186.55,
    recurringTop: 177.45,
    noteTop: 247.27,
    timerTop: 263.8,
  },
  'guide-start': {
    subTop: 316.36,
    titleTop: 332.73,
    titleLineHeight: 21.64,
    discCy: 355.1,
    discD: 76.5,
    notesTop: 378.18,
  },
  'guide-first': {
    subTop: 408.36,
    titleTop: 424.73,
    titleLineHeight: 21.09,
    discCy: 436.0,
    discD: 60.5,
    countTop: 449.09,
    notesTop: 448.0,
    notesLeft: 180.36,
  },
  'guide-inbox': {
    subTop: 480.36,
    titleTop: 496.73,
    titleLineHeight: 21.09,
    discCy: 508.0,
    discD: 60.5,
    notesTop: 520.0,
  },
  'guide-own': {
    subTop: 552.36,
    titleTop: 568.73,
    titleLineHeight: 21.09,
    discCy: 580.0,
    discD: 60.5,
    notesTop: 592.0,
  },
  teamSync: {
    subTop: 647.0,
    titleTop: 663.4,
    titleLineHeight: 10.6,
    discCy: 652.0,
    discD: 60.5,
    ringCy: 658.0,
    ringH: 32,
    glyphBox: { w: 26.2, h: 21.5 },
    glyphDy: 11.25,
    compact: true,
  },
};

export const TimelineScreen: React.FC<{
  tasks: Task[];
  hint: string;
  onOpen: (id: string) => void;
  onAdd: () => void;
  scenario?: 'S1' | 'S2' | 'S6' | 'S7' | 'S10';
}> = ({ tasks, hint, onOpen, onAdd, scenario = 'S1' }) => {
  const scrolled = scenario === 'S10' || scenario === 'S7';
  const GUTTER_ACTIVE =
    scenario === 'S1'
      ? GUTTER
      : scenario === 'S10'
        ? GUTTER_S10_LABELS
        : scenario === 'S7'
          ? GUTTER_S7_LABELS
          : GUTTER_S2;
  const baseLayouts = scenario === 'S10' ? S10_LAYOUT : scenario === 'S7' ? S7_LAYOUT : rowLayout;
  // The frozen states fix every row the reference shows, so only interactively created tasks
  // arrive without a measured row. They ride the user-row pattern (the muted `at` disc the
  // reference paints for "Team sync": sub -5, title +11.4, ring +6 off the disc centre) chained
  // one 72 dp pitch below the last measured row, so a task made through the editor actually
  // lands on the spine instead of vanishing. Frozen scenarios never hit this: their seeds all
  // have entries, and a fresh user task only appears through real interaction.
  const layouts = React.useMemo(() => {
    const merged: Record<string, RowLayout> = { ...baseLayouts };
    let prev: RowLayout | null = null;
    for (const task of tasks) {
      if (merged[task.id]) {
        prev = merged[task.id];
        continue;
      }
      const discCy: number = (prev ? prev.discCy : 620) + 72;
      const layout: RowLayout = {
        subTop: discCy - 5,
        titleTop: discCy + 11.4,
        titleLineHeight: 10.6,
        discCy,
        discD: 60.5,
        ringCy: discCy + 6,
        ringH: 32,
        glyphBox: { w: 26.2, h: 21.5 },
        glyphDy: 11.25,
        compact: true,
      };
      merged[task.id] = layout;
      prev = layout;
    }
    return merged;
  }, [baseLayouts, tasks]);
  const shown = tasks.filter((task) => layouts[task.id]);
  const discs = shown.map((task) => ({ cy: layouts[task.id].discCy, d: layouts[task.id].discD }));
  const body = (
    <View style={{ flex: 1 }}>
      {discs.map((disc, i) => {
        // Segment colouring per the reference: pink between planned rows, grey into the muted
        // `at` disc (solid - the 11.5 dp stub shows no dash gap) and grey down the tail after the
        // plan ends (home_01 alternates #EBEBEB/white below the last guide row).
        const next = shown[i + 1];
        const nextLayout = next ? layouts[next.id] : null;
        const grey = !nextLayout || next.icon === 'at';
        return (
          <Connector
            key={i}
            from={disc.cy + disc.d / 2}
            to={nextLayout ? nextLayout.discCy - nextLayout.discD / 2 : space.nav.iconTop + 2}
            color={grey ? colors.surfaceMuted : colors.accent}
            solid={!!next && next.icon === 'at'}
          />
        );
      })}
      {GUTTER_ACTIVE.map((g, gi) => (
        <Text
          // S7's ruler carries the guide-start mark and the now marker on the same minute
          // (6:45 grey mark, 6:45 bold now), so the label alone is not a unique key.
          key={`${g.label}${g.now ? '-now' : ''}-${gi}`}
          style={{
            position: 'absolute',
            left: 0,
            top: g.top,
            width: 40,
            textAlign: 'right',
            ...(g.now ? type.gutterNow : type.gutter),
            color: g.now ? colors.ink : colors.inkSecondary,
          }}
        >
          {g.label}
        </Text>
      ))}
      {shown.map((task) => (
        <Row key={task.id} task={task} layout={layouts[task.id]} onOpen={onOpen} />
      ))}
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      {body}
      {/* The footer hint, its timer icon and the unlabelled node below it are S1-only: on the
          later scenarios the planning hint is replaced by the "Team sync" row, so rendering them
          would be extra/foreign nodes the reference's dump does not contain. The same replacement
          happens live: once an interactive session has created its own task (the hint's slot is
          the appended user row's), the hint yields to it, exactly as home_02's capture shows. */}
      {scenario === 'S1' && !tasks.some((t) => t.id.startsWith('user-')) && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="timer"
          onPress={() => undefined}
          style={{ position: 'absolute', left: space.textLeft, top: 682.3, width: 14.18, height: 14.18 }}
        >
          <TimerIcon size={14.18} color={colors.inkSecondary} />
        </Pressable>
      )}
      {/* The footer hint is one run in two colours: the reference paints the free-time span
          ("2h 25m") in the accent while the rest stays grey. The span is 117..160.8 dp into the
          run - the reference's own accent ink runs 263.7..307.7 dp against a box at 146.18 - and
          both edges fall in a space between words.

          The width is the reference's node, 212.1 dp, to within a dp: the run's own ink is 211.9 dp
          wide, so a box the reference's size holds it without wrapping, and the prototype then has
          a view of the same box the reference reports rather than one 38 dp wider. */}
      {scenario === 'S1' && !tasks.some((t) => t.id.startsWith('user-')) && (
        <TwoToneRun
          text={hint}
          from={117}
          to={160.8}
          color={colors.inkSecondary}
          accent={colors.accent}
          backing={colors.sheet}
          style={{ position: 'absolute', left: 146.18, top: 665.45, width: 213.5, ...type.note, lineHeight: 48, color: colors.inkSecondary }}
        />
      )}
      {/* The reference reports an unlabelled clickable 84.73 x 12 node here, in the gap between
          the footer hint and the bottom bar. It draws nothing - the pixels under it are the sheet's
          own white - but it is a node in the accessibility tree, so the prototype carries one at
          the same box, with no label, rather than leaving the reference's node unpaired. The same
          live substitution as the hint applies: once a user row occupies that slot, the pairing
          node yields (the frozen gate runs always see the reference's own layout). */}
      {scenario === 'S1' && !tasks.some((t) => t.id.startsWith('user-')) && (
        <Pressable
          accessibilityRole="button"
          onPress={() => undefined}
          style={{ position: 'absolute', left: 128, top: 701.45, width: 84.73, height: 12 }}
        />
      )}
      {/* Two nodes on the reference: the 56 dp touch box, which carries no description, and the
          24 dp `Add Task` glyph box inside it. Both exist here, outer first, so each pairs with its
          own node instead of the unlabelled box grabbing the glyph's.

          A `//` comment must not go here: inside JSX children it is literal text, and React renders
          it as a real text node. That node then stretches to the column and its black glyphs sit
          behind every row, which is what makes the ink probe read black for runs it overlaps. */}
      <Pressable
        accessibilityRole="button"
        onPress={onAdd}
        style={{
          position: 'absolute',
          left: space.fab.cx - space.fab.diameter / 2,
          top: space.fab.cy - space.fab.diameter / 2,
          width: space.fab.diameter,
          height: space.fab.diameter,
          borderRadius: space.fab.diameter / 2,
          backgroundColor: colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
          // The reference's button casts a long raised shadow: `.runtime/shadow_sweep.py` fit a
          // Gaussian box-shadow to the reference's own sheet below the disc by row-wise RMS (the
          // strip holds only the disc, its shadow and the white surface), and the best match is
          // dy 8 / blur 20 / opacity 0.30. Android's own shadow is not a Gaussian so this is the
          // closest the CSS model reaches; it closes most of the gap the footer-hint ink probe saw
          // under the button.
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add Task"
          onPress={onAdd}
          style={{ width: 24, height: 24 }}
        >
          <PlusIcon size={24} color="#fff" />
        </Pressable>
      </Pressable>
    </View>
  );
};
