import type { MailMessageDefinition } from '../content-types';

export const CASE_01_MAIL_MESSAGES: readonly MailMessageDefinition[] = [
  {
    id: 'mail.nova-security-review',
    senderNameKey: 'case01.mail.nova.sender',
    senderAddress: 'security@nova-alerts.net',
    subjectKey: 'case01.mail.nova.subject',
    previewKey: 'case01.mail.nova.preview',
    bodyKey: 'case01.mail.nova.body',
    timestamp: '2026-09-20T08:42:00+02:00',
    link: {
      pageId: 'page.nova-review-fake',
      labelKey: 'case01.mail.nova.cta',
      confirmLabelKey: 'case01.mail.nova.confirm',
    },
  },
  {
    id: 'mail.civic-security-digest',
    senderNameKey: 'case01.mail.digest.sender',
    senderAddress: 'digest@civic-workspace.example',
    subjectKey: 'case01.mail.digest.subject',
    previewKey: 'case01.mail.digest.preview',
    bodyKey: 'case01.mail.digest.body',
    timestamp: '2026-09-19T16:15:00+02:00',
    initiallyRead: true,
  },
  {
    id: 'mail.canal-energy-statement',
    senderNameKey: 'case01.mail.energy.sender',
    senderAddress: 'statements@canal-energy.example',
    subjectKey: 'case01.mail.energy.subject',
    previewKey: 'case01.mail.energy.preview',
    bodyKey: 'case01.mail.energy.body',
    timestamp: '2026-09-18T11:05:00+02:00',
    initiallyRead: true,
  },
];
