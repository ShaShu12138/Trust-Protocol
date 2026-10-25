import { LitElement, css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { translate, type SupportedLocale, type TranslationKey } from '../localization/i18n';

export type DialogueKind = 'tutorial' | 'hint' | 'call';

export interface DialogueActionDefinition {
  id: string;
  labelKey: TranslationKey;
}

export interface DialoguePresentation {
  id: string;
  kind: DialogueKind;
  eyebrowKey: TranslationKey;
  speakerKey: TranslationKey;
  bodyKey: TranslationKey;
  imagePath?: string;
  imageAltKey?: TranslationKey;
  step?: number;
  stepCount?: number;
  primaryAction?: DialogueActionDefinition;
  secondaryAction?: DialogueActionDefinition;
}

export interface DialogueActionDetail {
  presentationId: string;
  actionId: string;
}

export class DialoguePanel extends LitElement {
  static styles = css`
    :host { position: fixed; inset: 0; z-index: 20000; display: grid; place-items: end center; padding: 24px 24px 88px; box-sizing: border-box; background: rgba(35, 38, 33, .42); }
    :host([non-modal]) { place-items: end end; pointer-events: none; background: transparent; }
    :host([non-modal]) .panel { width: min(650px, calc(100vw - 48px)); }
    .backdrop { display: none; }
    .panel { position: relative; z-index: 1; display: grid; grid-template-columns: 108px minmax(0, 1fr); width: min(760px, calc(100vw - 48px)); min-height: 180px; overflow: hidden; color: #282b26; background: #fbf8ee; border: 1px solid rgba(43, 47, 40, .38); border-radius: 12px; box-shadow: 0 22px 58px rgba(28, 31, 27, .32); pointer-events: auto; }
    .panel::before { position: absolute; inset: 0 auto 0 0; width: 5px; background: #58738d; content: ''; }
    .panel[data-kind='hint']::before { background: #b27a27; }
    .panel[data-kind='call']::before { background: #356b59; }
    .portrait { display: grid; place-items: center; padding: 20px 10px 20px 17px; background: linear-gradient(150deg, #ded9cb, #c9c5ba); border-right: 1px solid rgba(43,47,40,.18); }
    .portrait img { width: 74px; height: 74px; object-fit: cover; border: 1px solid rgba(43,47,40,.25); border-radius: 50%; background: rgba(255,255,255,.45); }
    .content { display: grid; grid-template-rows: auto auto 1fr auto; min-width: 0; padding: 20px 22px 18px; }
    .meta { display: flex; align-items: center; gap: 10px; color: #687068; font-size: 10px; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
    .progress { margin-left: auto; font-variant-numeric: tabular-nums; }
    h2 { margin: 7px 0 5px; font-family: Georgia, serif; font-size: 23px; font-weight: 600; line-height: 1.15; }
    .body { max-width: 62ch; margin: 4px 0 18px; color: #484c45; font-size: 14px; line-height: 1.58; white-space: pre-line; }
    .actions { display: flex; justify-content: flex-end; gap: 9px; }
    button { min-height: 38px; padding: 0 16px; border-radius: 6px; cursor: pointer; font: 700 12px/1 system-ui, sans-serif; }
    .secondary { color: #444841; background: transparent; border: 1px solid #aaa99f; }
    .primary { color: #fff; background: #315f51; border: 1px solid #315f51; }
    button:hover { filter: brightness(.94); }
    button:focus-visible { outline: 3px solid #d49a34; outline-offset: 2px; }
    @media (max-width: 560px) {
      :host { padding: 14px 14px 80px; }
      .panel { grid-template-columns: 1fr; width: 100%; }
      :host([non-modal]) .panel { width: 100%; }
      .portrait { display: none; }
      .content { padding: 18px; }
      h2 { font-size: 20px; }
      .actions { flex-wrap: wrap; }
    }
    @media (prefers-reduced-motion: no-preference) {
      .panel { animation: enter 180ms ease-out; }
      @keyframes enter { from { opacity: 0; transform: translateY(12px); } }
    }
  `;

  @property({ attribute: false }) presentation!: DialoguePresentation;
  @property({ attribute: false }) locale: SupportedLocale = 'en';
  @property({ type: Boolean, attribute: 'non-modal', reflect: true }) nonModal = false;

  protected firstUpdated(): void {
    this.focusPrimaryAction();
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('presentation')) this.focusPrimaryAction();
  }

  render() {
    const item = this.presentation;
    if (!item) return nothing;

    return html`
      <div class="backdrop" aria-hidden="true"></div>
      <section
        class="panel"
        data-kind=${item.kind}
        role="dialog"
        aria-modal=${this.nonModal ? 'false' : 'true'}
        aria-labelledby="dialogue-speaker"
        aria-describedby="dialogue-body"
        @keydown=${this.handleKeydown}
      >
        <div class="portrait">
          ${item.imagePath
            ? html`<img src=${item.imagePath} alt=${item.imageAltKey ? translate(this.locale, item.imageAltKey) : ''} />`
            : nothing}
        </div>
        <div class="content">
          <div class="meta">
            <span>${translate(this.locale, item.eyebrowKey)}</span>
            ${item.step && item.stepCount
              ? html`<span class="progress">${translate(this.locale, 'dialogue.progress', { current: item.step, total: item.stepCount })}</span>`
              : nothing}
          </div>
          <h2 id="dialogue-speaker">${translate(this.locale, item.speakerKey)}</h2>
          <p class="body" id="dialogue-body">${translate(this.locale, item.bodyKey)}</p>
          <div class="actions">
            ${item.secondaryAction
              ? html`<button class="secondary" type="button" @click=${() => this.emitAction('dialogue-secondary', item.secondaryAction!)}>${translate(this.locale, item.secondaryAction.labelKey)}</button>`
              : nothing}
            ${item.primaryAction
              ? html`<button class="primary" type="button" @click=${() => this.emitAction('dialogue-primary', item.primaryAction!)}>${translate(this.locale, item.primaryAction.labelKey)}</button>`
              : nothing}
          </div>
        </div>
      </section>
    `;
  }

  private focusPrimaryAction(): void {
    if (this.nonModal) return;
    requestAnimationFrame(() => this.renderRoot.querySelector<HTMLButtonElement>('.primary, .secondary')?.focus());
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.presentation.secondaryAction) {
      event.preventDefault();
      this.emitAction('dialogue-secondary', this.presentation.secondaryAction);
      return;
    }

    if (event.key !== 'Tab') return;
    const buttons = Array.from(this.renderRoot.querySelectorAll<HTMLButtonElement>('button'));
    if (buttons.length < 2) return;
    const activeIndex = buttons.indexOf(this.shadowRoot?.activeElement as HTMLButtonElement);
    const nextIndex = event.shiftKey
      ? (activeIndex <= 0 ? buttons.length - 1 : activeIndex - 1)
      : (activeIndex + 1) % buttons.length;
    event.preventDefault();
    buttons[nextIndex].focus();
  }

  private emitAction(name: string, action: DialogueActionDefinition): void {
    this.dispatchEvent(new CustomEvent<DialogueActionDetail>(name, {
      detail: { presentationId: this.presentation.id, actionId: action.id },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('dialogue-panel', DialoguePanel);

declare global {
  interface HTMLElementTagNameMap { 'dialogue-panel': DialoguePanel; }
}
