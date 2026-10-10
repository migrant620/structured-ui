import * as React from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { BottomNav, Header, NavKey, WeekDay, WeekStrip } from './components/Chrome';
import { TimelineScreen } from './screens/TimelineScreen';
import { EditorSheet } from './screens/EditorSheet';
import { DetailSheet, DeleteDialog } from './screens/DetailSheet';
import { InboxScreen } from './screens/InboxScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { colors, frame, space } from './theme/tokens';
import { formatRange, initialTasks, planningHint, s2Tasks, s7Tasks, s10Tasks, Task } from './store';
const weekDays: WeekDay[] = [
    { label: 'Mon', number: '28', marks: ['alarm', 'checklist', 'plus', 'plain'] },
    { label: 'Tue', number: '29', marks: ['alarm', 'moon'] },
    { label: 'Wed', number: '30', marks: ['alarm', 'moon'] },
    { label: 'Thu', number: '1', marks: ['alarm', 'moon'] },
    { label: 'Fri', number: '2', marks: ['alarm', 'moon'] },
    { label: 'Sat', number: '3', marks: ['alarm', 'moon'] },
    { label: 'Sun', number: '4', marks: ['alarm', 'moon'] },
];
const weekDaysS2: WeekDay[] = [
    { label: 'Sun', number: '27', marks: ['alarm', 'moon'] },
    { label: 'Mon', number: '28', marks: ['alarm', 'checklist', 'plus', 'plain'] },
    { label: 'Tue', number: '29', marks: ['alarm', 'moon'] },
    { label: 'Wed', number: '30', marks: ['alarm', 'moon'] },
    { label: 'Thu', number: '1', marks: ['alarm', 'moon'] },
    { label: 'Fri', number: '2', marks: ['alarm', 'moon'] },
    { label: 'Sat', number: '3', marks: ['alarm', 'moon'] },
    { label: 'Sun', number: '4', marks: ['alarm', 'moon'] },
];
export type Scenario = 'S1' | 'S2' | 'S3' | 'S3b' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8' | 'S9' | 'S10' | 'S11' | 'S12';
const readScenario = (): Scenario => {
    if (typeof window === 'undefined')
        return 'S1';
    const p = new URLSearchParams(window.location.search).get('p');
    const all: Scenario[] = ['S1', 'S2', 'S3', 'S3b', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'];
    return all.includes(p as Scenario) ? (p as Scenario) : 'S1';
};
const TIMELINE_SCENARIOS: Scenario[] = ['S1', 'S2', 'S6', 'S7', 'S10'];
const SHEET_SCENARIOS: Scenario[] = ['S1', 'S2', 'S6', 'S7', 'S10'];
export default function App() {
    const [fontsLoaded] = useFonts({
        RobotoText: require('../assets/fonts/RobotoText.ttf'),
        RobotoGutter: require('../assets/fonts/RobotoGutter.ttf'),
        RobotoNow: require('../assets/fonts/RobotoNow.ttf'),
        RobotoNote: require('../assets/fonts/RobotoNote.ttf'),
        RobotoNumber: require('../assets/fonts/RobotoNumber.ttf'),
        RobotoTitle: require('../assets/fonts/RobotoTitle.ttf'),
        RobotoHeader: require('../assets/fonts/RobotoHeader.ttf'),
        RobotoSub: require('../assets/fonts/RobotoSub.ttf'),
        RobotoAction: require('../assets/fonts/RobotoAction.ttf'),
        RobotoSetting: require('../assets/fonts/RobotoSetting.ttf'),
        RobotoChip: require('../assets/fonts/RobotoChip.ttf'),
        RobotoMore: require('../assets/fonts/RobotoMore.ttf'),
    });
    const [scenario] = React.useState<Scenario>(readScenario);
    const seed: Task[] = scenario === 'S2' ? s2Tasks
        : scenario === 'S6' ? s2Tasks
            : scenario === 'S7' ? s7Tasks
                : scenario === 'S10' ? s10Tasks
                    : initialTasks;
    const [tasks, setTasks] = React.useState<Task[]>(seed);
    const [tab, setTab] = React.useState<NavKey>(scenario === 'S11' ? 'inbox' : scenario === 'S12' ? 'settings' : 'timeline');
    const [selectedDay, setSelectedDay] = React.useState(scenario === 'S2' || scenario === 'S6' || scenario === 'S7' ? 1 : 0);
    const [editor, setEditor] = React.useState<null | {
        mode: 'new';
        step: 1 | 2;
        title: string;
        duration: number;
        rolled?: boolean;
    } | {
        mode: 'edit';
        step: 2;
        title: string;
        duration: number;
        rolled?: boolean;
    }>(() => {
        switch (scenario) {
            case 'S3': return { mode: 'new', step: 1, title: '', duration: 15 };
            case 'S3b': return { mode: 'new', step: 1, title: 'Weekly review', duration: 15 };
            case 'S4': return { mode: 'new', step: 2, title: 'Weekly review', duration: 15 };
            case 'S5': return { mode: 'new', step: 2, title: 'Weekly review', duration: 30 };
            case 'S8': return { mode: 'edit', step: 2, title: 'Weekly review', duration: 30 };
            case 'S9': return { mode: 'edit', step: 2, title: 'Weekly review', duration: 30, rolled: true };
            default: return null;
        }
    });
    const [openId, setOpenId] = React.useState<string | null>(scenario === 'S6' || scenario === 'S7' ? 'teamSync' : null);
    const [confirmId, setConfirmId] = React.useState<string | null>(scenario === 'S10' ? 'grocery' : null);
    const openTask = React.useCallback((id: string) => setOpenId(id), []);
    const toggleDone = React.useCallback((id: string) => {
        setTasks((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    }, []);
    const deleteTask = React.useCallback((id: string | null) => {
        if (!id)
            return;
        setTasks((s) => s.filter((t) => t.id !== id));
        setOpenId(null);
        setConfirmId(null);
    }, []);
    const commitTask = React.useCallback((title: string, duration: number) => {
        const start = 19 * 60 + 45;
        const range = formatRange(start, duration);
        const task: Task = {
            id: `user-${Date.now()}`,
            title,
            sub: range,
            start,
            duration,
            icon: 'at',
            scheduled: true,
            done: false,
            recurring: false,
            hasNotes: false,
            note: '',
            rangeLabel: range,
            noteAccent: [86.8, 105.5],
        };
        setTasks((s) => [...s, task]);
        setEditor(null);
    }, []);
    const applyEdit = React.useCallback((id: string, title: string, duration: number) => {
        setTasks((s) => s.map((t) => {
            if (t.id !== id)
                return t;
            const start = t.start ?? 19 * 60 + 45;
            const range = formatRange(start, duration);
            return { ...t, title: title || t.title, duration, sub: range, rangeLabel: range };
        }));
    }, []);
    const onFab = React.useCallback(() => {
        if (editor === null)
            setEditor({ mode: 'new', step: 1, title: '', duration: 15 });
    }, [editor]);
    if (!fontsLoaded) {
        return <View style={{ width: frame.width, height: frame.height, backgroundColor: colors.page }}/>;
    }
    const chromeless = tab === 'inbox' || tab === 'settings';
    const timelineScenario = scenario === 'S10' ? 'S10' : scenario === 'S7' ? 'S7' : scenario === 'S6' ? 'S6' : scenario === 'S2' ? 'S2' : 'S1';
    const openTaskObj = tasks.find((t) => t.id === openId) ?? null;
    return (<View style={{ width: frame.width, height: frame.height, backgroundColor: colors.page, overflow: 'hidden' }}>
      {!chromeless && <Header month="September" year="2026"/>}
      {!chromeless && (<WeekStrip days={selectedDay === 1 ? weekDaysS2 : weekDays} selected={selectedDay} s2={selectedDay === 1}/>)}
      {SHEET_SCENARIOS.includes(scenario) && !chromeless ? (<View pointerEvents="none" style={{
                position: 'absolute',
                left: 0,
                top: space.sheet.top,
                width: frame.width,
                height: space.navBar.top - space.sheet.top,
                backgroundColor: colors.sheet,
                borderTopLeftRadius: space.sheet.radius,
                borderTopRightRadius: space.sheet.radius,
            }}/>) : null}
      <View style={{ flex: 1, pointerEvents: 'box-none' }}>
        {tab === 'timeline' ? (<TimelineScreen tasks={tasks} hint={scenario === 'S2' || scenario === 'S6' ? '' : scenario === 'S1' ? planningHint : ''} onOpen={openTask} onAdd={onFab} scenario={timelineScenario}/>) : null}
        {tab === 'inbox' ? <InboxScreen onNew={onFab}/> : null}
        {tab === 'settings' ? <SettingsScreen /> : null}
      </View>
      
      <View pointerEvents="none" style={{
            position: 'absolute',
            left: 0,
            top: space.navBar.top,
            width: frame.width,
            height: space.navBar.height,
            backgroundColor: colors.navBar,
            zIndex: 25,
        }}/>
      <BottomNav active={tab} onSelect={setTab}/>

      
      {openTaskObj && !editor ? (<DetailSheet title={openTaskObj.title} range={`9/28/26, ${openTaskObj.rangeLabel ?? openTaskObj.sub}`} done={openTaskObj.done} onToggleDone={() => toggleDone(openTaskObj.id)} onDelete={() => {
                setConfirmId(openTaskObj.id);
                setOpenId(null);
            }} onEdit={() => setEditor({ mode: 'edit', step: 2, title: openTaskObj.title, duration: openTaskObj.duration })} onClose={() => setOpenId(null)}/>) : null}
      {confirmId ? (<DeleteDialog onCancel={() => setConfirmId(null)} onDelete={() => deleteTask(confirmId)}/>) : null}

      
      {editor ? (<EditorSheet mode={editor.mode} step={editor.step} title={editor.title} duration={editor.duration} rolled={editor.rolled} onTitle={(v) => setEditor((e) => (e ? { ...e, title: v } : e))} onPickSuggestion={(title: string) => setEditor((e) => (e ? { ...e, title, step: 2 } : e))} onDuration={(minutes: number) => setEditor((e) => (e ? { ...e, duration: minutes } : e))} onCommit={() => {
                if (editor.step === 1)
                    setEditor({ ...editor, step: 2 });
                else if (editor.mode === 'edit') {
                    if (openId)
                        applyEdit(openId, editor.title, editor.duration);
                    setOpenId(null);
                    setEditor(null);
                }
                else
                    commitTask(editor.title || 'Reply to Mail', editor.duration);
            }} onClose={() => setEditor(null)}/>) : null}
    </View>);
}
