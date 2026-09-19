import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import './app-window';
import {
  SUPPORTED_LOCALES,
  getInitialLocale,
  isSupportedLocale,
  persistLocale,
  translate,
  type SupportedLocale,
} from '../localization/i18n';
import { WindowManager } from './window-manager';
import type {
  DesktopWindowState,
  WindowIdDetail,
  WindowMoveDetail,
} from './window-state';

const INITIAL_WINDOWS: DesktopWindowState[] = [
  {
    id: 'window-one',
    titleKey: 'window.one.title',
    x: 76,
    y: 68,
    width: 480,
    height: 330,
    zIndex: 11,
    minimized: false,
  },
  {
    id: 'window-two',
    titleKey: 'window.two.title',
    x: 420,
    y: 190,
    width: 420,
    height: 290,
    zIndex: 12,
    minimized: false,
  },
];

export class GameDesktop extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      min-height: 520px;
      color: #252822;
      background: #c6c1b3;
    }

    .desktop {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background:
        radial-gradient(circle at 20% 18%, rgba(255, 247, 216, 0.75), transparent 28%),
        radial-gradient(circle at 78% 78%, rgba(74, 114, 99, 0.2), transparent 32%),
        linear-gradient(145deg, #dad5c8, #b9b5aa);
    }

    .desktop::before {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(49, 54, 46, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(49, 54, 46, 0.04) 1px, transparent 1px);
      background-size: 28px 28px;
      content: '';
      pointer-events: none;
    }

    .taskbar {
      position: absolute;
      right: 14px;
      bottom: 12px;
      left: 14px;
      z-index: 10000;
      display: flex;
      min-height: 48px;
      align-items: center;
      gap: 8px;
      padding: 7px;
      background: rgba(235, 231, 218, 0.9);
      border: 1px solid rgba(51, 54, 47, 0.28);
      border-radius: 10px;
      box-shadow: 0 12px 30px rgba(38, 40, 34, 0.17);
      backdrop-filter: blur(12px);
    }

    .taskbar-label {
      padding: 0 9px;
      color: rgba(37, 40, 34, 0.62);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
    }

    .task-button {
      min-width: 112px;
      max-width: 180px;
      height: 34px;
      overflow: hidden;
      padding: 0 12px;
      color: #252822;
      background: rgba(255, 253, 244, 0.62);
      border: 1px solid rgba(51, 54, 47, 0.22);
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .task-button:hover,
    .task-button.active {
      background: #fffdf4;
      border-color: rgba(51, 54, 47, 0.58);
    }

    .language-control {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-left: auto;
      padding-left: 8px;
    }

    .language-label {
      color: rgba(37, 40, 34, 0.62);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .language-select {
      height: 34px;
      padding: 0 28px 0 10px;
      color: #252822;
      background: #fffdf4;
      border: 1px solid rgba(51, 54, 47, 0.3);
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
    }

    .empty-state {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      color: rgba(37, 40, 34, 0.48);
      font-size: 13px;
      letter-spacing: 0.08em;
      pointer-events: none;
    }

    @media (max-width: 700px) {
      :host {
        min-height: 420px;
      }

      .taskbar-label {
        display: none;
      }

      .task-button {
        min-width: 0;
        flex: 1;
      }

      .language-label {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        white-space: nowrap;
      }
    }
  `;

  private readonly windowManager = new WindowManager(INITIAL_WINDOWS);

  @state()
  private windows = this.windowManager.snapshot;

  @state()
  private desktopBounds = new DOMRectReadOnly(0, 0, 1280, 720);

  @state()
  private locale: SupportedLocale = getInitialLocale();

  private resizeObserver?: ResizeObserver;

  connectedCallback(): void {
    super.connectedCallback();
    persistLocale(this.locale);
    this.addEventListener('window-focus', this.handleFocus as EventListener);
    this.addEventListener('window-move', this.handleMove as EventListener);
    this.addEventListener('window-minimize', this.handleMinimize as EventListener);
    this.addEventListener('window-close', this.handleClose as EventListener);
  }

  disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    this.removeEventListener('window-focus', this.handleFocus as EventListener);
    this.removeEventListener('window-move', this.handleMove as EventListener);
    this.removeEventListener('window-minimize', this.handleMinimize as EventListener);
    this.removeEventListener('window-close', this.handleClose as EventListener);
    super.disconnectedCallback();
  }

  protected firstUpdated(): void {
    const desktop = this.renderRoot.querySelector<HTMLElement>('.desktop');
    if (!desktop) return;

    const updateBounds = () => {
      const bounds = desktop.getBoundingClientRect();
      this.desktopBounds = new DOMRectReadOnly(
        0,
        0,
        bounds.width,
        Math.max(0, bounds.height - 72),
      );
    };

    this.resizeObserver = new ResizeObserver(updateBounds);
    this.resizeObserver.observe(desktop);
  }

  render() {
    const visibleWindows = this.windows.filter((window) => !window.minimized);
    const topVisibleZ = Math.max(
      0,
      ...visibleWindows.map((window) => window.zIndex),
    );

    return html`
      <main
        class="desktop"
        aria-label=${translate(this.locale, 'desktop.ariaLabel')}
      >
        ${visibleWindows.map(
          (window) => html`
            <app-window
              .windowState=${window}
              .desktopBounds=${this.desktopBounds}
              .focused=${window.zIndex === topVisibleZ}
              .locale=${this.locale}
            ></app-window>
          `,
        )}

        ${this.windows.length === 0
          ? html`<div class="empty-state">
              ${translate(this.locale, 'desktop.emptyState')}
            </div>`
          : null}

        <nav
          class="taskbar"
          aria-label=${translate(this.locale, 'taskbar.ariaLabel')}
        >
          <span class="taskbar-label">TRUST PROTOCOL</span>
          ${this.windows.map(
            (window) => html`
              <button
                class="task-button ${!window.minimized &&
                window.zIndex === topVisibleZ
                  ? 'active'
                  : ''}"
                type="button"
                @click=${() => this.activateFromTaskbar(window)}
              >
                ${translate(this.locale, window.titleKey)}
              </button>
            `,
          )}
          <label class="language-control">
            <span class="language-label">
              ${translate(this.locale, 'taskbar.languageLabel')}
            </span>
            <select
              class="language-select"
              @change=${this.changeLocale}
            >
              ${SUPPORTED_LOCALES.map(
                (locale) => html`
                  <option
                    value=${locale}
                    ?selected=${locale === this.locale}
                  >
                    ${translate(locale, 'locale.name')}
                  </option>
                `,
              )}
            </select>
          </label>
        </nav>
      </main>
    `;
  }

  private readonly handleFocus = (event: CustomEvent<WindowIdDetail>): void => {
    event.stopPropagation();
    this.windows = this.windowManager.focus(event.detail.id);
  };

  private readonly handleMove = (event: CustomEvent<WindowMoveDetail>): void => {
    event.stopPropagation();
    this.windows = this.windowManager.move(event.detail.id, event.detail);
  };

  private readonly handleMinimize = (
    event: CustomEvent<WindowIdDetail>,
  ): void => {
    event.stopPropagation();
    this.windows = this.windowManager.minimize(event.detail.id);
  };

  private readonly handleClose = (event: CustomEvent<WindowIdDetail>): void => {
    event.stopPropagation();
    this.windows = this.windowManager.close(event.detail.id);
  };

  private activateFromTaskbar(window: DesktopWindowState): void {
    this.windows = window.minimized
      ? this.windowManager.restore(window.id)
      : this.windowManager.focus(window.id);
  }

  private changeLocale(event: Event): void {
    const selectedLocale = (event.currentTarget as HTMLSelectElement).value;
    if (!isSupportedLocale(selectedLocale)) return;

    this.locale = selectedLocale;
    persistLocale(selectedLocale);
  }
}

customElements.define('game-desktop', GameDesktop);

declare global {
  interface HTMLElementTagNameMap {
    'game-desktop': GameDesktop;
  }
}
