import type {
  DesktopWindowState,
  WindowPosition,
  WindowSize,
} from './window-state';

const BASE_Z_INDEX = 10;

export class WindowManager {
  private nextZIndex = BASE_Z_INDEX;
  private windows: DesktopWindowState[];

  constructor(windows: DesktopWindowState[]) {
    this.windows = windows.map((window) => ({ ...window }));
    this.nextZIndex =
      Math.max(BASE_Z_INDEX, ...this.windows.map((window) => window.zIndex)) + 1;
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

  resize(id: string, size: WindowSize): DesktopWindowState[] {
    const window = this.windows.find((candidate) => candidate.id === id);
    if (!window) return this.snapshot;

    this.update(id, {
      width: Math.max(window.minWidth, size.width),
      height: Math.max(window.minHeight, size.height),
    });
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

  open(window: DesktopWindowState): DesktopWindowState[] {
    const existing = this.windows.find((candidate) => candidate.id === window.id);
    if (existing) {
      return existing.minimized ? this.restore(window.id) : this.focus(window.id);
    }

    this.windows = [
      ...this.windows,
      { ...window, minimized: false, zIndex: this.nextZIndex++ },
    ];
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
