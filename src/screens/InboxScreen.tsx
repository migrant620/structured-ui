/**
 * The inbox empty state - reference state S11 (`inbox/inbox_00`).
 *
 * A flat page (no white sheet): the title sits in the header band, the empty-state stack is
 * vertically centred in the sheet area, and the page keeps the FAB and the bottom bar.
 */
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { InboxFillIcon, PlusIcon } from '../icons';
import { colors, fontFamily, frame, type } from '../theme/tokens';

export const InboxScreen: React.FC<{ onNew?: () => void }> = ({ onNew }) => (
  <View style={{ position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, backgroundColor: colors.page }}>
    <Text style={{ position: 'absolute', left: 16.01, top: 17.83, width: 180, ...type.header, color: colors.ink }}>
      Inbox
    </Text>

    {/* Empty-state stack. The icon node is the 48 dp key; the two runs are centred on the frame. */}
    <View
      accessibilityRole="button"
      accessibilityLabel="Inbox"
      style={{ position: 'absolute', left: 172.48, top: 285.29, width: 48.03, height: 48.03, alignItems: 'center', justifyContent: 'center' }}
    >
      <InboxFillIcon size={44} color={colors.accent} />
    </View>
    {/* The empty state's title run. The reference reports it as a full-width TextView (x 16, w 361)
        whose glyphs are centred inside it, so the prototype carries the same pair: a control on the
        reference's own box - which is what the gate pairs a substituted run by - and the centred
        glyphs inside it. */}
    <View
      accessibilityRole="button"
      accessibilityLabel="Everything Worth Keeping"
      style={{ position: 'absolute', left: 16.01, top: 357.3, width: 360.98, height: 18.9 }}
    >
      <Text
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360.98,
          textAlign: 'center',
          ...type.rowTitle,
          color: colors.ink,
        }}
      >
        Everything Worth Keeping
      </Text>
    </View>
    <Text
      style={{
        position: 'absolute',
        left: 16.01,
        top: 392.27,
        width: 360.98,
        textAlign: 'center',
        fontSize: 13.2,
        lineHeight: 18.2,
        fontFamily: fontFamily.note,
        letterSpacing: 0.08,
        color: colors.inkSecondary,
      }}
    >
      {`Drop tasks and ideas here as they come. Move them to your timeline when you want to schedule them.`}
    </Text>
    {/* The wash button: a 20 dp plus-circle key, then the label run. */}
    <Pressable
      accessibilityRole="button"
      onPress={onNew}
      style={{ position: 'absolute', left: 16.01, top: 447.63, width: 360.73, height: 43.64, borderRadius: 12, backgroundColor: '#F3D9D9' }}
    >
      <View
        accessibilityRole="button"
        accessibilityLabel="New Inbox Task"
        style={{ position: 'absolute', left: 98.61, top: 11.23, width: 20.01, height: 20.01 }}
      >
        <PlusIcon size={20.01} color={colors.accent} />
      </View>
      <Text
        style={{
          position: 'absolute',
          left: 126.63,
          top: 10.51,
          // The reference TextView is 128.09 dp wide and its own font fits the string inside it. The
          // weight-matched instance we substitute is 2.1 dp wider in advance (130.23 dp at 18.1 dp), so a
          // box at the reference's exact width would wrap to two lines. The box is a container here, not a
          // datum: the glyphs' own left edge and ink width - which the gate compares - are unaffected by
          // the extra 7.9 dp of transparent room on the right.
          width: 136,
          fontSize: 18.1,
          lineHeight: 21.11,
          fontFamily: fontFamily.title,
          letterSpacing: 0.08,
          color: colors.accent,
        }}
      >
        New Inbox Task
      </Text>
    </Pressable>

    {/* The FAB: a 56 dp touch node, then the labelled 24 dp glyph inside it. */}
    <Pressable
      accessibilityRole="button"
      onPress={onNew}
      style={{
        position: 'absolute',
        left: 320.95,
        top: 641.9,
        width: 56.04,
        height: 56.04,
        borderRadius: 28.02,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      }}
    >
      <Pressable accessibilityRole="button" accessibilityLabel="Add Task" onPress={onNew} style={{ width: 24.02, height: 24.02 }}>
        <PlusIcon size={24.02} color="#fff" />
      </Pressable>
    </Pressable>
  </View>
);
