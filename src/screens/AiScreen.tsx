/**
 * The AI assistant tab - the fourth bottom-bar destination.
 *
 * COVERAGE GAP CLOSED (R32). `components/Chrome.tsx` has always declared an
 * `{ key: 'ai', label: 'AI', cx: 245.45 }` bar item, but `App.tsx` only ever
 * branched on `timeline` / `inbox` / `settings`. Tapping AI therefore fell
 * through every branch and rendered the header plus the grey nav band over an
 * empty flex box - a reachable tab with no page behind it. `scope.json` already
 * listed `ai-tab` under `not_yet_captured`, so this page was never built.
 *
 * Layout follows the Inbox tab rather than the timeline, because AI is a flat
 * page in the same family: `App.tsx` puts `ai` in `chromeless`, so there is no
 * white sheet and no week strip. The measured anchors reused here are the
 * Inbox frame's own (title at x 16.01 / y 17.83, the 48 dp key centred on the
 * frame at x 172.48, the centred runs at y 357.3 and 392.27, the wash button at
 * y 447.63) - all from `inbox/inbox_00`. Only the glyph and the copy differ;
 * no reference frame exists for AI, and none is invented: the claim in
 * design-qa terms is "the destination is reachable and populated", not "these
 * are measured coordinates".
 */
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { NavAiIcon, PlusIcon } from '../icons';
import { colors, fontFamily, frame, type } from '../theme/tokens';

/** The three things the assistant can be asked to do, in the order the sheet lists them. */
const SUGGESTIONS = [
  { key: 'plan', label: 'Plan my day' },
  { key: 'breakdown', label: 'Break down a task' },
  { key: 'reschedule', label: 'Reschedule something' },
] as const;

export const AiScreen: React.FC<{ onNew?: () => void }> = ({ onNew }) => (
  <View style={{ position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, backgroundColor: colors.page }}>
    <Text style={{ position: 'absolute', left: 16.01, top: 17.83, width: 180, ...type.header, color: colors.ink }}>
      AI
    </Text>

    {/* The assistant mark. Same 48 dp key slot as the Inbox tab's fill glyph, centred on the frame. */}
    <View
      accessibilityRole="button"
      accessibilityLabel="AI assistant"
      style={{ position: 'absolute', left: 172.48, top: 279.29, width: 48.03, height: 48.03, alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        style={{
          width: 48.03,
          height: 48.03,
          borderRadius: 24.02,
          backgroundColor: colors.accentWash,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <NavAiIcon size={26} color={colors.accent} />
      </View>
    </View>

    <View
      accessibilityRole="button"
      accessibilityLabel="How can I help?"
      style={{ position: 'absolute', left: 16.01, top: 351.3, width: 360.98, height: 18.9 }}
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
        How can I help?
      </Text>
    </View>
    <Text
      style={{
        position: 'absolute',
        left: 16.01,
        top: 386.27,
        width: 360.98,
        textAlign: 'center',
        fontSize: 13.2,
        lineHeight: 18.2,
        fontFamily: fontFamily.note,
        letterSpacing: 0.08,
        color: colors.inkSecondary,
      }}
    >
      {'Describe what you need and the assistant will help you plan it.'}
    </Text>

    {/* Suggestion chips, laid out as a single centred wrap: three full-width wash rows, the
        same 12 dp radius and accent wash the Inbox tab's own button uses. */}
    {SUGGESTIONS.map((s, index) => (
      <Pressable
        key={s.key}
        accessibilityRole="button"
        accessibilityLabel={s.label}
        onPress={onNew}
        style={{
          position: 'absolute',
          left: 16.01,
          top: 447.63 + index * 51.64,
          width: 360.73,
          height: 43.64,
          borderRadius: 12,
          backgroundColor: colors.accentWash,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 16,
        }}
      >
        <Text
          style={{
            fontSize: 15.5,
            lineHeight: 20,
            fontFamily: fontFamily.setting,
            letterSpacing: 0.08,
            color: colors.accent,
          }}
        >
          {s.label}
        </Text>
      </Pressable>
    ))}

    {/* The FAB, matching the Inbox tab's own 56 dp key and lift. */}
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
      <Pressable accessibilityRole="button" accessibilityLabel="Ask the assistant" onPress={onNew} style={{ width: 24.02, height: 24.02 }}>
        <PlusIcon size={24.02} color="#fff" />
      </Pressable>
    </Pressable>
  </View>
);