import type { AppId } from '../apps/app-registry';
import type { TranslationKey } from '../localization/i18n';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface DesktopWindowState extends WindowPosition, WindowSize {
  id: string;
  appId: AppId;
  titleKey: TranslationKey;
  zIndex: number;
  minimized: boolean;
  minWidth: number;
  minHeight: number;
}

export interface WindowMoveDetail extends WindowPosition {
  id: string;
}

export interface WindowResizeDetail extends WindowSize {
  id: string;
}

export interface WindowIdDetail {
  id: string;
}
