import { describe, expect, it } from 'vitest';
import type { MailMessageDefinition } from '../../content/content-types';
import { MailSession } from './mail-session';

const messages = [
  { id: 'unread', initiallyRead: false },
  { id: 'read', initiallyRead: true },
] as MailMessageDefinition[];

describe('MailSession', () => {
  it('selects the first message without silently marking it read', () => {
    const session = new MailSession(messages).snapshot;
    expect(session.selectedMessageId).toBe('unread');
    expect(session.readMessageIds.has('unread')).toBe(false);
    expect(session.readMessageIds.has('read')).toBe(true);
  });

  it('marks an opened message as read', () => {
    const session = new MailSession(messages);
    expect(session.open('unread').readMessageIds.has('unread')).toBe(true);
  });

  it('restores persisted read state when the application is reopened', () => {
    const session = new MailSession(messages, ['unread']).snapshot;

    expect(session.readMessageIds.has('unread')).toBe(true);
    expect(session.readMessageIds.has('read')).toBe(true);
  });

  it('returns isolated read-state snapshots', () => {
    const session = new MailSession(messages);
    const snapshot = session.snapshot;
    (snapshot.readMessageIds as Set<string>).add('outside-change');
    expect(session.snapshot.readMessageIds.has('outside-change')).toBe(false);
  });

  it('toggles sender details for one message', () => {
    const session = new MailSession(messages);
    expect(session.toggleSenderDetails('unread').senderDetailsMessageId).toBe('unread');
    expect(session.toggleSenderDetails('unread').senderDetailsMessageId).toBeNull();
  });
});
