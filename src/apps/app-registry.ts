import type { TranslationKey } from '../localization/i18n';
import { assetUrl } from '../ui/asset-url';

export const APP_IDS = ['mail', 'browser', 'bank', 'phone'] as const;

export type AppId = (typeof APP_IDS)[number];

export interface AppDefinition {
  id: AppId;
  titleKey: TranslationKey;
  iconPath: string;
  initialWindow?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  minimumWindowSize: {
    width: number;
    height: number;
  };
}

export const APP_DEFINITIONS: Readonly<Record<AppId, AppDefinition>> = {
  mail: {
    id: 'mail',
    titleKey: 'apps.mail.title',
    iconPath: assetUrl('/assets/applications/mail/app-mail.svg'),
    initialWindow: { x: 118, y: 58, width: 720, height: 500 },
    minimumWindowSize: { width: 480, height: 330 },
  },
  browser: {
    id: 'browser',
    titleKey: 'apps.browser.title',
    iconPath: assetUrl('/assets/applications/browser/app-browser.svg'),
    initialWindow: { x: 420, y: 130, width: 620, height: 480 },
    minimumWindowSize: { width: 420, height: 300 },
  },
  bank: {
    id: 'bank',
    titleKey: 'apps.bank.title',
    iconPath: assetUrl('/assets/applications/bank/app-bank.svg'),
    initialWindow: { x: 210, y: 105, width: 620, height: 480 },
    minimumWindowSize: { width: 420, height: 320 },
  },
  phone: {
    id: 'phone',
    titleKey: 'apps.phone.title',
    iconPath: assetUrl('/assets/applications/phone/app-phone.svg'),
    initialWindow: { x: 310, y: 145, width: 420, height: 360 },
    minimumWindowSize: { width: 340, height: 360 },
  },
};

export function getAppDefinition(appId: AppId): AppDefinition {
  return APP_DEFINITIONS[appId];
}
