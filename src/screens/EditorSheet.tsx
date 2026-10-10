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
const CLOSE_HIT = { left: 4.0, top: 8.01, size: 48.03 };
const CLOSE = { left: 16.01, top: 20.01, size: 24.02 };
const TITLE = { left: 56.04, top: 17.83, h: 28.02 };
const TILE_W = 48.03;
const FIELD_W = 296.93;
const CARD = { left: 16.01, w: 360.61, h: 57.13, firstTop: 191.41, pitch: 73.51 };
const BUTTON = { left: 16.01, top: 710.31, w: 360.61, h: 51.31 };
const TRAY = { left: 16.01, top: 532.36, w: 360.73, h: 56.0 };
const WASH = { left: 22.18, top: 539.09, h: 42.91 };
const PILL_W = 48.0;
const SEG_TOP = 549.84;
const SEG_H = 22.2;
const DURATION_SEGMENTS: readonly {
    label: string;
    unit: string;
    box: {
        left: number;
        w: number;
    } | null;
}[] = [
    { label: '1', unit: '1m', box: { left: 34.91, w: 24.36 } },
    { label: '15', unit: '15m', box: { left: 85.51, w: 34.21 } },
    { label: '30', unit: '30m', box: { left: 148.1, w: 34.21 } },
    { label: '45', unit: '45m', box: null },
    { label: '1h', unit: '1h', box: null },
    { label: '1,5h', unit: '1,5h', box: null },
];
const SWATCH = { left: 16.01, top: 692.55, w: 360.73, h: 56.0 };
const DISC = { d: 24.74, cy: 718.85, firstCx: 46.0, pitch: 40.0 };
const SUGGESTION_ICONS = { at: AtIcon, tv: TvIcon, people: Person2Icon, run: RunIcon } as const;
const SUGGESTION_KEYS = { at: 'at', tv: 'tv_fill', people: 'person_2_fill', run: 'figure_run' } as const;
const COMMIT_LABEL = {
    continue: { left: 155.02, top: 724.5, w: 82.97 },
    create: { left: 142.28, top: 724.5, w: 108.44 },
    update: { left: 140.1, top: 724.5, w: 112.81 },
} as const;
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
    const fieldTop = step === 1 ? 119.36 : 96.07;
    const tileTop = fieldTop;
    const base = rolled ? 20 * 60 + 15 : 19 * 60 + 45;
    const fmt = (m: number) => {
        const h24 = Math.floor(m / 60) % 24;
        const suffix = h24 < 12 ? 'AM' : 'PM';
        const h = h24 % 12 === 0 ? 12 : h24 % 12;
        return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')} ${suffix}`;
    };
    const wheelStep = duration === 1 ? 5 : 15;
    const wheel = [fmt(base - 2 * wheelStep), fmt(base - wheelStep), fmt(base + wheelStep), fmt(base + 2 * wheelStep)];
    const fmtShort = (m: number) => fmt(m).slice(0, 5);
    const pillLabel = duration === 1 ? fmt(base) : `${fmtShort(base)} - ${fmt(base + duration)}`;
    const selectedIndex = Math.max(0, durationPresets.indexOf(duration));
    const segLefts = [22.2, 80.06, 137.91, 196.14, 254.36, 312.58];
    const segWidths = [57.86, 57.86, 58.22, 58.22, 58.22, 58.22];
    const unitLabel = DURATION_SEGMENTS[selectedIndex].unit;
    const unitBox = DURATION_SEGMENTS[selectedIndex].box ?? { left: segLefts[selectedIndex], w: segWidths[selectedIndex] };
    const pillLeft = unitBox.left + unitBox.w / 2 - PILL_W / 2;
    const discColours = ['#F79970', '#E3A500', '#8CB969', '#5E81A3', '#218161', '#924564', '#2B4E6F', '#080808'];
    return (<View aria-modal accessibilityRole={"dialog" as unknown as AccessibilityRole} style={{ position: 'absolute', left: 0, top: 0, width: 392.73, height: 777.45, backgroundColor: PAGE, zIndex: 40 }}>
      
      <Pressable accessibilityRole="button" onPress={onClose} style={{ position: 'absolute', left: CLOSE_HIT.left, top: CLOSE_HIT.top, width: CLOSE_HIT.size, height: CLOSE_HIT.size }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} style={{ position: 'absolute', left: CLOSE.left - CLOSE_HIT.left, top: CLOSE.top - CLOSE_HIT.top, width: CLOSE.size, height: CLOSE.size }}>
          <XIcon size={24} color={INK}/>
        </Pressable>
      </Pressable>

      
      <TwoToneRun text={heading} from={span.from} to={span.to} color={INK} accent={colors.accent} backing={PAGE} nativeID="etitle" accessibilityLabel={heading} hitPadLeft={16} style={{
            position: 'absolute',
            left: TITLE.left,
            top: TITLE.top,
            height: TITLE.h,
            fontSize: 23,
            fontFamily: fontFamily.header,
            lineHeight: TITLE.h,
            color: INK,
        }}/>

      
      <Pressable accessibilityRole="button" style={{ position: 'absolute', left: 16.01, top: tileTop, width: TILE_W, height: TILE_W, backgroundColor: '#FFFFFF', borderRadius: 14 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="at" style={{ position: 'absolute', left: (TILE_W - 24.02) / 2, top: (TILE_W - 24.02) / 2, width: 24.02, height: 24.02 }}>
          <AtIcon width={24} height={24} color={colors.accent}/>
        </Pressable>
      </Pressable>
      {title ? (<View style={{ position: 'absolute', left: 80.06, top: fieldTop, width: FIELD_W, height: TILE_W }}>
          <TextInput value={title} onChangeText={onTitle} accessibilityLabel={title} style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: FIELD_W,
                height: TILE_W,
                fontSize: 18.7,
                fontFamily: fontFamily.title,
                color: INK,
                padding: 0,
            }}/>
        </View>) : (<>
          
          <View pointerEvents="none" style={{ position: 'absolute', left: 82.06, top: fieldTop + 14.1, width: 1.82, height: 19.5, backgroundColor: colors.accent }}/>
          <Text style={{
                position: 'absolute',
                left: 84.1,
                top: fieldTop + 12.37,
                width: 134.6,
                height: 23.29,
                fontSize: 19.17,
                fontFamily: fontFamily.title,
                lineHeight: 23.29,
                color: colors.accent,
            }}>
            {titlePlaceholder}
          </Text>
        </>)}
      
      <View pointerEvents="none" style={{ position: 'absolute', left: 80.06, top: tileTop + TILE_W - 9.0, width: FIELD_W, height: 0.8, backgroundColor: colors.accent }}/>

      {step === 1 ? (<>
          <Text style={{
                position: 'absolute', left: 16.01, top: 80.06, width: 360.98, height: 23.29,
                fontSize: 20.3, fontFamily: fontFamily.header, lineHeight: 23.29, color: GREY,
            }}>
            What?
          </Text>
          {suggestions.map((s, i) => {
                const Icon = SUGGESTION_ICONS[s.icon];
                const top = CARD.firstTop + i * CARD.pitch;
                return (<Pressable key={s.title} accessibilityRole="button" accessibilityLabel={s.title} onPress={() => onPickSuggestion(s.title)} style={{ position: 'absolute', left: CARD.left, top, width: CARD.w, height: CARD.h, backgroundColor: '#FFFFFF', borderRadius: 16 }}>
                <Pressable accessibilityRole="button" accessibilityLabel={SUGGESTION_KEYS[s.icon]} onPress={() => onPickSuggestion(s.title)} style={{ position: 'absolute', left: 32.02 - CARD.left, top: 16.73, width: 24.02, height: 24.02 }}>
                  <Icon size={24} color={colors.accent}/>
                </Pressable>
                <Text style={{
                        position: 'absolute', left: 72.05 - CARD.left, top: 8.0, width: 172.85, height: 16.38,
                        fontSize: 13.48, fontFamily: fontFamily.number, lineHeight: 16.38, letterSpacing: 0.08, color: SOFT,
                    }}>
                  {s.range}
                </Text>
                <Text style={{
                        position: 'absolute', left: 72.05 - CARD.left, top: 28.38, width: 200, height: 21.11,
                        fontSize: 17.37, fontFamily: fontFamily.title, lineHeight: 21.11, color: INK,
                    }}>
                  {s.title}
                </Text>
              </Pressable>);
            })}
          <CommitButton label="Continue" labelBox={COMMIT_LABEL.continue} onPress={onCommit}/>
        </>) : (<>
          
          <Text style={{
                position: 'absolute', left: 16.01, top: 176.12, width: 306.39, height: 23.29,
                fontSize: 20.3, fontFamily: fontFamily.header, lineHeight: 23.29, color: GREY,
            }}>
            When?
          </Text>
          <Text style={{
                position: 'absolute', left: 322.41, top: 163.75, width: 54.58, height: 48.03,
                letterSpacing: -0.96,
                fontSize: 19.17, fontFamily: fontFamily.title, lineHeight: 48.03, color: colors.accent,
            }}>
            More...
          </Text>
          
          {[
                { y: 208.51, c: FADED },
                { y: 248.54, c: WHEEL },
                { y: 328.59, c: WHEEL },
                { y: 368.62, c: FADED },
            ].map((t, i) => (<Text key={t.y} style={{
                    position: 'absolute', left: 160.47, top: t.y, width: 73.14, height: 22.2,
                    fontSize: 16.8, fontFamily: fontFamily.number, lineHeight: 22.2, color: t.c, textAlign: 'center',
                }}>
              {wheel[i]}
            </Text>))}
          <View pointerEvents="none" style={{ position: 'absolute', left: 66.59, top: 274.37, width: 259.82, height: 45.12, borderRadius: 8, backgroundColor: colors.accent }}/>
          <Text style={{
                position: 'absolute', left: 124.09, top: 288.93, width: 145.56, height: 21.11,
                fontSize: 18.7, fontFamily: fontFamily.title, lineHeight: 21.11, color: '#FFFFFF', textAlign: 'center',
            }}>
            {pillLabel}
          </Text>
          <Pressable accessibilityRole="button" style={{ position: 'absolute', left: 173.21, top: 394.09, width: 68.77, height: 48.03 }}>
            <View pointerEvents="none" style={{ position: 'absolute', left: -22.2, top: 16.0, width: 17, height: 17 }}>
              <CalendarSmallIcon size={17} color={colors.accent}/>
            </View>
            <Text style={{
                position: 'absolute', left: 0, top: 0, width: 68.77, height: 48.03,
                fontSize: 18.4, fontFamily: fontFamily.title, lineHeight: 48.03, color: colors.accent,
            }}>
              9/28/26
            </Text>
          </Pressable>

          
          <Text style={{
                position: 'absolute', left: 16.01, top: 481.06, width: 282.38, height: 23.29,
                fontSize: 20.3, fontFamily: fontFamily.header, lineHeight: 23.29, color: GREY,
            }}>
            How long?
          </Text>
          <Text style={{
                position: 'absolute', left: 310.4, top: 482.88, width: 54.58, height: 19.65,
                letterSpacing: -0.08,
                fontSize: 17.2, fontFamily: fontFamily.more, lineHeight: 19.65, color: colors.accent,
            }}>
            More...
          </Text>
          
          <View pointerEvents="none" style={{ position: 'absolute', left: TRAY.left, top: TRAY.top, width: TRAY.w, height: TRAY.h, borderRadius: 16, backgroundColor: '#FFFFFF' }}/>
          <View pointerEvents="none" style={{
                position: 'absolute', left: WASH.left, top: WASH.top, width: pillLeft - WASH.left, height: WASH.h,
                backgroundColor: colors.accentWash, borderBottomLeftRadius: 12, borderTopLeftRadius: 12,
            }}/>
          
          <View pointerEvents="none" style={{
                position: 'absolute', left: pillLeft, top: WASH.top, width: PILL_W, height: WASH.h,
                borderRadius: 8, backgroundColor: colors.accent, transform: [{ translateX: -0.4 }],
            }}/>
          {DURATION_SEGMENTS.map(({ label }, i) => {
                const selected = i === selectedIndex;
                return (<React.Fragment key={label}>
                
                <Pressable accessible={false} onPress={() => onDuration?.(durationPresets[i])} style={({ pressed }) => ({
                        position: 'absolute',
                        left: segLefts[i],
                        top: SEG_TOP,
                        width: segWidths[i],
                        height: SEG_H,
                        borderRadius: 8,
                        backgroundColor: pressed ? colors.accentWash : 'transparent',
                    })}/>
                {selected ? (<Text pointerEvents="none" style={{
                            position: 'absolute', left: segLefts[i], top: SEG_TOP, width: segWidths[i], height: SEG_H,
                            fontSize: 14.0, fontFamily: fontFamily.chip, lineHeight: SEG_H, color: 'transparent', textAlign: 'center',
                        }}>
                    {label}
                    <Text style={{
                            position: 'absolute', left: unitBox.left - segLefts[i], top: 0, width: unitBox.w, height: SEG_H,
                            fontSize: 15.5, fontFamily: fontFamily.now, lineHeight: SEG_H, color: '#FFFFFF', textAlign: 'center',
                        }}>
                      {unitLabel}
                    </Text>
                  </Text>) : (<Text pointerEvents="none" style={{
                            position: 'absolute', left: segLefts[i], top: SEG_TOP, width: segWidths[i], height: SEG_H,
                            fontSize: 14.0, fontFamily: fontFamily.chip, lineHeight: SEG_H, color: colors.accent, textAlign: 'center',
                        }}>
                    {label}
                  </Text>)}
              </React.Fragment>);
            })}

          
          <Text style={{
                position: 'absolute', left: 16.01, top: 641.17, width: 282.38, height: 23.29,
                fontSize: 20.3, fontFamily: fontFamily.header, lineHeight: 23.29, color: GREY,
            }}>
            What color?
          </Text>
          <Text style={{
                position: 'absolute', left: 310.4, top: 642.99, width: 54.58, height: 19.65,
                letterSpacing: -0.08,
                fontSize: 17.2, fontFamily: fontFamily.more, lineHeight: 19.65, color: colors.accent,
            }}>
            More...
          </Text>
          <View pointerEvents="none" style={{ position: 'absolute', left: SWATCH.left, top: SWATCH.top, width: SWATCH.w, height: SWATCH.h, borderRadius: 16, backgroundColor: '#FFFFFF' }}/>
          
          <View pointerEvents="none" style={{
                position: 'absolute',
                left: DISC.firstCx - DISC.d / 2,
                top: DISC.cy - DISC.d / 2,
                width: DISC.d,
                height: DISC.d,
                borderRadius: DISC.d / 2,
                backgroundColor: '#FFFFFF',
                borderWidth: 2.5,
                borderColor: colors.accent,
            }}/>
          {discColours.map((c, i) => (<View key={c} pointerEvents="none" style={{
                    position: 'absolute',
                    left: DISC.firstCx + (i + 1) * DISC.pitch - DISC.d / 2,
                    top: DISC.cy - DISC.d / 2,
                    width: DISC.d,
                    height: DISC.d,
                    borderRadius: DISC.d / 2,
                    backgroundColor: c,
                }}/>))}
          
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (<Pressable key={i} accessibilityRole="button" style={{ position: 'absolute', left: 22.2 + i * 40.03, top: 697.21, width: 40.03, height: 13.1 }}/>))}
          <Pressable accessibilityRole="button" style={{ position: 'absolute', left: 342.42, top: 697.21, width: 48.03, height: 48.03 }}/>
          <CommitButton label={editing ? 'Update Task' : 'Create Task'} labelBox={editing ? COMMIT_LABEL.update : COMMIT_LABEL.create} onPress={onCommit}/>
        </>)}
    </View>);
};
const CommitButton: React.FC<{
    label: string;
    labelBox: {
        left: number;
        top: number;
        w: number;
    };
    onPress: () => void;
}> = ({ label, labelBox, onPress, }) => (<Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ position: 'absolute', left: BUTTON.left, top: BUTTON.top, width: BUTTON.w, height: BUTTON.h, borderRadius: 16, backgroundColor: colors.accent }}>
    <Text style={{
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
    }}>
      {label}
    </Text>
  </Pressable>);
