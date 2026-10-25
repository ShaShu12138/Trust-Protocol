import { LitElement, css, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { MailMessageDefinition } from '../../content/content-types';
import {
  formatDateTime,
  translate,
  type SupportedLocale,
} from '../../localization/i18n';
import { assetUrl } from '../../ui/asset-url';
import { MailSession, type MailSessionSnapshot } from './mail-session';

interface MailActionDetail {
  messageId: string;
}

interface MailLinkDetail extends MailActionDetail {
  pageId: string;
}

export interface MailUnreadStateDetail {
  unreadCount: number;
  readMessageIds: readonly string[];
}

export class MailApp extends LitElement {
  static styles = css`
    :host { display: block; height: 100%; min-height: 0; color: #292c27; background: #f7f4ea; }
    .shell { display: grid; grid-template-rows: 43px minmax(0, 1fr); height: 100%; }
    .toolbar { display: flex; align-items: center; gap: 10px; padding: 0 14px; background: #e7e3d6; border-bottom: 1px solid #c7c2b3; }
    .toolbar img { width: 22px; height: 22px; }
    .toolbar strong { font-size: 13px; letter-spacing: .04em; }
    .count { margin-left: auto; color: #696b64; font-size: 11px; }
    .workspace { display: grid; grid-template-columns: minmax(150px, 38%) minmax(0, 1fr); min-height: 0; }
    .message-list { overflow: auto; background: #eeeadf; border-right: 1px solid #c7c2b3; }
    .message-button { display: grid; width: 100%; gap: 4px; padding: 12px; color: inherit; background: transparent; border: 0; border-bottom: 1px solid rgba(87, 89, 81, .15); cursor: pointer; text-align: left; }
    .message-button:hover { background: rgba(255,255,255,.45); }
    .message-button.selected { background: #fffdf6; box-shadow: inset 3px 0 #386b5a; }
    .message-button.unread .sender, .message-button.unread .subject { font-weight: 750; }
    .list-head { display: flex; min-width: 0; align-items: baseline; gap: 6px; }
    .sender, .subject, .preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sender { flex: 1; font-size: 12px; }
    time { color: #77796f; font-size: 10px; white-space: nowrap; }
    .subject { font-size: 12px; }
    .preview { color: #77796f; font-size: 11px; }
    .reader { min-width: 0; overflow: auto; padding: 18px 20px 26px; background: #fffdf6; }
    .reader h2 { margin: 0 0 10px; font-family: Georgia, serif; font-size: 20px; font-weight: 600; line-height: 1.2; }
    .sender-row { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; color: #62655d; font-size: 11px; }
    .details-button { padding: 2px 6px; color: #315f51; background: transparent; border: 1px solid #aeb8b0; border-radius: 4px; cursor: pointer; font: inherit; }
    .sender-address { margin: 8px 0 0; padding: 8px 10px; color: #4b4e47; background: #efede5; border-radius: 5px; font: 11px/1.4 ui-monospace, monospace; overflow-wrap: anywhere; }
    .body { margin: 18px 0; color: #3f423c; font-size: 13px; line-height: 1.62; white-space: pre-line; }
    .link-button { display: inline-flex; min-height: 36px; align-items: center; padding: 0 14px; color: #fff; background: #315f51; border: 0; border-radius: 5px; cursor: pointer; font-weight: 700; }
    .link-button:hover { background: #254c40; }
    .empty { display: grid; height: 100%; place-items: center; color: #74766e; font-size: 12px; }
    button:focus-visible { outline: 3px solid #d29b36; outline-offset: -3px; }
    @media (max-width: 520px) {
      .workspace { grid-template-columns: 132px minmax(0, 1fr); }
      .preview { display: none; }
      .reader { padding: 14px; }
      .reader h2 { font-size: 17px; }
    }
  `;

  @property({ attribute: false }) messages: readonly MailMessageDefinition[] = [];
  @property({ attribute: false }) readMessageIds: readonly string[] = [];
  @property({ attribute: false }) locale: SupportedLocale = 'en';

  @state() private sessionState: MailSessionSnapshot = {
    selectedMessageId: null,
    readMessageIds: new Set(),
    senderDetailsMessageId: null,
  };

  private session?: MailSession;

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('messages')) {
      this.session = new MailSession(this.messages, this.readMessageIds);
      this.sessionState = this.session.snapshot;
      this.emitUnreadState();
    }
  }

  render() {
    const selected = this.messages.find(
      (message) => message.id === this.sessionState.selectedMessageId,
    );
    const unreadCount = this.messages.filter(
      (message) => !this.sessionState.readMessageIds.has(message.id),
    ).length;

    return html`
      <section class="shell" aria-label=${translate(this.locale, 'mail.ariaLabel')}>
        <header class="toolbar">
          <img
            src=${unreadCount > 0
              ? assetUrl('/assets/applications/mail/app-mail-unread.svg')
              : assetUrl('/assets/applications/mail/app-mail.svg')}
            alt=""
          />
          <strong>${translate(this.locale, 'mail.inbox')}</strong>
          <span class="count">${translate(this.locale, 'mail.unreadCount', { count: unreadCount })}</span>
        </header>
        <div class="workspace">
          <nav class="message-list" aria-label=${translate(this.locale, 'mail.messageList')}>
            ${this.messages.map((message) => this.renderListItem(message))}
          </nav>
          ${selected ? this.renderMessage(selected) : html`<div class="empty">${translate(this.locale, 'mail.noSelection')}</div>`}
        </div>
      </section>
    `;
  }

  private renderListItem(message: MailMessageDefinition) {
    const selected = message.id === this.sessionState.selectedMessageId;
    const unread = !this.sessionState.readMessageIds.has(message.id);
    return html`
      <button
        class="message-button ${selected ? 'selected' : ''} ${unread ? 'unread' : ''}"
        type="button"
        aria-current=${selected ? 'true' : nothing}
        @click=${() => this.openMessage(message.id)}
      >
        <span class="list-head">
          <span class="sender">${translate(this.locale, message.senderNameKey)}</span>
          <time datetime=${message.timestamp}>${this.formatMessageTime(message.timestamp)}</time>
        </span>
        <span class="subject">${translate(this.locale, message.subjectKey)}</span>
        <span class="preview">${translate(this.locale, message.previewKey)}</span>
      </button>
    `;
  }

  private renderMessage(message: MailMessageDefinition) {
    const detailsVisible = this.sessionState.senderDetailsMessageId === message.id;
    return html`
      <article class="reader" aria-labelledby="mail-subject">
        <h2 id="mail-subject">${translate(this.locale, message.subjectKey)}</h2>
        <div class="sender-row">
          <strong>${translate(this.locale, message.senderNameKey)}</strong>
          <time datetime=${message.timestamp}>${this.formatFullDate(message.timestamp)}</time>
          <button
            class="details-button"
            type="button"
            aria-expanded=${detailsVisible}
            @click=${() => this.toggleSenderDetails(message.id)}
          >${translate(this.locale, detailsVisible ? 'mail.hideSenderDetails' : 'mail.showSenderDetails')}</button>
        </div>
        ${detailsVisible ? html`<p class="sender-address">${translate(this.locale, 'mail.fromAddress', { address: message.senderAddress })}</p>` : nothing}
        <p class="body">${translate(this.locale, message.bodyKey)}</p>
        ${message.link ? html`
          <button class="link-button" type="button" @click=${() => this.requestLink(message)}>
            ${translate(this.locale, message.link!.labelKey)}
          </button>
        ` : nothing}
      </article>
    `;
  }

  private openMessage(messageId: string): void {
    if (!this.session) return;
    this.sessionState = this.session.open(messageId);
    this.emitUnreadState();
    this.emit<MailActionDetail>('mail-message-opened', { messageId });
  }

  private toggleSenderDetails(messageId: string): void {
    if (!this.session) return;
    this.sessionState = this.session.toggleSenderDetails(messageId);
    if (this.sessionState.senderDetailsMessageId === messageId) {
      this.emit<MailActionDetail>('mail-sender-inspected', { messageId });
    }
  }

  private requestLink(message: MailMessageDefinition): void {
    if (!message.link) return;
    this.emit<MailLinkDetail>('mail-link-requested', {
      messageId: message.id,
      pageId: message.link.pageId,
    });
  }

  private emit<T>(name: string, detail: T): void {
    this.dispatchEvent(new CustomEvent<T>(name, { detail, bubbles: true, composed: true }));
  }

  private emitUnreadState(): void {
    const readMessageIds = [...this.sessionState.readMessageIds];
    this.emit<MailUnreadStateDetail>('mail-unread-state-changed', {
      readMessageIds,
      unreadCount: this.messages.length - readMessageIds.length,
    });
  }

  private formatMessageTime(timestamp: string): string {
    return formatDateTime(this.locale, new Date(timestamp), { month: 'short', day: 'numeric' });
  }

  private formatFullDate(timestamp: string): string {
    return formatDateTime(this.locale, new Date(timestamp), {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }
}

customElements.define('mail-app', MailApp);

declare global {
  interface HTMLElementTagNameMap { 'mail-app': MailApp; }
}
