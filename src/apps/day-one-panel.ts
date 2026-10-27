import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { translate, type SupportedLocale, type TranslationKey } from '../localization/i18n';
import { browserAddress, SEARCH_URL, visit, matchesBankSearch } from './browser-navigation';
import { newDayOne, type DayAction, type DayOneState } from '../game/day-one-session';

export class DayOnePanel extends LitElement {
  @property() mode: 'browser' | 'bank' | 'phone' | 'review' = 'browser';
  @property({ attribute: false }) session: DayOneState = newDayOne();
  @property({ attribute: false }) locale: SupportedLocale = 'en';

  @state() private query = '';
  @state() private history = ['about:blank'];
  @state() private historyIndex = 0;
  @state() private addressInput = '';

  private navigate(input: string): void {
    const url = browserAddress(input);
    this.history = visit(this.history, this.historyIndex, url);
    this.historyIndex = this.history.length - 1;
    this.addressInput = url === 'about:blank' ? '' : url;
    this.query = new URL(url).searchParams.get('q') ?? '';
    this.resetScroll();
  }
  private moveHistory(offset: number): void {
    this.historyIndex = Math.max(0, Math.min(this.history.length - 1, this.historyIndex + offset));
    this.addressInput = this.history[this.historyIndex] === 'about:blank' ? '' : this.history[this.historyIndex];
    this.query = new URL(this.history[this.historyIndex]).searchParams.get('q') ?? '';
    this.resetScroll();
  }
  private resetScroll(): void {
    void this.updateComplete.then(() => this.renderRoot.querySelector('.web-content')?.scrollTo(0, 0));
  }

  static styles = css`
    :host { display:block; height:100%; min-height:0; color:#29362f; font:14px/1.6 system-ui,sans-serif; }
    * { box-sizing:border-box; } .page { height:100%; overflow:auto; background:#faf8f0; }
    input { width:100%;padding:12px;border:1px solid #a3b0a1;border-radius:6px;font:inherit;margin-bottom:12px; }
    .hero { background:#183f37;color:#fff;padding:28px;border-radius:8px; }
    .browser { height:100%;display:flex;flex-direction:column;background:white;color:#202124; }
    .browser-chrome { background:#dee2e8;padding:8px 10px;border-bottom:1px solid #c3c7ce; }
    .tab { background:#f7f8fa;border-radius:9px 9px 0 0;padding:6px 14px;width:210px;max-width:80%;font-size:12px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis; }
    .navigation { display:flex;align-items:center;gap:5px;padding-top:7px; }
    .navigation button { border:0;background:transparent;padding:6px 9px;color:#34383e;font-size:18px; }
    .navigation form { flex:1;min-width:0; }
    .navigation input { margin:0;border:1px solid #ccd0d6;border-radius:20px;background:#f7f8fa;padding:7px 14px;font-size:12px; }
    .web-content { flex:1;min-height:0;overflow:auto;background:#fff; }
    .web-content main { max-width:880px;margin:auto; }
    .search-start { text-align:center;padding-top:64px; }
    .search-brand { font:500 42px system-ui;color:#376ac3;letter-spacing:-2px;margin:0 0 24px; }
    .search-form { display:flex;gap:8px;align-items:center;margin-bottom:20px; }
    .search-form input { min-width:0;margin:0;border-radius:24px;box-shadow:0 1px 5px #20212415; }
    .search-form button { flex-shrink:0;white-space:nowrap;border-radius:20px;background:#f4f6fa;border-color:#e1e5eb;color:#2457ad; }
    .web-content main > div:not(.search-start) > .search-brand { font-size:25px;letter-spacing:-1px;margin-bottom:12px; }
    .search-filter { border-bottom:1px solid #ddd;color:#386ac2;padding:8px 0; }
    .result { margin:24px 0; }
    .result a { color:#244fa6;font:20px/1.3 system-ui;text-decoration:none; }
    .result a:hover { text-decoration:underline; }
    .result p { margin:5px 0;font-size:13px;color:#50545a; }
    .result .muted { color:#4b5158;font-size:12px;margin-bottom:5px; }
    .news-head { border-bottom:2px solid #252b35;padding:14px 0;margin-bottom:30px;font:700 28px Georgia; }

    header { padding:14px 22px; background:#e9ece2; border-bottom:1px solid #c6cebf; }
    main { padding:20px 24px 28px; } h1 { font:600 28px/1.2 Georgia,serif; margin:6px 0 18px; }
    h2 { font-size:15px; margin:18px 0 10px; } p { margin:10px 0 18px; }
    button { padding:10px 14px; border:1px solid #a3b0a1; border-radius:6px; background:#fffef8; color:#254a3e; font:600 13px/1.4 system-ui,sans-serif; cursor:pointer; }
    button:hover { background:#e2eadf; } button:focus-visible { outline:3px solid #bc7d25; outline-offset:3px; }
    button:disabled { opacity:.55; cursor:default; } .primary { background:#315f51; color:white; border-color:#315f51; }
    .primary:hover { background:#244b40; } .row { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
    .card { border:1px solid #d0d4c8; border-radius:8px; padding:16px; margin:14px 0; background:#fffef9; }
    .address { display:block; font:12px/1.6 ui-monospace,monospace; background:white; border:1px solid #c7cec2; border-radius:5px; padding:8px; overflow-wrap:anywhere; }
    .eyebrow { font-size:11px; letter-spacing:.09em; text-transform:uppercase; color:#647367; }
    .notice { border-left:3px solid #a6752e; padding:10px 14px; background:#f4ecda; }
    .muted { font-size:12px; color:#637064; } ul { padding-left:20px; } li { margin:8px 0; }
    dialog { border:1px solid #9fae9f; border-radius:12px; padding:0; width:min(720px,92vw); max-height:85vh; background:#faf8f0; color:inherit; box-shadow:0 24px 80px #18251e55; }
    dialog::backdrop { background:#1c292c99; } dialog main { max-height:80vh; overflow:auto; }
    dialog .page { height:auto; } .footer { margin-top:24px; padding-top:16px; border-top:1px solid #d0d4c8; }
    @media (prefers-reduced-motion: no-preference) {
      dialog { animation: fade-in 600ms ease-out; }
      @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
    }
  `;


  protected updated(): void {
    const dialog = this.renderRoot.querySelector('dialog');
    if (dialog && !dialog.open) dialog.showModal();
  }
  private t(key: TranslationKey): string { return translate(this.locale, key); }
  private act(action: DayAction): void {
    this.dispatchEvent(new CustomEvent('day-action', { detail: action, bubbles: true, composed: true }));
  }
  render() {
    const s = this.session;
    if (this.mode === 'review') return html`<dialog aria-labelledby="ending" @cancel=${(e: Event) => e.preventDefault()}>
      <main style="text-align:center;padding:64px 30px"><span class="eyebrow">TRUST PROTOCOL</span>
      <h1 id="ending">${this.t('linear.ending')}</h1><p>${this.t('linear.playtest')}</p>
      <button @click=${() => this.dispatchEvent(new CustomEvent('day-restart', {bubbles:true, composed:true}))}>${this.t('d1.restart')}</button></main>
    </dialog>`;
    if (this.mode === 'bank') return html`<section class="page"><header>NOVA BANK · ${this.t('bank.account')}</header><main>
      <span class="eyebrow">${this.t('bank.balance')}</span><h1>€ 2.846,70</h1><p>•••• 4821</p>
      <h2>${this.t('bank.pending')}</h2><div class="card">${this.t('bank.none')}</div>
      <h2>${this.t('bank.completed')}</h2><div class="card">20/09 · ${this.t('d1.bank.coffee')}</div>
      <div class="card">19/09 · Market Square · − € 38,65</div><div class="card">18/09 · Metro · − € 3,40</div>
      <p class="muted">${this.t('bank.updated')}</p></main></section>`;
    if (this.mode === 'phone') return html`<section class="page"><main><h1>${this.t('apps.phone.title')}</h1>
      <p>${this.t('linear.phone')}</p>${s.phase === 'intro' && !s.call ? html`<button @click=${() => this.act('retry')}>${this.t('linear.recall')}</button>` : ''}
    </main></section>`;
    const address = this.history[this.historyIndex];
    const isHome = address === 'about:blank';
    const url = new URL(address);
    const isSearch = url.origin === new URL(SEARCH_URL).origin;
    const search = url.searchParams.get('q') ?? '';
    const isBank = ['novabank.nl', 'www.novabank.nl'].includes(url.hostname);
    const article = url.hostname === 'dailyledger.nl' ? 'search.news' : url.hostname === 'moneyguide.nl' ? 'search.compare' : '';
    const title = isHome ? this.t('browser.newtab') : isBank ? 'Nova Bank' : isSearch ? search : article ? this.t(article) : this.t('browser.unavailable');
    const go = (event: Event, target: string) => { event.preventDefault(); this.navigate(target); };
    return html`<section class="browser">
      <div class="browser-chrome"><div class="tab">${title}</div><nav class="navigation">
        <button aria-label=${this.t('browser.back')} title=${this.t('browser.back')} ?disabled=${this.historyIndex === 0} @click=${() => this.moveHistory(-1)}>←</button>
        <button aria-label=${this.t('browser.forward')} title=${this.t('browser.forward')} ?disabled=${this.historyIndex === this.history.length - 1} @click=${() => this.moveHistory(1)}>→</button>
        <button aria-label=${this.t('browser.reload')} title=${this.t('browser.reload')} @click=${() => { this.addressInput = isHome ? '' : address; this.query = search; this.resetScroll(); }}>↻</button>
        <form @submit=${(event: Event) => go(event, this.addressInput)}><input aria-label=${this.t('browser.address')} placeholder=${this.t('browser.address')} .value=${this.addressInput} @focus=${(event: FocusEvent) => (event.target as HTMLInputElement).select()} @input=${(event: Event) => { this.addressInput = (event.target as HTMLInputElement).value; }}></form>
      </nav></div>
      <div class="web-content"><main>
      ${isHome || isSearch ? html`<div class=${isHome ? 'search-start' : ''}><div class="search-brand">Search</div>
        <form class="search-form" @submit=${(event: Event) => go(event, `${SEARCH_URL}?q=${encodeURIComponent(this.query.trim())}`)}>
          <input aria-label=${this.t('search.title')} placeholder=${this.t('search.placeholder')} .value=${this.query} @input=${(event: Event) => { this.query = (event.target as HTMLInputElement).value; }}>
          <button>${this.t('search.submit')}</button>
        </form></div>
        ${isSearch ? html`<div class="search-filter">${this.t('search.all')} · ${search}</div>
          ${matchesBankSearch(search) ? html`
            <article class="result"><div class="muted">Nova Bank · https://www.novabank.nl</div><a href="https://www.novabank.nl" @click=${(event: Event) => go(event, 'https://www.novabank.nl')}>Nova Bank — ${this.t('site.tagline')}</a><p>${this.t('site.summary')}</p></article>
            <article class="result"><div class="muted">Daily Ledger · https://dailyledger.nl/economy/nova</div><a href="https://dailyledger.nl/economy/nova" @click=${(event: Event) => go(event, 'https://dailyledger.nl/economy/nova')}>${this.t('search.news')}</a><p>${this.t('search.news.body')}</p></article>
            <article class="result"><div class="muted">Money Guide · https://moneyguide.nl/banking</div><a href="https://moneyguide.nl/banking" @click=${(event: Event) => go(event, 'https://moneyguide.nl/banking')}>${this.t('search.compare')}</a><p>${this.t('search.compare.body')}</p></article>
          ` : html`<p>${this.t('search.empty')}</p>`}
        ` : ''}
      ` : article ? html`<div class="news-head">${article === 'search.news' ? 'Daily Ledger' : 'Money Guide'}</div><h1>${this.t(article)}</h1><p>${this.t(article === 'search.news' ? 'search.news.body' : 'search.compare.body')}</p>` : !isBank ? html`<h1>${this.t('browser.unavailable')}</h1><p>${url.hostname}</p>` : html`
        <div class="row"><strong style="font:700 24px Georgia">NOVA BANK</strong><button @click=${() => this.renderRoot.querySelector('#contact')?.scrollIntoView({block:'start'})}>${this.t('site.contact')}</button></div>
        <section class="hero"><span class="eyebrow" style="color:#c1dace">${this.t('site.personal')}</span><h1>${this.t('site.tagline')}</h1><p>${this.t('site.summary')}</p></section>
        <div class="card"><h2>${this.t('site.accounts')}</h2><p>${this.t('site.accounts.body')}</p></div>
        <div class="card"><h2>${this.t('site.savings')}</h2><p>${this.t('site.savings.body')}</p></div>
        <div class="card"><h2>${this.t('site.security')}</h2><p>${this.t('site.security.body')}</p></div>
        <footer id="contact" class="footer"><h2>${this.t('site.contact')}</h2><p>${this.t('site.hours')}</p>
          <p>${this.t('site.email')}<br><strong>service@novabank.nl</strong></p><p>${this.t('site.domains')}<br><strong>@novabank.nl</strong></p>
          <p class="muted">© 2026 Nova Bank · ${this.t('site.personal')}</p></footer>
      `}</main></div></section>`;
  }
}
customElements.define('day-one-panel', DayOnePanel);
