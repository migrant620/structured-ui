import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { AlarmIcon, CalendarsIcon, ChecklistIcon, GearIcon, NavAiIcon, NavInboxIcon, NavSettingsIcon, NavTimelineIcon, PlusCircleIcon, } from '../icons';
import { TwoToneRun } from './TwoToneRun';
import { colors, fontFamily, frame, space, type } from '../theme/tokens';
const MoonIcon: React.FC<{
    size?: number;
    color?: string;
}> = ({ size = 8, color = '#fff' }) => (<Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M20 15.4A9.2 9.2 0 0 1 8.6 4 9.6 9.6 0 1 0 20 15.4z" fill={color}/>
  </Svg>);
export const Header: React.FC<{
    month: string;
    year: string;
    onCalendars?: () => void;
}> = ({ month, year, onCalendars, }) => (<View style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 60, zIndex: 25 }}>
    
    <TwoToneRun text={`${month} ${year}`} from={space.header.titleAccentFrom} to={space.header.titleAccentTo} color={colors.ink} accent={colors.accent} backing={colors.page} nativeID="hrun" style={{
        position: 'absolute',
        left: space.header.titleLeft,
        top: space.header.titleTop,
        ...type.header,
        color: colors.ink,
    }}/>
    <Pressable accessibilityRole="button" onPress={onCalendars} style={{
        position: 'absolute',
        left: space.header.calendarsLeft,
        top: space.header.calendarsTop,
        width: space.header.button,
        height: space.header.button,
        alignItems: 'center',
        justifyContent: 'center',
    }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Calendars" onPress={onCalendars} style={{ width: 24, height: 24 }}>
        <CalendarsIcon size={24} color={colors.accent}/>
      </Pressable>
    </Pressable>
  </View>);
export type DayMark = 'alarm' | 'checklist' | 'plus' | 'moon' | 'plain';
export type WeekDay = {
    label: string;
    number: string;
    marks: DayMark[];
};
const Mark: React.FC<{
    mark: DayMark;
    left: number;
}> = ({ mark, left }) => {
    const n = space.week.badge;
    const d = space.week.badgeDisc;
    const off = (n - d) / 2;
    const g = space.week.glyph;
    const bg = mark === 'moon' ? '#6185A8' : colors.accent;
    const label = mark === 'alarm' ? 'alarm_fill' : mark === 'checklist' ? 'checklist' : mark === 'plus' ? 'plus_circle_fill' : mark === 'moon' ? 'moon_fill' : undefined;
    const body = (<>
      {mark !== 'plain' ? (<View style={{ position: 'absolute', left: off, top: off, width: d, height: d, borderRadius: d / 2, backgroundColor: bg }}/>) : null}
      <View style={{ position: 'absolute', left: off, top: off, width: d, height: d, alignItems: 'center', justifyContent: 'center' }}>
        
        {mark === 'alarm' ? <AlarmIcon size={10.07} color="#fff" bg={bg}/> : null}
        {mark === 'checklist' ? <ChecklistIcon size={g * 1.03} color="#fff"/> : null}
        {mark === 'plus' ? <PlusCircleIcon size={6.55} color="#fff" bg={bg}/> : null}
        {mark === 'moon' ? <MoonIcon size={g * 1.35} color="#fff"/> : null}
      </View>
    </>);
    if (!label) {
        return <View style={{ position: 'absolute', left, top: space.week.badgeTop, width: n, height: n }}>{body}</View>;
    }
    return (<Pressable accessibilityRole="button" accessibilityLabel={label} style={{ position: 'absolute', left, top: space.week.badgeTop, width: n, height: n }}>
      {body}
    </Pressable>);
};
export const WeekStrip: React.FC<{
    days: WeekDay[];
    selected: number;
    s2?: boolean;
    lefts?: number[];
}> = ({ days, selected, s2 = false, lefts }) => (<View style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 136, zIndex: 20 }}>
    {days.map((day, i) => {
        const left = lefts ? lefts[i] : s2 && i === 0 ? 0 : space.week.firstColumnLeft + i * space.week.columnPitch;
        const isSel = i === selected;
        const marks = day.marks;
        const pitch = 12;
        const firstMarkLeft = left + space.week.columnPitch / 2 - (marks.length * 8 + (marks.length - 1) * (pitch - 8)) / 2;
        return (<View key={day.label + i}>
          <Text style={{
                position: 'absolute',
                left,
                top: space.week.labelTop,
                width: space.week.columnPitch,
                textAlign: 'center',
                ...type.dayLabel,
                color: colors.inkSecondary,
            }}>
            {day.label}
          </Text>
          {isSel ? (<View style={{
                    position: 'absolute',
                    left: left + space.week.columnPitch / 2 - 14,
                    top: space.week.numberTop + space.week.numberBox / 2 - 14,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.accent,
                }}/>) : null}
          
          {left + space.week.columnPitch / 2 < frame.width ? (<Text style={{
                    position: 'absolute',
                    left,
                    top: space.week.numberTop,
                    width: space.week.columnPitch,
                    textAlign: 'center',
                    ...type.dayNumber,
                    color: isSel ? '#FFFFFF' : colors.ink,
                }}>
              {day.number}
            </Text>) : null}
          {marks.map((m, mi) => (<Mark key={mi} mark={m} left={firstMarkLeft + mi * pitch}/>))}
        </View>);
    })}
  </View>);
export type NavKey = 'inbox' | 'timeline' | 'ai' | 'settings';
const NAV = [
    { key: 'inbox' as const, label: 'Inbox', cx: 49.09 },
    { key: 'timeline' as const, label: 'Timeline', cx: 147.27 },
    { key: 'ai' as const, label: 'AI', cx: 245.45 },
    { key: 'settings' as const, label: 'Settings', cx: 343.64 },
];
export const BottomNav: React.FC<{
    active: NavKey;
    onSelect: (k: NavKey) => void;
}> = ({ active, onSelect }) => (<View style={{ position: 'absolute', left: 0, right: 0, top: space.nav.iconTop, height: 64, zIndex: 30 }}>
    
    <View style={{
        position: 'absolute',
        left: NAV.find((n) => n.key === active)!.cx - space.nav.pill.w / 2,
        top: space.nav.pill.top - space.nav.iconTop,
        width: space.nav.pill.w,
        height: space.nav.pill.h,
        borderRadius: space.nav.pill.h / 2,
        backgroundColor: colors.navPill,
    }}/>
    {NAV.map((item) => {
        const on = item.key === active;
        const c = on ? colors.accent : colors.navInk;
        const glyph = (() => {
            switch (item.key) {
                case 'inbox':
                    return <NavInboxIcon size={24} color={c}/>;
                case 'timeline':
                    return <NavTimelineIcon size={24} color={c}/>;
                case 'ai':
                    return <NavAiIcon size={24} color={c}/>;
                case 'settings':
                    return <NavSettingsIcon size={24} color={c} bg={colors.navBar}/>;
            }
        })();
        return (<Pressable key={item.key} accessibilityRole="button" accessibilityLabel={item.label} onPress={() => onSelect(item.key)} style={{ position: 'absolute', left: item.cx - 12, top: 0, width: 24, height: 24 }}>
          {glyph}
        </Pressable>);
    })}
    {NAV.map((item) => {
        const on = item.key === active;
        return (<Text key={item.key} style={{
                position: 'absolute',
                left: item.cx - 60,
                top: space.nav.labelTop - space.nav.iconTop,
                width: 120,
                textAlign: 'center',
                ...type.navLabel,
                color: on ? colors.accent : colors.navInk,
            }}>
          {item.label}
        </Text>);
    })}
  </View>);
export const unusedGear = GearIcon;
