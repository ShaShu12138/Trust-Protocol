import { describe, expect, it } from 'vitest';
import type { DesktopWindowState } from './window-state';
import { WindowManager } from './window-manager';

const createWindows = (): DesktopWindowState[] => [
  {
    id: 'mail-main',
    appId: 'mail',
    titleKey: 'apps.mail.title',
    x: 10,
    y: 20,
    width: 480,
    height: 330,
    zIndex: 11,
    minimized: false,
    minWidth: 480,
    minHeight: 330,
  },
  {
    id: 'browser-main',
    appId: 'browser',
    titleKey: 'apps.browser.title',
    x: 100,
    y: 120,
    width: 480,
    height: 330,
    zIndex: 12,
    minimized: false,
    minWidth: 420,
    minHeight: 300,
  },
];

describe('WindowManager', () => {
  it('returns snapshots that cannot mutate manager state', () => {
    const source = createWindows();
    const manager = new WindowManager(source);

    source[0].x = 999;
    const snapshot = manager.snapshot;
    snapshot[0].x = 777;

    expect(manager.snapshot[0].x).toBe(10);
  });

  it('focuses a window above the current highest z-index', () => {
    const manager = new WindowManager(createWindows());

    const mail = manager
      .focus('mail-main')
      .find((window) => window.id === 'mail-main');

    expect(mail?.zIndex).toBe(13);
  });

  it('moves only the requested window', () => {
    const manager = new WindowManager(createWindows());
    const windows = manager.move('mail-main', { x: 210, y: 220 });

    expect(windows.find((window) => window.id === 'mail-main')).toMatchObject({
      x: 210,
      y: 220,
    });
    expect(windows.find((window) => window.id === 'browser-main')).toMatchObject({
      x: 100,
      y: 120,
    });
  });

  it('resizes only the requested window', () => {
    const manager = new WindowManager(createWindows());
    const windows = manager.resize('mail-main', { width: 700, height: 480 });

    expect(windows.find((window) => window.id === 'mail-main')).toMatchObject({
      width: 700,
      height: 480,
    });
    expect(windows.find((window) => window.id === 'browser-main')).toMatchObject({
      width: 480,
      height: 330,
    });
  });

  it('does not resize below the application minimum', () => {
    const manager = new WindowManager(createWindows());
    const mail = manager
      .resize('mail-main', { width: 100, height: 100 })
      .find((window) => window.id === 'mail-main');

    expect(mail).toMatchObject({ width: 480, height: 330 });
  });

  it('minimizes and restores a window above the current stack', () => {
    const manager = new WindowManager(createWindows());

    expect(
      manager.minimize('mail-main').find((window) => window.id === 'mail-main'),
    ).toMatchObject({ minimized: true });
    expect(
      manager.restore('mail-main').find((window) => window.id === 'mail-main'),
    ).toMatchObject({ minimized: false, zIndex: 13 });
  });

  it('closes only the requested window', () => {
    const manager = new WindowManager(createWindows());

    expect(manager.close('mail-main').map((window) => window.id)).toEqual([
      'browser-main',
    ]);
  });

  it('opens a closed window above the current stack', () => {
    const manager = new WindowManager(createWindows());
    const mail = createWindows()[0];
    manager.close(mail.id);

    const reopened = manager.open(mail);

    expect(reopened).toHaveLength(2);
    expect(reopened.find((window) => window.id === mail.id)).toMatchObject({
      minimized: false,
      zIndex: 13,
    });
  });

  it('restores an existing minimized window instead of duplicating it', () => {
    const manager = new WindowManager(createWindows());
    const mail = createWindows()[0];
    manager.minimize(mail.id);

    const reopened = manager.open(mail);

    expect(reopened.filter((window) => window.id === mail.id)).toHaveLength(1);
    expect(reopened.find((window) => window.id === mail.id)?.minimized).toBe(false);
  });

  it('leaves state unchanged for an unknown id', () => {
    const manager = new WindowManager(createWindows());
    const before = manager.snapshot;

    manager.focus('missing-window');
    manager.move('missing-window', { x: 1, y: 2 });
    manager.resize('missing-window', { width: 1, height: 2 });
    manager.minimize('missing-window');
    manager.restore('missing-window');

    expect(manager.snapshot).toEqual(before);
  });
});
