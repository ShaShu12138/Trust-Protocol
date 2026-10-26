import type { TranslationKey } from '../localization/i18n';

export type MailMessageId = string;

export interface MailMessageDefinition {
  id: MailMessageId;
  senderNameKey: TranslationKey;
  senderAddress: string;
  subjectKey: TranslationKey;
  previewKey: TranslationKey;
  bodyKey: TranslationKey;
  timestamp: string;
  initiallyRead?: boolean;
  link?: {
    pageId: string;
    labelKey: TranslationKey;
    confirmLabelKey?: TranslationKey;
  };
}
