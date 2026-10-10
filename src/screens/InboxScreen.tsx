import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { InboxFillIcon, PlusIcon } from '../icons';
import { colors, fontFamily, frame, type } from '../theme/tokens';
export const InboxScreen: React.FC<{
    onNew?: () => void;
}> = ({ onNew }) => (<View style={{ position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, backgroundColor: colors.page }}>
    <Text style={{ position: 'absolute', left: 16.01, top: 17.83, width: 180, ...type.header, color: colors.ink }}>
      Inbox
    </Text>

    
    <View accessibilityRole="button" accessibilityLabel="Inbox" style={{ position: 'absolute', left: 172.48, top: 285.29, width: 48.03, height: 48.03, alignItems: 'center', justifyContent: 'center' }}>
      <InboxFillIcon size={44} color={colors.accent}/>
    </View>
    
    <View accessibilityRole="button" accessibilityLabel="Everything Worth Keeping" style={{ position: 'absolute', left: 16.01, top: 357.3, width: 360.98, height: 18.9 }}>
      <Text style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 360.98,
        textAlign: 'center',
        ...type.rowTitle,
        color: colors.ink,
    }}>
        Everything Worth Keeping
      </Text>
    </View>
    <Text style={{
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
    }}>
      {`Drop tasks and ideas here as they come. Move them to your timeline when you want to schedule them.`}
    </Text>
    
    <Pressable accessibilityRole="button" onPress={onNew} style={{ position: 'absolute', left: 16.01, top: 447.63, width: 360.73, height: 43.64, borderRadius: 12, backgroundColor: '#F3D9D9' }}>
      <View accessibilityRole="button" accessibilityLabel="New Inbox Task" style={{ position: 'absolute', left: 98.61, top: 11.23, width: 20.01, height: 20.01 }}>
        <PlusIcon size={20.01} color={colors.accent}/>
      </View>
      <Text style={{
        position: 'absolute',
        left: 126.63,
        top: 10.51,
        width: 136,
        fontSize: 18.1,
        lineHeight: 21.11,
        fontFamily: fontFamily.title,
        letterSpacing: 0.08,
        color: colors.accent,
    }}>
        New Inbox Task
      </Text>
    </Pressable>

    
    <Pressable accessibilityRole="button" onPress={onNew} style={{
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
    }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Add Task" onPress={onNew} style={{ width: 24.02, height: 24.02 }}>
        <PlusIcon size={24.02} color="#fff"/>
      </Pressable>
    </Pressable>
  </View>);
