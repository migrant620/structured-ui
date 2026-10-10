import * as React from 'react';
import { AccessibilityRole, Pressable, Text, View } from 'react-native';
import { AtIcon, CheckCircleFillIcon, DuplicateIcon, IncompleteIcon, PencilIcon, StarIcon, TrashIcon, } from '../icons';
import { colors, fontFamily, frame, type } from '../theme/tokens';
export const SCRIM = 'rgba(0, 0, 0, 0.322)';
export const SCRIM_DIALOG = 'rgba(0, 0, 0, 0.6)';
const SHEET_TOP = 484.34;
const ActionCard: React.FC<{
    label: string;
    icon: React.ReactNode;
    left: number;
    iconLeft: number;
    labelLeft: number;
    labelW: number;
    onPress?: () => void;
}> = ({ label, icon, left, iconLeft, labelLeft, labelW, onPress }) => (<Pressable accessibilityRole="button" onPress={onPress} style={{ position: 'absolute', left, top: 626.91 - SHEET_TOP, width: 110, height: 59, borderRadius: 14, backgroundColor: colors.sheet }}>
    <View accessibilityRole="button" accessibilityLabel={label} style={{ position: 'absolute', left: iconLeft, top: 155.38 - (626.91 - SHEET_TOP), width: 18.19, height: 18.19, alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </View>
    <Text style={{
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
    }}>
      {label}
    </Text>
  </Pressable>);
export const DetailSheet: React.FC<{
    title: string;
    range: string;
    done: boolean;
    onToggleDone?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
    onClose?: () => void;
}> = ({ title, range, done, onToggleDone, onDelete, onEdit, onClose }) => (<View aria-modal accessibilityRole={"dialog" as unknown as AccessibilityRole} style={{ position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, zIndex: 40 }}>
    
    <Pressable accessibilityRole="button" onPress={onClose} style={{ position: 'absolute', left: 0, top: -49.45, width: 393, height: 826.9, backgroundColor: SCRIM }}/>
    
    <Pressable accessibilityRole="button" accessibilityLabel="Close sheet" onPress={onClose} style={{ position: 'absolute', left: 0, top: -49.45, width: 393, height: 533.78 }}/>
    
    <View style={{ position: 'absolute', left: 0, top: SHEET_TOP, width: frame.width, height: frame.height - SHEET_TOP, backgroundColor: colors.page, borderTopLeftRadius: 22, borderTopRightRadius: 22 }}>
      
      <View accessibilityRole="button" style={{ position: 'absolute', left: 172.48, top: 0, width: 48.03, height: 48.4, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 32.02, height: 4, borderRadius: 2, backgroundColor: colors.accent }}/>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Drag handle" onPress={onClose} style={{ position: 'absolute', left: 180.49, top: 22.16, width: 32.02, height: 4 }}/>
      
      <View accessibilityRole="button" accessibilityLabel="at" style={{ position: 'absolute', left: 16.01, top: 71.32, width: 28.02, height: 28.02, alignItems: 'center', justifyContent: 'center' }}>
        <AtIcon width={23} height={23} color={colors.accent}/>
      </View>
      <Text style={{ position: 'absolute', left: 60.04, top: 65.47, width: 206.32, height: 16.38, fontFamily: fontFamily.sub, fontSize: 13.8, letterSpacing: 0.08, lineHeight: 16.38, color: '#85858A' }}>
        {range}
      </Text>
      <Text style={{
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
    }}>
        {title}
      </Text>
      
      <View style={{ position: 'absolute', left: 16.01, top: 115, width: 360.73, height: 1, backgroundColor: colors.surfaceMuted }}/>
      
      <ActionCard label="Delete" icon={<TrashIcon size={18.19} color={colors.accent}/>} left={16.01} iconLeft={45.85} labelLeft={4.0} labelW={101.9} onPress={onDelete}/>
      <ActionCard label="Duplicate" icon={<DuplicateIcon size={18.19} color={colors.accent}/>} left={141.37} iconLeft={46.4} labelLeft={4.55} labelW={101.5}/>
      <ActionCard label={done ? 'Incomplete' : 'Complete'} icon={done ? <IncompleteIcon size={18.19} color={colors.accent}/> : <CheckCircleFillIcon size={18.19} color={colors.accent}/>} left={266.73} iconLeft={46.58} labelLeft={4.73} labelW={101.5} onPress={onToggleDone}/>
      
      <Pressable accessibilityRole="button" onPress={onEdit} style={{ position: 'absolute', left: 16.01, top: 713.45 - SHEET_TOP, width: 360.73, height: 58, borderRadius: 16, backgroundColor: colors.sheet }}>
        <View accessibilityRole="button" accessibilityLabel="Edit Task" style={{ position: 'absolute', left: 139.73 - 16.01, top: 727.05 - 713.45, width: 18.19, height: 18.19, alignItems: 'center', justifyContent: 'center' }}>
          <PencilIcon size={18.19} color={colors.accent}/>
        </View>
        <Text style={{ position: 'absolute', left: 164.11 - 16.01, top: 724.5 - 713.45, height: 23.29, ...type.rowTitle, fontSize: 20.25, lineHeight: 23.29, color: colors.accent }}>
          Edit Task
        </Text>
      </Pressable>
    </View>
  </View>);
export const DeleteDialog: React.FC<{
    onCancel?: () => void;
    onDelete?: () => void;
}> = ({ onCancel, onDelete }) => (<View aria-modal accessibilityRole={"dialog" as unknown as AccessibilityRole} style={{ position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, zIndex: 40 }}>
    <Pressable accessibilityRole="button" accessibilityLabel="Close dialog" onPress={onCancel} style={{ position: 'absolute', left: 0, top: -49.45, width: 393, height: 826.9, backgroundColor: SCRIM_DIALOG }}>
    <View style={{
        position: 'absolute',
        left: 43.4,
        top: 353.65,
        width: 305.9,
        height: 168.5,
        borderRadius: 24,
        backgroundColor: colors.sheet,
    }}>
      
      <Text style={{ position: 'absolute', left: 21.01, top: 23.28, height: 25.84, fontFamily: fontFamily.number, fontSize: 21.6, lineHeight: 25.84, color: colors.ink }}>
        Delete Task
      </Text>
      <Text style={{ position: 'absolute', left: 21.01, top: 82.31, width: 263.82, height: 16.38, fontFamily: fontFamily.sub, fontSize: 13.8, letterSpacing: 0.08, lineHeight: 16.38, color: '#85858A' }}>
        This task will be deleted and cannot be undone.
      </Text>
      <Pressable accessibilityRole="button" onPress={onCancel} style={{ position: 'absolute', left: 148.1, top: 121.0, width: 96.71, height: 27.4 }}>
        <Text style={{ position: 'absolute', left: 5.0, top: 8.6, height: 16.38, fontFamily: fontFamily.title, fontSize: 14.5, letterSpacing: 0.08, lineHeight: 16.38, color: colors.inkSecondary }}>Cancel</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Delete" onPress={onDelete} style={{ position: 'absolute', left: 223.4, top: 121.0, width: 70, height: 27.4 }}>
        <Text style={{ position: 'absolute', left: 5.0, top: 8.6, height: 16.38, fontFamily: fontFamily.title, fontSize: 14.5, letterSpacing: 0.08, lineHeight: 16.38, color: '#B3261E' }}>Delete</Text>
      </Pressable>
    </View>
    </Pressable>
  </View>);
export const ProChip: React.FC<{
    x: number;
    y: number;
}> = ({ x, y }) => (<View style={{
        position: 'absolute',
        left: x - 5.84,
        top: y - 2.18,
        width: 59.3,
        height: 19.6,
        borderRadius: 9.8,
        backgroundColor: colors.accent,
    }}>
    <View accessibilityRole="button" accessibilityLabel="PRO" style={{ position: 'absolute', left: 5.84, top: 2.18, width: 16.01, height: 16.01, alignItems: 'center', justifyContent: 'center' }}>
      <StarIcon size={14} color="#FFFFFF"/>
    </View>
    <Text style={{ position: 'absolute', left: 25.9, top: 0.63, width: 29.5, fontFamily: fontFamily.chip, fontSize: 14.5, letterSpacing: 0.08, lineHeight: 16.38, color: '#FFFFFF' }}>
      PRO
    </Text>
  </View>);
