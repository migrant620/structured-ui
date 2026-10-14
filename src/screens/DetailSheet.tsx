/**
 * The task detail sheet - reference states S6 (`detail/detail_00`) and S7 (`complete/complete_01`)
 * - and the delete confirmation dialog - reference state S10 (`delete/delete_05`).
 *
 * Both are overlays: the sheet sits on the timeline under a black 32.2 % scrim (the reference's own
 * two colour pairs both scale by 0.678), the dialog under the same scrim over the scrolled sheet.
 * The overlays' own dumps carry only the overlay's nodes, so everything behind the scrim is judged
 * from the raster (L3/L4), not from the dump.
 *
 * Both roots carry `aria-modal`, which is what the gate's reach check reads to scope itself to the
 * top layer: while a modal is up the device reports only the modal's own controls, and so does the
 * prototype.
 */
import * as React from 'react';
import { AccessibilityRole, Pressable, Text, View } from 'react-native';
import {
  AtIcon,
  CheckCircleFillIcon,
  DuplicateIcon,
  IncompleteIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
} from '../icons';
import { colors, fontFamily, frame, type } from '../theme/tokens';

/**
 * The scrim the reference paints over everything behind an overlay. The detail sheet's dim
 * measures 0.322 (both of its colour pairs scale by 0.678); the delete dialog's is Material's
 * dialog scrim at 0.6 (the page 242 -> 97 and the nav bar 235 -> 94, the same factor). Both are
 * window-level dims: they cover the whole frame and the overlay's own surfaces sit above them,
 * which is why the prototype's dim runs past the sheet's top edge - the sheet paints over it.
 */
export const SCRIM = 'rgba(0, 0, 0, 0.322)';
export const SCRIM_DIALOG = 'rgba(0, 0, 0, 0.6)';

/** The sheet's own top edge, measured off detail_00 (the drag handle's 48 dp node sits on it). */
const SHEET_TOP = 484.34;

/**
 * The dim and its two nodes. The device's dim is a window-level layer that covers the whole frame;
 * the dump reports only its visible extent - the 393 x 533.8 band above the sheet's own top edge -
 * as the `Close sheet` key. The prototype draws the same pair: the real dim, full-frame, which is
 * what the gate's behindScrim test reads (a scrim that stops at the sheet would leave the dimmed
 * background scored as extra), and an unlabelled-to-ink, transparent key on the extent the dump
 * reports, so the reference's own node still has its control. The sheet paints over the dim's
 * lower half, so the raster shows the dim only where the reference shows it.
 */

/** One action card of the sheet's action row (Delete / Duplicate / Complete|Incomplete).
 *
 *  The reference reports each card as an 18.2 dp icon node over a 101.9 dp label run; the card
 *  surface itself carries no node, so its geometry is the raster's. `left` is the card's own left
 *  edge in sheet dp; `iconLeft` and `labelLeft` are the two nodes' offsets inside it, both taken
 *  straight off the dump rather than derived, so the pair sits where the reference sits. */
const ActionCard: React.FC<{
  label: string;
  icon: React.ReactNode;
  left: number;
  iconLeft: number;
  labelLeft: number;
  labelW: number;
  onPress?: () => void;
}> = ({ label, icon, left, iconLeft, labelLeft, labelW, onPress }) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={{ position: 'absolute', left, top: 626.91 - SHEET_TOP, width: 110, height: 59, borderRadius: 14, backgroundColor: colors.sheet }}
  >
    <View
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ position: 'absolute', left: iconLeft, top: 155.38 - (626.91 - SHEET_TOP), width: 18.19, height: 18.19, alignItems: 'center', justifyContent: 'center' }}
    >
      {icon}
    </View>
    <Text
      style={{
        position: 'absolute',
        left: labelLeft,
        top: 34.99,
        width: labelW,
        height: 16.38,
        fontFamily: fontFamily.action,
        fontSize: 14.5,
        letterSpacing: 0.08,
        lineHeight: 16.38,
        textAlign: 'center',
        color: colors.accent,
      }}
    >
      {label}
    </Text>
  </Pressable>
);

export const DetailSheet: React.FC<{
  title: string;
  range: string;
  done: boolean;
  onToggleDone?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
}> = ({ title, range, done, onToggleDone, onDelete, onEdit, onClose }) => (
  <View
    aria-modal
    // RN's AccessibilityRole union lacks "dialog", but RN-Web forwards the string
    // verbatim and the gate reads the emitted role=dialog element; the cast keeps the
    // DOM byte-identical while satisfying tsc.
    accessibilityRole={"dialog" as unknown as AccessibilityRole}
    style={{ position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, zIndex: 40 }}
  >
    {/* The dim: full-frame, as the device's window-level dim is. The sheet below paints over it. */}
    <Pressable
      accessibilityRole="button"
      onPress={onClose}
      style={{ position: 'absolute', left: 0, top: -49.45, width: 393, height: 826.9, backgroundColor: SCRIM }}
    />
    {/* The key the dump reports: the dim's visible extent, transparent, so it adds no ink. */}
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close sheet"
      onPress={onClose}
      style={{ position: 'absolute', left: 0, top: -49.45, width: 393, height: 533.78 }}
    />
    {/* The sheet: the page grey with the reference's 22 dp rounded top, from y 484.34 down. The
        reference's own sheet surface is the page colour, not white - only the three action cards
        and the Edit Task slab are white on it. */}
    <View style={{ position: 'absolute', left: 0, top: SHEET_TOP, width: frame.width, height: frame.height - SHEET_TOP, backgroundColor: colors.page, borderTopLeftRadius: 22, borderTopRightRadius: 22 }}>
      {/* Drag handle: an unlabelled 48 dp node, then the labelled 32 x 4 bar inside it. */}
      <View
        accessibilityRole="button"
        style={{ position: 'absolute', left: 172.48, top: 0, width: 48.03, height: 48.4, alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={{ width: 32.02, height: 4, borderRadius: 2, backgroundColor: colors.accent }} />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Drag handle"
        onPress={onClose}
        style={{ position: 'absolute', left: 180.49, top: 22.16, width: 32.02, height: 4 }}
      />
      {/* Head: the accent @ (28 dp node), the grey datetime run, the black title run. */}
      <View
        accessibilityRole="button"
        accessibilityLabel="at"
        style={{ position: 'absolute', left: 16.01, top: 71.32, width: 28.02, height: 28.02, alignItems: 'center', justifyContent: 'center' }}
      >
        <AtIcon width={23} height={23} color={colors.accent} />
      </View>
      <Text style={{ position: 'absolute', left: 60.04, top: 65.47, width: 206.32, height: 16.38, fontFamily: fontFamily.sub, fontSize: 13.8, letterSpacing: 0.08, lineHeight: 16.38, color: '#85858A' }}>
        {range}
      </Text>
      <Text
        style={{
          position: 'absolute',
          left: 60.04,
          top: 82.96,
          width: 240,
          height: 23.29,
          ...type.rowTitle,
          fontSize: 20.8,
          lineHeight: 23.29,
          textDecorationLine: done ? 'line-through' : 'none',
          color: done ? colors.doneInk : colors.ink,
        }}
      >
        {title}
      </Text>
      {/* Divider under the head (no node on the reference). */}
      <View style={{ position: 'absolute', left: 16.01, top: 115, width: 360.73, height: 1, backgroundColor: colors.surfaceMuted }} />
      {/* Action row: three 108.9 dp cards, 17 dp apart, at the reference's own icon and label boxes. */}
      <ActionCard label="Delete" icon={<TrashIcon size={18.19} color={colors.accent} />} left={16.01} iconLeft={45.85} labelLeft={4.0} labelW={101.9} onPress={onDelete} />
      <ActionCard label="Duplicate" icon={<DuplicateIcon size={18.19} color={colors.accent} />} left={141.37} iconLeft={46.4} labelLeft={4.55} labelW={101.5} />
      <ActionCard
        label={done ? 'Incomplete' : 'Complete'}
        icon={done ? <IncompleteIcon size={18.19} color={colors.accent} /> : <CheckCircleFillIcon size={18.19} color={colors.accent} />}
        left={266.73}
        iconLeft={46.58}
        labelLeft={4.73}
        labelW={101.5}
        onPress={onToggleDone}
      />
      {/* Edit Task row: a full-width white slab with the accent pencil + label. Its own box is not
          the prototype's to choose: the reference's slab measures y 710.3..761.6 (51.3 dp tall) and
          x 16.4..376.3 (359.9 dp wide), while this one was drawn 3.2 dp lower and 6.2 dp taller
          (58 dp). The pencil and the label keep the absolute offsets the dump reports, so the two
          subtractions below are taken against the slab's new top rather than the old 713.45. */}
      <Pressable
        accessibilityRole="button"
        onPress={onEdit}
        style={{ position: 'absolute', left: 16.01, top: 710.3 - SHEET_TOP, width: 360.73, height: 51.3, borderRadius: 16, backgroundColor: colors.sheet }}
      >
        <View
          accessibilityRole="button"
          accessibilityLabel="Edit Task"
          style={{ position: 'absolute', left: 139.73 - 16.01, top: 727.05 - 710.3, width: 18.19, height: 18.19, alignItems: 'center', justifyContent: 'center' }}
        >
          <PencilIcon size={18.19} color={colors.accent} />
        </View>
        <Text style={{ position: 'absolute', left: 164.11 - 16.01, top: 724.5 - 710.3, height: 23.29, ...type.rowTitle, fontSize: 20.25, lineHeight: 23.29, color: colors.accent }}>
          Edit Task
        </Text>
      </Pressable>
    </View>
  </View>
);

/** The delete confirmation - S10. The reference's dialog dump holds exactly four runs, all inside
 *  a Material dialog whose own surfaces carry no nodes; the dimmed timeline behind it is judged
 *  from the raster. */
export const DeleteDialog: React.FC<{
  onCancel?: () => void;
  onDelete?: () => void;
}> = ({ onCancel, onDelete }) => (
  <View
    aria-modal
    // RN's AccessibilityRole union lacks "dialog", but RN-Web forwards the string
    // verbatim and the gate reads the emitted role=dialog element; the cast keeps the
    // DOM byte-identical while satisfying tsc.
    accessibilityRole={"dialog" as unknown as AccessibilityRole}
    style={{ position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, zIndex: 40 }}
  >
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close dialog"
      onPress={onCancel}
      style={{ position: 'absolute', left: 0, top: -49.45, width: 393, height: 826.9, backgroundColor: SCRIM_DIALOG }}
    >
    <View
      style={{
        position: 'absolute',
        left: 43.4,
        /* the card hangs off the scrim, whose own top is -49.45: this 353.65 puts the card back
           at the page's 304.2. */
        top: 353.65,
        width: 305.9,
        height: 168.5,
        borderRadius: 24,
        backgroundColor: colors.sheet,
      }}
    >
      {/* The reference's dialog title is its own larger face: its ink runs 111.7 dp against the
          row-title's 91.8 for the same string, so the size follows the ink, not the row title. */}
      <Text style={{ position: 'absolute', left: 21.01, top: 23.28, height: 25.84, fontFamily: fontFamily.number, fontSize: 21.6, lineHeight: 25.84, color: colors.ink }}>
        Delete Task
      </Text>
      <Text style={{ position: 'absolute', left: 21.01, top: 82.31, width: 263.82, height: 16.38, fontFamily: fontFamily.sub, fontSize: 13.8, letterSpacing: 0.08, lineHeight: 16.38, color: '#85858A' }}>
        {/* R26: the reference's own line is "Are you sure you want to delete this task?" — 263.8 dp
            on one 16.4 dp line. Our longer sentence wrapped to two lines and pushed the body's
            centre 9.1 dp off, so the copy follows the capture. */}
        Are you sure you want to delete this task?
      </Text>
      <Pressable accessibilityRole="button" onPress={onCancel} style={{ position: 'absolute', left: 148.1, top: 121.0, width: 96.71, height: 27.4 }}>
        <Text style={{ position: 'absolute', left: 5.0, top: 8.6, height: 16.38, fontFamily: fontFamily.title, fontSize: 14.5, letterSpacing: 0.08, lineHeight: 16.38, color: colors.inkSecondary }}>Cancel</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Delete" onPress={onDelete} style={{ position: 'absolute', left: 223.4, top: 121.0, width: 70, height: 27.4 }}>
        <Text style={{ position: 'absolute', left: 5.0, top: 8.6, height: 16.38, fontFamily: fontFamily.title, fontSize: 14.5, letterSpacing: 0.08, lineHeight: 16.38, color: '#B3261E' }}>Delete</Text>
      </Pressable>
    </View>
    </Pressable>
  </View>
);

/** The PRO chip of the settings list (S12's Google Calendar row): a pink wash pill carrying a
 *  16 dp star node and the PRO run. `x`/`y` are the star node's offset inside the row. */
export const ProChip: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <View
    style={{
      position: 'absolute',
      /* The reference's pill reads 280.9..340.2 x 629.2..648.8 off settings_00: 59.3 x 19.6 with
         capsule ends, hanging 2.18 below the star node's top and 5.84 left of its left edge. */
      left: x - 5.84,
      top: y - 2.18,
      width: 59.3,
      height: 19.6,
      borderRadius: 9.8,
      backgroundColor: colors.accent,
    }}
  >
    <View
      accessibilityRole="button"
      accessibilityLabel="PRO"
      style={{ position: 'absolute', left: 5.84, top: 2.18, width: 16.01, height: 16.01, alignItems: 'center', justifyContent: 'center' }}
    >
      <StarIcon size={14} color="#FFFFFF" />
    </View>
    <Text style={{ position: 'absolute', left: 25.9, top: 0.63, width: 29.5, fontFamily: fontFamily.chip, fontSize: 14.5, letterSpacing: 0.08, lineHeight: 16.38, color: '#FFFFFF' }}>
      PRO
    </Text>
  </View>
);
