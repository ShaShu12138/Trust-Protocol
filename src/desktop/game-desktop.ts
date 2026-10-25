import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import {
  APP_DEFINITIONS,
  getAppDefinition,
  type AppId,
} from '../apps/app-registry';
import '../apps/mail/mail-app';
import type { MailUnreadStateDetail } from '../apps/mail/mail-app';
import '../apps/phone/incoming-call';
import type { CallStatus } from '../apps/phone/incoming-call';
import { CASE_01_MAIL_MESSAGES } from '../content/cases/case-01';
import {
  DAY_01_POLICE_CALL,
  DAY_01_POLICE_CALL_LINES,
  DAY_01_SUSPICIOUS_CALL,
  DAY_01_SUSPICIOUS_CALL_LINES,
} from '../content/calls/day-01-demo-call';
import { DESKTOP_TUTORIAL } from '../content/tutorial';
import '../ui/dialogue-panel';
import { assetUrl } from '../ui/asset-url';
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
  WindowResizeDetail,
} from './window-state';

const INITIAL_APP_IDS: AppId[] = [];
type ActiveCaller = 'suspicious' | 'police';

function createAppWindow(appId: AppId, zIndex = 11): DesktopWindowState {
  const definition = APP_DEFINITIONS[appId];
  const bounds = definition.initialWindow;
  if (!bounds) throw new Error(`Missing initial window bounds for ${appId}`);

  return {
    id: `${appId}-main`,
    appId,
    titleKey: definition.titleKey,
    ...bounds,
    zIndex,
    minimized: false,
    minWidth: definition.minimumWindowSize.width,
    minHeight: definition.minimumWindowSize.height,
  };
}

const INITIAL_WINDOWS: DesktopWindowState[] = INITIAL_APP_IDS.map(
  (appId, index) => createAppWindow(appId, 11 + index),
);

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

    .desktop-icons {
      position: absolute;
      top: 22px;
      left: 20px;
      z-index: 1;
      display: grid;
      gap: 10px;
    }

    .desktop-icon {
      display: grid;
      width: 82px;
      min-height: 78px;
      place-items: center;
      align-content: center;
      gap: 6px;
      padding: 7px 5px;
      color: #292c27;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 8px;
      cursor: pointer;
      font: inherit;
      text-align: center;
    }

    .desktop-icon:hover,
    .desktop-icon:focus-visible {
      background: rgba(255, 253, 244, 0.58);
      border-color: rgba(51, 54, 47, 0.22);
      outline: none;
    }

    .desktop-icon img {
      width: 42px;
      height: 42px;
      filter: drop-shadow(0 3px 4px rgba(38, 40, 34, 0.16));
    }

    .desktop-icon span {
      max-width: 76px;
      font-size: 11px;
      line-height: 1.15;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.75);
    }

    .application-placeholder {
      display: grid;
      height: 100%;
      place-items: center;
      padding: 32px;
      color: rgba(37, 40, 34, 0.58);
      text-align: center;
    }

    .application-placeholder img {
      width: 64px;
      height: 64px;
      margin-bottom: 14px;
    }

    .application-placeholder p {
      margin: 0;
      font-size: 13px;
      letter-spacing: 0.04em;
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

  @state()
  private activeCaller: ActiveCaller = 'suspicious';

  @state()
  private callStatus: CallStatus | null = null;

  @state()
  private tutorialStep: number | null = 0;

  @state()
  private callLineIndex = 0;

  @state()
  private mailReadMessageIds: readonly string[] = CASE_01_MAIL_MESSAGES
    .filter((message) => message.initiallyRead)
    .map((message) => message.id);

  private resizeObserver?: ResizeObserver;
  private repeatCallTimeout?: number;

  connectedCallback(): void {
    super.connectedCallback();
    persistLocale(this.locale);
    this.addEventListener('window-focus', this.handleFocus as EventListener);
    this.addEventListener('window-move', this.handleMove as EventListener);
    this.addEventListener('window-minimize', this.handleMinimize as EventListener);
    this.addEventListener('window-resize', this.handleResize as EventListener);
    this.addEventListener('window-close', this.handleClose as EventListener);
  }

  disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    if (this.repeatCallTimeout !== undefined) {
      window.clearTimeout(this.repeatCallTimeout);
    }
    this.removeEventListener('window-focus', this.handleFocus as EventListener);
    this.removeEventListener('window-move', this.handleMove as EventListener);
    this.removeEventListener('window-minimize', this.handleMinimize as EventListener);
    this.removeEventListener('window-resize', this.handleResize as EventListener);
    this.removeEventListener('window-close', this.handleClose as EventListener);
    super.disconnectedCallback();
  }

  protected firstUpdated(): void {
    const desktop = this.renderRoot.querySelector<HTMLElement>('.desktop');
    const taskbar = this.renderRoot.querySelector<HTMLElement>('.taskbar');
    if (!desktop || !taskbar) return;

    const updateBounds = () => {
      const bounds = desktop.getBoundingClientRect();
      const taskbarBounds = taskbar.getBoundingClientRect();
      this.desktopBounds = new DOMRectReadOnly(
        0,
        0,
        bounds.width,
        Math.max(0, taskbarBounds.top - bounds.top - 4),
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
        <nav
          class="desktop-icons"
          aria-label=${translate(this.locale, 'desktop.applications')}
        >
          ${Object.values(APP_DEFINITIONS).map((application) => {
            const title = translate(this.locale, application.titleKey);
            const iconPath =
              application.id === 'mail' && this.mailUnreadCount > 0
                ? assetUrl('/assets/applications/mail/app-mail-unread.svg')
                : application.iconPath;
            return html`
              <button
                class="desktop-icon"
                type="button"
                aria-label=${translate(this.locale, 'desktop.openApplication', { title })}
                @click=${() => this.openApplication(application.id)}
              >
                <img src=${iconPath} alt="" />
                <span>${title}</span>
              </button>
            `;
          })}
        </nav>

        ${visibleWindows.map(
          (window) => html`
            <app-window
              .windowState=${window}
              .desktopBounds=${this.desktopBounds}
              .focused=${window.zIndex === topVisibleZ}
              .locale=${this.locale}
            >${this.renderApplication(window.appId)}</app-window>
          `,
        )}

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

        ${this.tutorialStep !== null
          ? html`
              <dialogue-panel
                .presentation=${DESKTOP_TUTORIAL[this.tutorialStep]}
                .locale=${this.locale}
                @dialogue-primary=${this.advanceTutorial}
                @dialogue-secondary=${this.finishTutorial}
              ></dialogue-panel>
            `
          : null}

        ${this.callStatus
          ? html`
              <incoming-call
                .call=${this.activeCaller === 'police'
                  ? DAY_01_POLICE_CALL
                  : DAY_01_SUSPICIOUS_CALL}
                .status=${this.callStatus}
                .locale=${this.locale}
                @call-accepted=${this.acceptCall}
                @call-declined=${this.endCall}
                @call-ended=${this.endCall}
              ></incoming-call>
            `
          : null}

        ${this.callStatus === 'connected'
          ? html`
              <dialogue-panel
                non-modal
                .nonModal=${true}
                .presentation=${(this.activeCaller === 'police'
                  ? DAY_01_POLICE_CALL_LINES
                  : DAY_01_SUSPICIOUS_CALL_LINES)[this.callLineIndex]}
                .locale=${this.locale}
                @dialogue-primary=${this.advanceCallDialogue}
              ></dialogue-panel>
            `
          : null}
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

  private readonly handleResize = (
    event: CustomEvent<WindowResizeDetail>,
  ): void => {
    event.stopPropagation();
    this.windows = this.windowManager.resize(event.detail.id, event.detail);
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

  private openApplication(appId: AppId): void {
    this.windows = this.windowManager.open(createAppWindow(appId));
  }

  private get mailUnreadCount(): number {
    return CASE_01_MAIL_MESSAGES.length - this.mailReadMessageIds.length;
  }

  private handleMailUnreadState(
    event: CustomEvent<MailUnreadStateDetail>,
  ): void {
    this.mailReadMessageIds = [...event.detail.readMessageIds];
  }

  private readonly advanceTutorial = (): void => {
    if (this.tutorialStep === null) return;
    const nextStep = this.tutorialStep + 1;
    if (nextStep >= DESKTOP_TUTORIAL.length) {
      this.finishTutorial();
      return;
    }
    this.tutorialStep = nextStep;
  };

  private readonly finishTutorial = (): void => {
    this.tutorialStep = null;
    if (this.callStatus !== null) return;
    this.callLineIndex = 0;
    this.callStatus = 'ringing';
  };

  private acceptCall(): void {
    this.callLineIndex = 0;
    this.callStatus = 'connected';
  }

  private endCall(): void {
    this.callStatus = null;
    if (this.activeCaller !== 'suspicious') return;

    if (this.repeatCallTimeout !== undefined) {
      window.clearTimeout(this.repeatCallTimeout);
    }
    this.repeatCallTimeout = window.setTimeout(() => {
      if (this.activeCaller !== 'suspicious' || this.callStatus !== null) return;
      this.repeatCallTimeout = undefined;
      this.callLineIndex = 0;
      this.callStatus = 'ringing';
    }, 3000);
  }

  private advanceCallDialogue(): void {
    const lines = this.activeCaller === 'police'
      ? DAY_01_POLICE_CALL_LINES
      : DAY_01_SUSPICIOUS_CALL_LINES;

    if (this.activeCaller === 'police') {
      this.callLineIndex = Math.min(this.callLineIndex + 1, lines.length - 1);
      return;
    }

    this.callLineIndex = this.callLineIndex >= lines.length - 1
      ? 2
      : this.callLineIndex + 1;
  }

  private triggerPoliceCall(): void {
    if (this.repeatCallTimeout !== undefined) {
      window.clearTimeout(this.repeatCallTimeout);
      this.repeatCallTimeout = undefined;
    }
    this.activeCaller = 'police';
    this.callLineIndex = 0;
    this.callStatus = 'ringing';
  }

  private changeLocale(event: Event): void {
    const selectedLocale = (event.currentTarget as HTMLSelectElement).value;
    if (!isSupportedLocale(selectedLocale)) return;

    this.locale = selectedLocale;
    persistLocale(selectedLocale);
  }

  private renderApplication(appId: AppId) {
    if (appId === 'mail') {
      return html`
        <mail-app
          .messages=${CASE_01_MAIL_MESSAGES}
          .readMessageIds=${this.mailReadMessageIds}
          .locale=${this.locale}
          @mail-unread-state-changed=${this.handleMailUnreadState}
          @mail-link-requested=${this.triggerPoliceCall}
        ></mail-app>
      `;
    }

    const definition = getAppDefinition(appId);

    return html`
      <div class="application-placeholder">
        <div>
          <img src=${definition.iconPath} alt="" />
          <p>${translate(this.locale, 'apps.placeholder')}</p>
        </div>
      </div>
    `;
  }
}

customElements.define('game-desktop', GameDesktop);

declare global {
  interface HTMLElementTagNameMap {
    'game-desktop': GameDesktop;
  }
}
