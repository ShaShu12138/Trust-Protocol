import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { translate, type SupportedLocale, type TranslationKey } from '../../localization/i18n';

export type CallStatus = 'ringing' | 'connected';

export interface IncomingCallPresentation {
  id: string;
  callerNameKey?: TranslationKey;
  phoneNumber: string;
  portraitPath: string;
}

export interface CallActionDetail {
  callId: string;
}

export class IncomingCall extends LitElement {
  static styles = css`
    :host { position: fixed; inset: 0; z-index: 21000; display: grid; place-items: center; pointer-events: none; }
    .card { width: 286px; overflow: hidden; color: #282b26; background: #faf7ed; border: 1px solid rgba(42,46,39,.42); border-radius: 13px; box-shadow: 0 18px 46px rgba(25,28,24,.3); transform-origin: 50% 50%; pointer-events: auto; }
    .card.ringing { animation: ring-shake 620ms ease-in-out infinite; }
    .card.connected { position: fixed; top: 22px; right: 22px; }
    .identity { display: grid; grid-template-columns: 64px minmax(0,1fr); gap: 13px; align-items: center; padding: 17px; background: linear-gradient(145deg, #eeeadd, #ddd8ca); border-bottom: 1px solid rgba(42,46,39,.18); }
    .portrait { width: 62px; height: 62px; object-fit: cover; background: #f7f3e8; border: 1px solid rgba(42,46,39,.25); border-radius: 50%; }
    .status { margin: 0 0 5px; color: #657068; font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
    h2 { margin: 0 0 5px; overflow: hidden; font: 600 18px/1.15 Georgia, serif; text-overflow: ellipsis; white-space: nowrap; }
    .number { margin: 0; color: #565a53; font: 12px/1.3 ui-monospace, monospace; }
    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; padding: 12px; }
    .actions.connected { grid-template-columns: 1fr; }
    button { min-height: 42px; padding: 0 12px; color: #fff; border: 0; border-radius: 7px; cursor: pointer; font: 750 12px/1 system-ui, sans-serif; }
    button:focus-visible { outline: 3px solid #d49a34; outline-offset: 2px; }
    .answer { background: #34715c; }
    .decline, .hangup { background: #a9473b; }
    button:hover { filter: brightness(.93); }
    @keyframes ring-shake {
      0%, 100% { transform: translate(0, 0) rotate(0); }
      12% { transform: translate(-3px, 1px) rotate(-.7deg); }
      25% { transform: translate(3px, -1px) rotate(.8deg); }
      38% { transform: translate(-2px, -1px) rotate(-.5deg); }
      52% { transform: translate(2px, 1px) rotate(.6deg); }
      68% { transform: translate(-1px, 0) rotate(-.3deg); }
      82% { transform: translate(1px, 0) rotate(.25deg); }
    }
    @media (max-width: 560px) {
      .card { width: min(286px, calc(100vw - 24px)); }
      .card.connected { top: 12px; right: 12px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .card.ringing { animation: none; box-shadow: 0 0 0 4px rgba(178,122,39,.38), 0 18px 46px rgba(25,28,24,.3); }
    }
  `;

  @property({ attribute: false }) call!: IncomingCallPresentation;
  @property({ attribute: false }) status: CallStatus = 'ringing';
  @property({ attribute: false }) locale: SupportedLocale = 'en';

  render() {
    const connected = this.status === 'connected';
    return html`
      <section
        class="card ${this.status}"
        role=${connected ? 'region' : 'alertdialog'}
        aria-label=${translate(this.locale, connected ? 'call.connectedAriaLabel' : 'call.incomingAriaLabel')}
        aria-live=${connected ? 'polite' : 'assertive'}
      >
        <div class="identity">
          <img class="portrait" src=${this.call.portraitPath} alt="" />
          <div>
            <p class="status">${translate(this.locale, connected ? 'call.connected' : 'call.incoming')}</p>
            <h2>${this.call.callerNameKey
              ? translate(this.locale, this.call.callerNameKey)
              : this.call.phoneNumber}</h2>
            ${this.call.callerNameKey
              ? html`<p class="number">${this.call.phoneNumber}</p>`
              : null}
          </div>
        </div>
        <div class="actions ${connected ? 'connected' : ''}">
          ${connected
            ? html`<button class="hangup" type="button" @click=${() => this.emit('call-ended')}>${translate(this.locale, 'call.hangUp')}</button>`
            : html`
                <button class="decline" type="button" @click=${() => this.emit('call-declined')}>${translate(this.locale, 'call.decline')}</button>
                <button class="answer" type="button" @click=${() => this.emit('call-accepted')}>${translate(this.locale, 'call.answer')}</button>
              `}
        </div>
      </section>
    `;
  }

  private emit(name: string): void {
    this.dispatchEvent(new CustomEvent<CallActionDetail>(name, {
      detail: { callId: this.call.id },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('incoming-call', IncomingCall);

declare global {
  interface HTMLElementTagNameMap { 'incoming-call': IncomingCall; }
}
