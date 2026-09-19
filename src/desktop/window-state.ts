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
  titleKey: TranslationKey;
  zIndex: number;
  minimized: boolean;
}

export interface WindowMoveDetail extends WindowPosition {
  id: string;
}

export interface WindowIdDetail {
  id: string;
}
import type { TranslationKey } from '../localization/i18n';
