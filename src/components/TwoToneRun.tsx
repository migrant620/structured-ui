import * as React from 'react';
import { Text, View } from 'react-native';
export const TwoToneRun: React.FC<{
    text: string;
    style: React.ComponentProps<typeof Text>['style'];
    from: number;
    to: number;
    color: string;
    accent: string;
    backing: string;
    nativeID?: string;
    hitPadLeft?: number;
    accessibilityLabel?: string;
}> = ({ text, style, from, to, color, accent, backing, nativeID, hitPadLeft = 0, accessibilityLabel }) => {
    const s = (Array.isArray(style) ? Object.assign({}, ...style) : style) as Record<string, unknown>;
    const left = Number(s.left ?? 0);
    const top = Number(s.top ?? 0);
    const height = Number(s.height ?? s.lineHeight ?? 0);
    return (<>
      <Text nativeID={nativeID} accessibilityLabel={accessibilityLabel} style={hitPadLeft ? ([style as never, { marginLeft: -hitPadLeft, paddingLeft: hitPadLeft }] as never) : (style as never)}>
        {text}
      </Text>
      <View aria-hidden pointerEvents="none" style={{
            position: 'absolute',
            left: left + from,
            top,
            width: to + 4 - from,
            height,
            overflow: 'hidden',
            backgroundColor: backing,
        }}>
        
        <Text nativeID={nativeID ? `${nativeID}-a` : undefined} style={{ ...(s as Record<string, unknown>), left: -from, top: 0, color: accent, width: to + 12 } as never}>
          {text}
        </Text>
      </View>
    </>);
};
