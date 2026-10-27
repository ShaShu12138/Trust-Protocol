import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import {
  APP_DEFINITIONS,
  type AppId,
} from '../apps/app-registry';
import '../apps/mail/mail-app';
import type { MailUnreadStateDetail } from '../apps/mail/mail-app';
import '../apps/phone/incoming-call';
import { CASE_01_MAIL_MESSAGES } from '../content/cases/case-01';
import {
  DAY_01_POLICE_CALL,
  DAY_01_SUSPICIOUS_CALL,
  DAY_01_SUSPICIOUS_CALL_LINES,
} from '../content/calls/day-01-demo-call';
import '../apps/day-one-panel';
import { newDayOne, stepDayOne, parseDayOne, DAY_ONE_SAVE_KEY, type DayAction } from '../game/day-one-session';
import type { DialoguePresentation } from '../ui/dialogue-panel';
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
const DAY_ONE_MAIL_MESSAGES = CASE_01_MAIL_MESSAGES.filter(message => message.id === 'mail.nova-security-review');

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
      overflow-x: auto;
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

  @state() private day = newDayOne();
  @state() private restartConfirm = false;
  @state() private storageWarning: 'd1.storage' | 'd1.corrupt' | null = null;
  @state()
  private mailReadMessageIds: readonly string[] = CASE_01_MAIL_MESSAGES
    .filter((message) => message.initiallyRead)
    .map((message) => message.id);

  private resizeObserver?: ResizeObserver;
  private repeatCallTimeout?: number;
  private endingTimeout?: number;

  connectedCallback(): void {
    super.connectedCallback();
    persistLocale(this.locale);
    try {
      const raw = window.localStorage.getItem(DAY_ONE_SAVE_KEY);
      if (raw) {
        const restored = parseDayOne(raw);
        if (restored) this.day = restored;
        else this.storageWarning = 'd1.corrupt';
      }
    } catch { this.storageWarning = 'd1.storage'; }
    this.scheduleStory();
    this.addEventListener('window-focus', this.handleFocus as EventListener);
    this.addEventListener('window-move', this.handleMove as EventListener);
    this.addEventListener('window-minimize', this.handleMinimize as EventListener);
    this.addEventListener('window-resize', this.handleResize as EventListener);
    this.addEventListener('window-close', this.handleClose as EventListener);
  }

  disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    window.clearTimeout(this.endingTimeout);
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
          <button class="task-button" @click=${() => { this.restartConfirm = true; }}>${translate(this.locale, 'd1.restart')}</button>
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

        ${this.storageWarning ? html`<p role="status" style="position:absolute;top:0;right:16px;max-width:420px;background:#fff4d9;padding:10px;z-index:11000">${translate(this.locale, this.storageWarning)}</p>` : null}
        ${this.day.call ? html`
          <incoming-call .call=${this.callPresentation} .status=${this.day.call} .locale=${this.locale}
            @call-accepted=${() => this.dispatchDay('answer')} @call-declined=${() => this.dispatchDay('hangup')} @call-ended=${() => this.dispatchDay('hangup')}></incoming-call>
        ` : null}
        ${this.day.call === 'connected' || (['police', 'callback'].includes(this.day.phase) && !this.day.call) ? html`
          <dialogue-panel non-modal .nonModal=${true} .presentation=${this.callDialogue} .locale=${this.locale}
            @dialogue-primary=${() => this.dispatchDay(this.day.phase === 'intro' && this.day.line === 0 ? 'mine' : 'next')}
            @dialogue-secondary=${() => this.dispatchDay('not-mine')}></dialogue-panel>
        ` : null}
        ${this.day.phase === 'review' && !this.restartConfirm ? html`
          <day-one-panel mode="review" .session=${this.day} .locale=${this.locale}
            @day-restart=${() => { this.restartConfirm = true; }}></day-one-panel>
        ` : null}
        ${this.restartConfirm ? html`
          <dialogue-panel .locale=${this.locale} .presentation=${this.message('d1.restart.title', 'd1.restart.body', 'd1.restart', 'd1.no')}
            @dialogue-primary=${this.restartDay} @dialogue-secondary=${() => { this.restartConfirm = false; }}></dialogue-panel>
        ` : null}
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
    const window = createAppWindow(appId);
    window.width = Math.max(window.minWidth, Math.min(window.width, this.desktopBounds.width - 24));
    window.height = Math.max(window.minHeight, Math.min(window.height, this.desktopBounds.height - 24));
    window.x = Math.max(0, Math.min(window.x, this.desktopBounds.width - window.width - 12));
    window.y = Math.max(0, Math.min(window.y, this.desktopBounds.height - window.height - 12));
    this.windows = this.windowManager.open(window);
  }

  private get mailUnreadCount(): number {
    return this.mailReadMessageIds.includes('mail.nova-security-review') ? 0 : 1;
  }

  private handleMailUnreadState(
    event: CustomEvent<MailUnreadStateDetail>,
  ): void {
    this.mailReadMessageIds = [...event.detail.readMessageIds];
  }

  private message(title: DialoguePresentation['speakerKey'], body: DialoguePresentation['bodyKey'], primary: DialoguePresentation['speakerKey'], secondary?: DialoguePresentation['speakerKey']): DialoguePresentation {
    return { id: title, kind: 'hint', eyebrowKey: 'd1.day', speakerKey: title, bodyKey: body,
      primaryAction: { id: 'confirm', labelKey: primary },
      secondaryAction: secondary ? { id: 'cancel', labelKey: secondary } : undefined };
  }


  private get callPresentation() {
    return ['police', 'callback'].includes(this.day.phase) ? DAY_01_POLICE_CALL : DAY_01_SUSPICIOUS_CALL;
  }
  private get callDialogue(): DialoguePresentation {
    if (this.day.phase === 'callback') return { id: 'callback', kind: 'call', eyebrowKey: 'dialogue.kind.call', speakerKey: 'day01.call.police.name', bodyKey: `report.feedback.${this.day.reason!}`, primaryAction: { id: 'continue', labelKey: 'dialogue.continue' } };
    if (this.day.phase !== 'police') return DAY_01_SUSPICIOUS_CALL_LINES[this.day.line];
    const lines = ['day01.call.police.stop', 'linear.police.leak', 'linear.police.method', 'linear.police.mark'] as const;
    return { id: 'police.' + this.day.line, kind: 'call', eyebrowKey: 'dialogue.kind.call',
      speakerKey: 'day01.call.police.name', bodyKey: lines[this.day.line],
      shakeEmphasis: this.day.line === 0,
      primaryAction: {id:'continue', labelKey: this.day.line === 3 ? 'linear.check' : 'dialogue.continue'} };
  }

  private persistDay(): void {
    try { window.localStorage.setItem(DAY_ONE_SAVE_KEY, JSON.stringify(this.day)); }
    catch { this.storageWarning = 'd1.storage'; }
  }


  private scheduleStory(): void {
    window.clearTimeout(this.repeatCallTimeout);
    window.clearTimeout(this.endingTimeout);
    if (this.day.phase === 'intro' && !this.day.call && !this.day.retryUsed) {
      this.repeatCallTimeout = window.setTimeout(() => this.dispatchDay('retry'), 3000);
    }
    if (this.day.phase === 'intro' && this.day.line === 1 && this.day.call === 'connected') {
      this.repeatCallTimeout = window.setTimeout(() => this.dispatchDay('next'), 6500);
    }
    if (this.day.phase === 'stamped') {
      this.endingTimeout = window.setTimeout(() => this.dispatchDay('callback'), 3500);
    }
  }
  private dispatchDay(action: DayAction): void {
    const previous = this.day;
    this.day = stepDayOne(previous, action);
    this.persistDay();
    this.scheduleStory();
  }

  private readonly restartDay = (): void => {
    if (this.repeatCallTimeout !== undefined) window.clearTimeout(this.repeatCallTimeout);
    for (const window of this.windows) this.windowManager.close(window.id);
    this.windows = this.windowManager.snapshot;
    this.day = newDayOne();
    this.mailReadMessageIds = CASE_01_MAIL_MESSAGES.filter(m => m.initiallyRead).map(m => m.id);
    this.restartConfirm = false;
    this.scheduleStory();
    this.persistDay();
  };

  private readonly followMailLink = (event: CustomEvent<{ pageId: string }>): void => {
    if (event.detail.pageId !== 'page.nova-review-fake') return;
    this.dispatchDay('link');
  };

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
          .messages=${DAY_ONE_MAIL_MESSAGES}
          .readMessageIds=${this.mailReadMessageIds}
          .locale=${this.locale}
          .linksEnabled=${this.day.phase === 'email'}
          .markingEnabled=${this.day.phase === 'verify'}
          .markedMessageId=${['stamped', 'callback', 'review'].includes(this.day.phase) ? 'mail.nova-security-review' : ''}
          @mail-message-flagged=${(event: CustomEvent<{messageId: string; reason: DayAction}>) => {
            if (event.detail.messageId === 'mail.nova-security-review') this.dispatchDay(event.detail.reason);
          }}
          @mail-unread-state-changed=${this.handleMailUnreadState}
          @mail-link-requested=${this.followMailLink}
        ></mail-app>
      `;
    }

    return html`<day-one-panel .mode=${appId} .session=${this.day} .locale=${this.locale}
      @day-action=${(event: CustomEvent<DayAction>) => this.dispatchDay(event.detail)}></day-one-panel>`;
  }
}

customElements.define('game-desktop', GameDesktop);

declare global {
  interface HTMLElementTagNameMap {
    'game-desktop': GameDesktop;
  }
}
