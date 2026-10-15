/**
 * The settings list - reference state S12 (`settings/settings_00`).
 *
 * A flat page of grouped cards over the page colour: the accent Pro banner, then SYNC / GENERAL /
 * INTEGRATIONS groups of white 54.18 dp rows, then the SUPPORT heading the reference shows cut by
 * its own bottom bar. Section labels and row runs sit at the reference's own positions; the row
 * tiles, chevrons and value runs carry no nodes of their own and are judged from the raster.
 */
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  BellSquareIcon,
  BoltIcon,
  BrushIcon,
  CalendarFillIcon,
  ChevronRightIcon,
  CloudCheckIcon,
  CogsIcon,
  ProBadgeIcon,
} from '../icons';
import { ProChip } from './DetailSheet';
import { colors, fontFamily, frame, type } from '../theme/tokens';

/** A grey section label ("SYNC", "GENERAL"...). */
const SectionLabel: React.FC<{ label: string; top: number }> = ({ label, top }) => (
  <Text
    style={{
      position: 'absolute',
      left: 32.02,
      top,
      width: 344.97,
      fontFamily: fontFamily.now,
      fontSize: 14.0,
      lineHeight: 14.18,
      paddingTop: 1.2,
      // One step lighter than inkSecondary: SUPPORT is clipped by the nav bar in both renders, and
      // at inkSecondary the label's ink amount reads 1.1005 against the reference's clipped box -
      // a hair over the 1.10 ceiling - while the fully visible labels read 0.973-0.975. A single
      // unit of grey puts every section label inside the band; the ink colour stays within 10 of
      // the reference's (tolerance 40).
      color: '#8B8B8F',
    }}
  >
    {label}
  </Text>
);

/** A coloured tile with its glyph - the reference gives these no node. */
const Tile: React.FC<{ top: number; bg: string; children: React.ReactNode }> = ({ top, bg, children }) => (
  <View style={{ position: 'absolute', left: 32.02, top, width: 44, height: 44, borderRadius: 12, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </View>
);

const ROW_H = 54.18;
/** The title run's offset inside its row: every reference title sits 18.33 dp under the row top. */
const TITLE_TOP = 18.33;
const VALUE_TOP = 19.42;

/** One settings row: title run at x 82.24, an optional value run or PRO chip, a chevron. */
const Row: React.FC<{
  title: string;
  rowTop: number;
  value?: string;
  valueLeft?: number;
  toggle?: boolean;
  pro?: boolean;
  divider?: boolean;
}> = ({ title, rowTop, value, valueLeft = 296.57, toggle, pro, divider = false }) => {
  const cy = rowTop + ROW_H / 2;
  return (
    <View>
      <Pressable accessibilityRole="button" accessibilityLabel={title} style={{ position: 'absolute', left: 16.01, top: rowTop, width: 360.73, height: ROW_H }}>
        {/* The reference's row title is a hair smaller than the timeline's row title: its ink runs
            159.75 dp for `Notifications & Alerts` against the row title's 164.7 at the same face. */}
        <Text style={{ position: 'absolute', left: 66.23, top: TITLE_TOP, fontFamily: fontFamily.setting, fontSize: 16.6, letterSpacing: 0.15, lineHeight: 18.92, color: colors.ink }}>
          {title}
        </Text>
        {value ? (
          <Text style={{ position: 'absolute', left: valueLeft, top: VALUE_TOP, ...type.rowMeta, fontSize: 14.5, lineHeight: 16.4, color: colors.inkSecondary }}>
            {value}
          </Text>
        ) : null}
        {toggle ? <View style={{ position: 'absolute', left: 305, top: ROW_H / 2 - 8, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.accent }} /> : null}
        {pro ? <ProChip x={270.73} y={19.82} /> : null}
        <View style={{ position: 'absolute', left: 333.5, top: ROW_H / 2 - 8, width: 16, height: 16 }}>
          <ChevronRightIcon size={16} color="#C6C6C8" />
        </View>
      </Pressable>
      {/* The rule sits 1 dp below the row's own bottom edge on the capture (389.4 / 443.6 / 612.4,
          against rowTop + ROW_H at 388.5 / 442.7 / 611.5), and it reads (196,196,198) rather than
          the surface grey. Both were wrong: the colour by 39 levels, the edge by a full dp. */}
      {divider ? (
        <View style={{ position: 'absolute', left: 82.24, top: rowTop + ROW_H + 1, width: 294.49, height: 1, backgroundColor: colors.settingRule }} />
      ) : null}
    </View>
  );
};

/** A white group card behind a run of rows (no node on the reference). */
const GroupCard: React.FC<{ top: number; h: number }> = ({ top, h }) => (
  <View style={{ position: 'absolute', left: 16.01, top, width: 360.73, height: h, borderRadius: 16, backgroundColor: colors.sheet }} />
);

export const SettingsScreen: React.FC = () => (
  <View style={{ position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, backgroundColor: colors.page }}>
    <Text style={{ position: 'absolute', left: 16.01, top: 17.83, width: 180, ...type.header, color: colors.ink }}>
      Settings
    </Text>

    {/* Pro banner: accent card, rosette badge (62 dp node), white title run, white chevron. */}
    <View style={{ position: 'absolute', left: 16.01, top: 78.91, width: 360.73, height: 89.09, borderRadius: 20, backgroundColor: colors.accent }} />
    <Pressable accessibilityRole="button" accessibilityLabel="Structured Pro" style={{ position: 'absolute', left: 32.02, top: 88.79, width: 62.22, height: 62.22 }}>
      <ProBadgeIcon size={62.22} color={colors.accent} />
    </Pressable>
    <Text
      style={{
        position: 'absolute',
        left: 102.25,
        top: 120.4,
        width: 133.91,
        fontSize: 18.7,
        lineHeight: 23.29,
        fontFamily: fontFamily.title,
        letterSpacing: 0.15,
        color: '#FFFFFF',
      }}
    >
      Structured Pro
    </Text>
    <View style={{ position: 'absolute', left: 352, top: 117, width: 18, height: 18 }}>
      <ChevronRightIcon size={18} color="#FFFFFF" />
    </View>

    <SectionLabel label="SYNC" top={195.77} />
    <GroupCard top={219.65} h={ROW_H} />
    <Tile top={222.14} bg={colors.accent}>
      <CloudCheckIcon size={26} color="#fff" />
    </Tile>
    <Row title="Structured Cloud" rowTop={219.65} value="Set Up" valueLeft={274.74} />

    <SectionLabel label="GENERAL" top={310.4} />
    <GroupCard top={334.28} h={ROW_H * 3} />
    <Tile top={336.77} bg="#91BF6C">
      <BellSquareIcon size={26} color="#fff" />
    </Tile>
    <Row title="Notifications & Alerts" rowTop={334.28} value="Off" divider />
    <Tile top={390.99} bg="#91BF6C">
      <BrushIcon size={26} color="#fff" />
    </Tile>
    <Row title="Customization" rowTop={388.5} toggle divider />
    <Tile top={445.21} bg="#6185A8">
      <CogsIcon size={26} color="#fff" />
    </Tile>
    <Row title="Advanced" rowTop={442.72} />

    <SectionLabel label="INTEGRATIONS" top={533.46} />
    <GroupCard top={557.34} h={ROW_H * 2} />
    <Tile top={559.83} bg="#FFBC0B">
      <BoltIcon size={26} color="#fff" />
    </Tile>
    <Row title="Energy Monitor" rowTop={557.34} value="Off" divider />
    <Tile top={614.05} bg="#974767">
      <CalendarFillIcon size={26} color="#fff" />
    </Tile>
    <Row title="Google Calendar" rowTop={611.56} pro />

    <SectionLabel label="SUPPORT" top={702.31} />
  </View>
);
