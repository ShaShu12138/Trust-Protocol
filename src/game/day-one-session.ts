export const REPORT_REASONS = ['domain', 'url', 'transaction', 'password', 'transfer', 'software', 'identity', 'pressure'] as const;
export type ReportReason = typeof REPORT_REASONS[number];
export const DAY_ACTIONS = ['answer', 'hangup', 'next', 'retry', 'link', 'home', 'official', 'inspect', 'callback', ...REPORT_REASONS] as const;
export type DayAction = typeof DAY_ACTIONS[number];
export const DAY_PHASES = ['intro', 'email', 'police', 'verify', 'stamped', 'callback', 'review'] as const;
export interface DayOneState {
  version: 3;
  phase: typeof DAY_PHASES[number];
  call: 'ringing' | 'connected' | null;
  line: number;
  page: 'home' | 'official';
  retryUsed: boolean;
  inspected: boolean;
  reason: ReportReason | null;
}
export const DAY_ONE_SAVE_KEY = 'trust-protocol.day-one.v3';
export function newDayOne(): DayOneState {
  return { version: 3, phase: 'intro', call: 'ringing', line: 0, page: 'home', retryUsed: false, inspected: false, reason: null };
}
export function stepDayOne(s: DayOneState, action: DayAction): DayOneState {
  if (s.phase === 'review') return s;
  if (REPORT_REASONS.includes(action as ReportReason)) {
    return s.phase === 'verify' ? { ...s, phase: 'stamped', reason: action as ReportReason, call: null } : s;
  }
  const beforePolice = s.phase === 'intro' || s.phase === 'email';
  switch (action) {
    case 'answer': return s.call === 'ringing' ? { ...s, call: 'connected' } : s;
    case 'hangup': return s.call ? { ...s, call: null } : s;
    case 'retry': return beforePolice && !s.call ? { ...s, call: 'ringing', retryUsed: true } : s;
    case 'next':
      if (s.phase === 'callback' && s.call !== 'ringing') return { ...s, phase: 'review', call: null, line: 0 };
      if (s.phase === 'police') {
        if (s.call === 'ringing') return s;
        return s.line < 3 ? { ...s, line: s.line + 1 } : { ...s, phase: 'verify', call: null, line: 0, page: 'home' };
      }
      if (!beforePolice || s.call !== 'connected') return s;
      return { ...s, phase: 'email', line: s.line >= 3 ? 2 : s.line + 1 };
    case 'link': return s.phase === 'email' ? { ...s, phase: 'police', call: 'ringing', line: 0 } : s;
    case 'home': return { ...s, page: 'home' };
    case 'official': return { ...s, page: 'official' };
    case 'inspect': return { ...s, inspected: true };
    case 'callback': return s.phase === 'stamped' ? { ...s, phase: 'callback', call: 'ringing', line: 0 } : s;
    default: return s;
  }
}
export function parseDayOne(raw: string): DayOneState | null {
  try {
    const s = JSON.parse(raw) as DayOneState;
    if (!s || s.version !== 3 || !DAY_PHASES.includes(s.phase)
      || ![null, 'ringing', 'connected'].includes(s.call)
      || !['home', 'official'].includes(s.page)
      || !Number.isInteger(s.line) || s.line < 0 || s.line > 3
      || typeof s.retryUsed !== 'boolean' || typeof s.inspected !== 'boolean'
      || (s.reason !== null && !REPORT_REASONS.includes(s.reason))) return null;
    if (['verify', 'stamped', 'review'].includes(s.phase) && (s.call !== null || s.line !== 0)) return null;
    if (s.phase === 'callback' && s.line !== 0) return null;
    if (['stamped', 'callback', 'review'].includes(s.phase) !== (s.reason !== null)) return null;
    return { ...s };
  } catch { return null; }
}
