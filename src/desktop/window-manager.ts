import type {
  DesktopWindowState,
  WindowPosition,
} from './window-state';

const BASE_Z_INDEX = 10;

export class WindowManager {
  private nextZIndex = BASE_Z_INDEX;

  constructor(private windows: DesktopWindowState[]) {
    this.nextZIndex =
      Math.max(BASE_Z_INDEX, ...windows.map((window) => window.zIndex)) + 1;
  }

  get snapshot(): DesktopWindowState[] {
    return this.windows.map((window) => ({ ...window }));
  }

  focus(id: string): DesktopWindowState[] {
    this.update(id, { zIndex: this.nextZIndex++ });
    return this.snapshot;
  }

  move(id: string, position: WindowPosition): DesktopWindowState[] {
    this.update(id, position);
    return this.snapshot;
  }

  minimize(id: string): DesktopWindowState[] {
    this.update(id, { minimized: true });
    return this.snapshot;
  }

  restore(id: string): DesktopWindowState[] {
    this.update(id, { minimized: false, zIndex: this.nextZIndex++ });
    return this.snapshot;
  }

  close(id: string): DesktopWindowState[] {
    this.windows = this.windows.filter((window) => window.id !== id);
    return this.snapshot;
  }

  private update(
    id: string,
    changes: Partial<DesktopWindowState>,
  ): void {
    this.windows = this.windows.map((window) =>
      window.id === id ? { ...window, ...changes } : window,
    );
  }
}
