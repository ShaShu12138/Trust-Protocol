import type { MailMessageDefinition, MailMessageId } from '../../content/content-types';

export interface MailSessionSnapshot {
  selectedMessageId: MailMessageId | null;
  readMessageIds: ReadonlySet<MailMessageId>;
  senderDetailsMessageId: MailMessageId | null;
}

export class MailSession {
  private selectedMessageId: MailMessageId | null;
  private readonly readMessageIds: Set<MailMessageId>;
  private senderDetailsMessageId: MailMessageId | null = null;

  constructor(
    messages: readonly MailMessageDefinition[],
    persistedReadMessageIds: readonly MailMessageId[] = [],
  ) {
    this.selectedMessageId = messages[0]?.id ?? null;
    this.readMessageIds = new Set([
      ...messages.filter((message) => message.initiallyRead).map((message) => message.id),
      ...persistedReadMessageIds,
    ]);
  }

  get snapshot(): MailSessionSnapshot {
    return {
      selectedMessageId: this.selectedMessageId,
      readMessageIds: new Set(this.readMessageIds),
      senderDetailsMessageId: this.senderDetailsMessageId,
    };
  }

  open(messageId: MailMessageId): MailSessionSnapshot {
    this.selectedMessageId = messageId;
    this.readMessageIds.add(messageId);
    this.senderDetailsMessageId = null;
    return this.snapshot;
  }

  toggleSenderDetails(messageId: MailMessageId): MailSessionSnapshot {
    this.senderDetailsMessageId =
      this.senderDetailsMessageId === messageId ? null : messageId;
    return this.snapshot;
  }
}
