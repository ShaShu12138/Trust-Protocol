import { describe, expect, it } from 'vitest';
import { newDayOne, stepDayOne, parseDayOne, REPORT_REASONS, type DayAction } from './day-one-session';
const run = (actions: DayAction[], s = newDayOne()) => actions.reduce(stepDayOne, s);
const police: DayAction[] = ['answer', 'next', 'link', 'answer', 'next', 'next', 'next', 'next'];
describe('Day 1 reporting', () => {
  it('requires the instructed email click to trigger police without navigating', () => {
    expect(run(['link', 'domain', 'callback']).phase).toBe('intro');
    const s = run(['answer', 'next', 'link']);
    expect(s.phase).toBe('police');
    expect(s.page).toBe('home');
    expect(s.call).toBe('ringing');
  });
  it('finishes all police instructions even after hanging up', () => {
    expect(run(['answer', 'next', 'link', 'hangup', 'next', 'next', 'next', 'next']).phase).toBe('verify');
  });
  it.each(REPORT_REASONS)('accepts %s without investigation or immediate grading', reason => {
    const s = run([...police, reason]);
    expect(s.phase).toBe('stamped');
    expect(s.reason).toBe(reason);
    expect(s.call).toBeNull();
    expect(s.inspected).toBe(false);
    expect(stepDayOne(s, 'domain')).toEqual(s);
    const callback = run(['callback', 'answer'], s);
    expect(callback.phase).toBe('callback');
    expect(callback.reason).toBe(reason);
    expect(stepDayOne(callback, 'next').phase).toBe('review');
  });
  it('allows browsing without locking the report to a route', () => {
    expect(run([...police, 'official', 'home', 'transaction']).reason).toBe('transaction');
    expect(run([...police, 'official', 'inspect', 'domain']).reason).toBe('domain');
  });
  it('does not skip a ringing callback, and allows completion after decline', () => {
    const s = run([...police, 'password', 'callback']);
    expect(stepDayOne(s, 'next')).toEqual(s);
    expect(run(['hangup', 'next'], s).phase).toBe('review');
  });
  it('reconnects the initial caller', () => {
    expect(run(['hangup', 'retry', 'answer', 'next']).phase).toBe('email');
  });
  it('round-trips every checkpoint and preserves original state', () => {
    let s = newDayOne();
    const original = s;
    for (const action of [...police, 'domain', 'callback', 'answer', 'next'] as DayAction[]) {
      s = stepDayOne(s, action);
      expect(parseDayOne(JSON.stringify(s))).toEqual(s);
    }
    expect(original).toEqual(newDayOne());
    expect(stepDayOne(s, 'link')).toBe(s);
  });
  it.each(['null', '{}', '{', '{"version":2}', JSON.stringify({...newDayOne(), phase:'review'}), JSON.stringify({...newDayOne(), reason:'invented'})])('rejects malformed or incompatible save %s', raw => {
    expect(parseDayOne(raw)).toBeNull();
  });
});
