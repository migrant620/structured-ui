---
version: alpha
name: Structured Android Day Planner
description: >-
  A grey page holding one white rounded sheet, a vertical timeline spine with a
  disc per task, gutter time labels down the left edge, and a single coral
  accent reserved for planning and action. Covers the first batch (the day
  timeline in its first-run, populated, completed and delete-confirmation
  states, the two-step task editor, the task detail sheet, the inbox tab and
  the settings tab).
colors:
  page: "#F2F2F5"
  sheet: "#FFFFFF"
  navBar: "#EBEBEB"
  surface: "#FFFFFF"
  surfaceMuted: "#EBEBEB"
  accent: "#F49F99"
  accentWash: "#FDECEB"
  ink: "#000000"
  inkSecondary: "#8A8A8E"
  navInk: "#828286"
  navPill: "#EDDCDB"
  wheelInk: "#A6A6AA"
  doneInk: "#59595F"
typography:
  header:
    fontFamily: Roboto (static instance)
    fontSize: 23
    lineHeight: 28
  rowTitle:
    fontFamily: Roboto (static instance)
    fontSize: 18.7
    lineHeight: 21.09
    letterSpacing: 0.15
  rowSub:
    fontFamily: Roboto (static instance)
    fontSize: 12.8
    lineHeight: 14.18
    letterSpacing: 0.08
  note:
    fontFamily: Roboto (static instance)
    fontSize: 13.2
    lineHeight: 16
    letterSpacing: 0.3
  gutter:
    fontFamily: Roboto (static instance)
    fontSize: 10.23
    lineHeight: 12
    letterSpacing: 1.0
  gutterNow:
    fontFamily: Roboto (static instance, heavier stop)
    fontSize: 10.23
    lineHeight: 12
    letterSpacing: 1.0
  dayNumber:
    fontFamily: Roboto (static instance)
    fontSize: 16.8
    lineHeight: 18.91
  navLabel:
    fontFamily: Roboto (static instance)
    fontSize: 13
    lineHeight: 16
  sub:
    fontFamily: Roboto (static instance)
    fontSize: 13.8
  action:
    fontFamily: Roboto (static instance)
    fontSize: 14.5
  setting:
    fontFamily: Roboto (static instance)
    fontSize: 16.6
  chip:
    fontFamily: Roboto (static instance)
    fontSize: 14
  more:
    fontFamily: Roboto (static instance)
    fontSize: 17.2
spacing:
  frameWidth: 393
  frameHeight: 777
  sheetTop: 150.18
  navBarTop: 713.45
  navBarHeight: 64
  discCx: 82.18
  discDiameter: 60.5
  discDiameterTall: 76.5
  ringCx: 368.91
  ringOuter: 22.18
  connectorDash: 5.45
  connectorGap: 5.45
  connectorWidth: 2.18
  weekColumnPitch: 53.82
  weekBadgeDisc: 13.82
  fabDiameter: 56
rounded:
  sheet: 22
  card: 16
  pill: 8
  fab: 28
  badgeDisc: 6.91
---

## Overview

Designed for a 393 × 777 dp phone frame, English, light theme. This document
covers the first release batch only — the day timeline in its first-run, populated, completed and
delete-confirmation states, the two-step task editor, the task detail sheet, the inbox tab and the
settings tab. It is not a complete system for every Structured screen.

Structured is a planner that treats a day as one drawable object. The whole interface is organised
around a single vertical timeline spine: a disc per task, dashes between them, and time labels in a
narrow gutter. Everything else — the sheet that rounds over the page, the coral reserved for intent,
the guide rows that teach the spine — exists to keep that line legible.

## Colors

The page behind everything is `#F2F2F5`; the day itself lives on a white sheet whose top edge
rounds at 22 dp and sits at y 150.18, with the bottom bar in `#EBEBEB` occupying the last 64 dp.
Text is one `#000000` ink, with `#8A8A8E` carrying every supporting line — sub-labels, gutter
times, counts — and `#828286` stepping the idle navigation labels one notch lighter. A completed
title reads `#59595F`, darker than the supporting greys: done, not deleted.

Colour is reserved for intent. `#F49F99` is the app's only true accent: planned task discs, the
detail sheet's action cards, the completion rings, the editor's selection pill and the "More..."
links all share it, with `#FDECEB` as its wash on tinted plates. Unscheduled guide rows use muted
`#EBEBEB` discs so the spine's eye falls on what is actually planned. The active navigation item
sits on a `#EDDCDB` capsule — a dedicated value rather than accent-over-grey.

## Typography

The face is Roboto, but nominal weights are not what ships. Each typographic role registers its
own static instance cut from the variable font — twelve roles in total — because nominal weights
read too light in a browser, and the gap grows as type shrinks. Each role has its own weight,
registered as a named instance (RobotoText, RobotoGutter, RobotoTitle, and so on).

Two details matter. Row titles carry `letterSpacing: 0.15`: tracking — not a larger size — sets
their width without changing their height. And the gutter's "now" label is
its own heavier instance at the same 10.23 dp: the current time is the only black, bold element in
the gutter, which is how the timeline tells you where you are without a second hand.

## Layout

The spine is the layout. Task discs sit centred at x 82.18 — 60.5 dp across on standard rows,
76.5 dp on the taller guide rows — joined by 2.18 dp dashed connectors (5.45 dash, 5.45 gap) that
turn solid grey into unscheduled rows. Every row's text column starts at x 146.18, and each row
carries an unfinished-task ring at x 368.91 (22.18 dp outer, 2.18 dp stroke). The left gutter's
time labels right-align in a 40 dp column and re-derive per state: intermediate hour marks, each
task's start time, and the black "now" marker between them.

Above the sheet, a month header ("September" in ink, "2026" in accent) and a week strip of seven
53.82 dp-pitched columns, each carrying a 16.8 dp day number and up to four 13.82 dp mark discs.
The 56 dp FAB floats at (348.73, 669.45) over the sheet's bottom-right.

## Elevation & Depth

Depth is expressed by sheets, not shadows. The editor, the task detail sheet and the delete
confirmation slide over the live timeline under one dimming scrim, each with the sheet's own 22 dp
top rounding. The plan stays legible behind them, and actions taken in a sheet update the timeline
still visible above the scrim.

## Shapes

Radii follow function: 22 on the sheet that holds the day, 16 on cards (action cards, dialog
cards, Pro banner), 8 on the editor's selection pill, fully rounded discs, rings and the FAB's
28. The week strip's mark discs are 13.82 dp and overflow their 8 dp layout slots — the disc is
its own token, not a property of the slot.

## Components

| Component | Responsibility |
|---|---|
| Header / WeekStrip | Month title with accent year span; the selected week with per-day activity marks. |
| TimelineScreen | The spine: gutter labels, discs, dashed connectors, task rows, completion rings. |
| TaskRow | A task's disc, title, sub-label, note line with accent span, checklist count and ring. |
| EditorSheet | The two-step create/edit flow: title with suggestion chips, then When / How long on a duration wheel with the accent selection pill. |
| DetailSheet | A task's time range with Delete / Duplicate / Complete cards and Edit Task. |
| DeleteDialog | The delete confirmation card over the scrim. |
| InboxScreen / SettingsScreen | The two supporting tabs, sharing the same shell and bottom bar. |

## Do's and Don'ts

- Use real text, inputs, buttons and data state; creating, completing and deleting must move the
  spine and stay consistent between timeline and sheet.
- Keep the accent reserved: a new surface that needs coral is a planning surface, or it is grey.
- Keep completed tasks on the spine; do not fade them out of the day.
- Do not substitute nominal font weights for the per-role instances.

## Responsive Behavior

Web supports the same representative flows with touch and mouse. The interface is designed for a
393 dp phone column; on wider screens it stays centred rather than stretching. Android and iOS
native behavior are separate targets and are not validated by this prototype.

## Known Gaps

- Recurring-task editing, calendar import, the colour picker wheel, reminders and the Pro purchase
  flow are outside the first batch.
- Motion is limited to the sheet and state transitions the batch needs; no full motion study is
  included.
- Validation covers Chromium at 393 dp width; it does not establish Safari/Firefox compatibility
  or native acceptance.
