/**
 * The prototype's data model.
 *
 * One store feeds every surface: the timeline row, the detail sheet, the editor and the delete
 * dialog all read the same task objects, so completing a task in the sheet is the same mutation
 * that redraws its row. Nothing on screen is a frozen string.
 *
 * Copy policy (spec/content-manifest.json): the reference capture's own sample content - the
 * task names, guide rows, suggestion chips and settings labels the device happened to show - is
 * somebody else's wording, so every string below is this prototype's own. Each replacement keeps
 * the reference's shape (a short imperative title, a one-line sub, a two-line guide title) and
 * its approximate width, and the substitution is declared per state in
 * `spec/gate.json#content_pairing.states`, which is what makes the gate pair those runs by
 * position instead of by text.
 */

export type DiscIcon = 'alarm' | 'checklist' | 'plusCircle' | 'tray' | 'gear' | 'at';

export type Task = {
  id: string;
  title: string;
  /** The line above the title. Empty for a task the user has not given a time to. */
  sub: string;
  /** Minutes from midnight; null while a task is still unscheduled. */
  start: number | null;
  /** Minutes. */
  duration: number;
  /** Which glyph sits in the row's disc. */
  icon: DiscIcon;
  /** A scheduled task draws a filled disc, an unscheduled one a muted disc. */
  scheduled: boolean;
  done: boolean;
  recurring: boolean;
  hasNotes: boolean;
  note: string;
  checklist?: { done: number; total: number };
  /** For a scheduled task whose sub line is a custom range (e.g. "07:45 - 08:15 PM (30m)") rather than
   *  the plain start time the row would otherwise derive. When present it overrides the computed sub. */
  rangeLabel?: string;
  /** Where the accent span sits inside the note run, in dp from the run's left edge. Null when the
   *  note carries no highlighted token (S7's resolved note is plain grey). */
  noteAccent?: [number, number] | null;
};

export const durationPresets = [1, 15, 30, 45, 60, 90];

const t = (
  id: string,
  title: string,
  sub: string,
  start: number | null,
  duration: number,
  icon: DiscIcon,
  extra: Partial<Task> = {}
): Task => ({
  id,
  title,
  sub,
  start,
  duration,
  icon,
  scheduled: start !== null,
  done: false,
  recurring: false,
  hasNotes: false,
  note: '',
  ...extra,
});

/** The state the reference is in on first run: one scheduled task and four guide tasks. */
export const initialTasks: Task[] = [
  t('rise', 'Morning Ritual', '08:00 AM', 8 * 60, 30, 'alarm', {
    recurring: true,
    hasNotes: true,
    note: 'Short rest for 4m, then go!',
  }),
  t('guide-start', 'Start With a Simple Plan Today!', 'Tap here to see how it works', null, 30, 'checklist', {
    hasNotes: true,
  }),
  t('guide-first', 'Plan Your First Task', 'Plan your day in one view', null, 30, 'plusCircle', {
    hasNotes: true,
    checklist: { done: 0, total: 5 },
  }),
  t('guide-inbox', 'Empty Your Mind', 'Keep every loose end', null, 30, 'tray', { hasNotes: true }),
  t('guide-own', 'Make It Feel Yours', 'Tune colors and more', null, 30, 'gear', { hasNotes: true }),
];

/** The hint under the last row, on the reference's first run. */
export const planningHint = 'Free for the next 2h 25m. Plan it.';

/**
 * S2: the same first-run timeline, but with the user-created scheduled task the reference shows on
 * `home/home_02`. The reference keeps all five guide rows at their S1 positions and appends this
 * one row at the bottom (sub `07:45 - 08:15 PM (30m)`), replacing the planning hint. Its disc is a
 * filled accent disc labelled `at` (the reference's own ImageView content-desc), and it carries the
 * same completion ring the other rows do, at cx 368.91 / cy ~698.
 */
const weeklyReview = t('teamSync', 'Weekly review', '07:45 - 08:15 PM (30m)', 19 * 60 + 45, 30, 'at', {
  rangeLabel: '07:45 - 08:15 PM (30m)',
});

// S2 keeps every S1 task, but the capture time has advanced past the rise's calm window, so its note
// reads "0m" (home/home_02) instead of S1's "4m" (home/home_01). A fresh object only for `rise` keeps
// the other four tasks' identity intact.
const riseS2: Task = { ...initialTasks[0], note: 'Short rest for 0m, then go!' };

export const s2Tasks: Task[] = [riseS2, ...initialTasks.slice(1), weeklyReview];

/**
 * S7 (`complete/complete_01`): the same timeline after the detail sheet completed the user task -
 * its title reads struck through under a filled check disc, and the rise row's calm note has
 * resolved into the plain grey "Log how the pause felt." (no accent token).
 */
const riseDone: Task = { ...riseS2, note: 'Log how the pause felt.', noteAccent: null };
const weeklyReviewDone: Task = { ...weeklyReview, done: true };
export const s7Tasks: Task[] = [riseDone, ...initialTasks.slice(1), weeklyReviewDone];

/**
 * S10 (`delete/delete_05`, background): the delete flow's own frame - the plan scrolled to its tail
 * and a second user task (08:15 - 08:30 PM, 15m) sits under the completed one.
 */
const eveningWalk = t('grocery', 'Evening walk', '08:15 - 08:30 PM (15m)', 20 * 60 + 15, 15, 'at', {
  rangeLabel: '08:15 - 08:30 PM (15m)',
});
export const s10Tasks: Task[] = [...s7Tasks, eveningWalk];

/** The four suggestion chips the new-task editor offers, with the ranges the reference shows. */
export const suggestions: { title: string; range: string; icon: 'at' | 'tv' | 'people' | 'run' }[] = [
  { title: 'Reply to Mail', range: '07:45 PM - 08:00 PM (15m)', icon: 'at' },
  { title: 'Watch a Film', range: '07:45 PM - 09:15 PM (90m)', icon: 'tv' },
  { title: 'Meet Up with Friends', range: '07:00 PM - 07:10 PM (10m)', icon: 'people' },
  { title: 'Go for a Walk!', range: '07:45 PM - 08:30 PM (45m)', icon: 'run' },
];

/** The title field's own placeholder, which the reference reports as the field's hint text. */
export const titlePlaceholder = 'Reply to Mail';

export const formatClock = (minutes: number): string => {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const suffix = h24 < 12 ? 'AM' : 'PM';
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')} ${suffix}`;
};

export const formatPill = (minutes: number): string => {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const suffix = h24 < 12 ? 'AM' : 'PM';
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')} ${suffix}`;
};

export const formatGutter = (minutes: number): string => {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, '0')}`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  if (minutes === 60) return '1h';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 30 ? `${h},5h` : `${h}h`;
};

/**
 * A scheduled task's own meta line - `07:45 - 08:15 PM (30m)`. Only the end carries the meridiem,
 * which is the reference's format on both the timeline row and the detail sheet (home_02's
 * "07:45 - 08:15 PM (30m)", detail_00's "9/28/26, 07:45 - 08:15 PM (30m)"); the editor's
 * suggestion chips use the longer two-meridiem form and are not built from this.
 *
 * Every commit - a task created from the editor or an edit applied back to one - regenerates the
 * line from the two numbers through this one function, so a row's start, end and duration can
 * never drift apart between the surfaces that read the task.
 */
export const formatRange = (start: number, duration: number): string =>
  `${formatClock(start).slice(0, 5)} - ${formatClock(start + duration)} (${formatDuration(duration)})`;
