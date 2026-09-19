import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  translate,
  type SupportedLocale,
} from '../localization/i18n';
import type {
  DesktopWindowState,
  WindowIdDetail,
  WindowMoveDetail,
} from './window-state';

interface DragSession {
  pointerId: number;
  pointerStartX: number;
  pointerStartY: number;
  windowStartX: number;
  windowStartY: number;
}

export class AppWindow extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: absolute;
      inset: 0 auto auto 0;
      pointer-events: none;
    }

    .window {
      position: absolute;
      display: grid;
      grid-template-rows: 42px minmax(0, 1fr);
      min-width: 260px;
      min-height: 180px;
      overflow: hidden;
      color: #252822;
      background: #f7f3e8;
      border: 1px solid rgba(51, 54, 47, 0.38);
      border-radius: 10px;
      box-shadow: 0 18px 45px rgba(32, 34, 29, 0.19);
      pointer-events: auto;
      transition: box-shadow 120ms ease;
      will-change: transform;
    }

    .window.focused {
      border-color: rgba(38, 42, 35, 0.72);
      box-shadow:
        0 23px 58px rgba(29, 31, 26, 0.28),
        0 0 0 1px rgba(255, 255, 255, 0.55) inset;
    }

    .titlebar {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      padding: 0 8px 0 14px;
      color: #252822;
      background: #dfdacc;
      border-bottom: 1px solid rgba(51, 54, 47, 0.24);
      cursor: grab;
      user-select: none;
      touch-action: none;
    }

    .titlebar.dragging {
      cursor: grabbing;
    }

    .title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      font-size: 13px;
      font-weight: 650;
      letter-spacing: 0.02em;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .control {
      display: grid;
      width: 30px;
      height: 30px;
      padding: 0;
      place-items: center;
      color: inherit;
      background: transparent;
      border: 0;
      border-radius: 6px;
      cursor: pointer;
    }

    .control:hover {
      background: rgba(37, 40, 34, 0.1);
    }

    .control.close:hover {
      color: #fff;
      background: #a9473b;
    }

    .window-body {
      min-width: 0;
      min-height: 0;
      background:
        linear-gradient(rgba(47, 51, 44, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(47, 51, 44, 0.035) 1px, transparent 1px),
        #f7f3e8;
      background-size: 20px 20px;
    }

    @media (prefers-reduced-motion: reduce) {
      .window {
        transition: none;
      }
    }
  `;

  @property({ attribute: false })
  windowState!: DesktopWindowState;

  @property({ type: Boolean })
  focused = false;

  @property({ attribute: false })
  desktopBounds!: DOMRectReadOnly;

  @property({ attribute: false })
  locale: SupportedLocale = 'en';

  @state()
  private previewX: number | null = null;

  @state()
  private previewY: number | null = null;

  private dragSession: DragSession | null = null;

  render() {
    const x = this.previewX ?? this.windowState.x;
    const y = this.previewY ?? this.windowState.y;
    const title = translate(this.locale, this.windowState.titleKey);

    return html`
      <section
        class="window ${this.focused ? 'focused' : ''}"
        style=${`width:${this.windowState.width}px;height:${this.windowState.height}px;transform:translate3d(${x}px,${y}px,0);z-index:${this.windowState.zIndex};`}
        aria-label=${title}
        @pointerdown=${this.handleWindowPointerDown}
      >
        <header
          class="titlebar ${this.dragSession ? 'dragging' : ''}"
          @pointerdown=${this.startDrag}
          @pointermove=${this.continueDrag}
          @pointerup=${this.endDrag}
          @pointercancel=${this.cancelDrag}
        >
          <span class="title">${title}</span>
          <div class="controls">
            <button
              class="control"
              type="button"
              aria-label=${translate(this.locale, 'window.minimize', { title })}
              @pointerdown=${this.stopControlPointerDown}
              @click=${this.minimize}
            >
              −
            </button>
            <button
              class="control close"
              type="button"
              aria-label=${translate(this.locale, 'window.close', { title })}
              @pointerdown=${this.stopControlPointerDown}
              @click=${this.close}
            >
              ×
            </button>
          </div>
        </header>
        <div class="window-body" aria-hidden="true"></div>
      </section>
    `;
  }

  private handleWindowPointerDown(): void {
    this.emitWindowEvent<WindowIdDetail>('window-focus', {
      id: this.windowState.id,
    });
  }

  private stopControlPointerDown(event: PointerEvent): void {
    event.stopPropagation();
  }

  private startDrag(event: PointerEvent): void {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button')) {
      return;
    }

    this.handleWindowPointerDown();
    this.dragSession = {
      pointerId: event.pointerId,
      pointerStartX: event.clientX,
      pointerStartY: event.clientY,
      windowStartX: this.windowState.x,
      windowStartY: this.windowState.y,
    };
    this.previewX = this.windowState.x;
    this.previewY = this.windowState.y;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.requestUpdate();
  }

  private continueDrag(event: PointerEvent): void {
    if (!this.dragSession || event.pointerId !== this.dragSession.pointerId) {
      return;
    }

    const proposedX =
      this.dragSession.windowStartX +
      event.clientX -
      this.dragSession.pointerStartX;
    const proposedY =
      this.dragSession.windowStartY +
      event.clientY -
      this.dragSession.pointerStartY;

    const visibleTitleWidth = Math.min(120, this.windowState.width);
    const minX = -this.windowState.width + visibleTitleWidth;
    const maxX = Math.max(0, this.desktopBounds.width - visibleTitleWidth);
    const minY = 0;
    const maxY = Math.max(0, this.desktopBounds.height - 42);

    this.previewX = Math.min(Math.max(proposedX, minX), maxX);
    this.previewY = Math.min(Math.max(proposedY, minY), maxY);
  }

  private endDrag(event: PointerEvent): void {
    if (!this.dragSession || event.pointerId !== this.dragSession.pointerId) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }

    this.emitWindowEvent<WindowMoveDetail>('window-move', {
      id: this.windowState.id,
      x: this.previewX ?? this.windowState.x,
      y: this.previewY ?? this.windowState.y,
    });
    this.clearDrag();
  }

  private cancelDrag(): void {
    this.clearDrag();
  }

  private clearDrag(): void {
    this.dragSession = null;
    this.previewX = null;
    this.previewY = null;
    this.requestUpdate();
  }

  private minimize(event: MouseEvent): void {
    event.stopPropagation();
    this.emitWindowEvent<WindowIdDetail>('window-minimize', {
      id: this.windowState.id,
    });
  }

  private close(event: MouseEvent): void {
    event.stopPropagation();
    this.emitWindowEvent<WindowIdDetail>('window-close', {
      id: this.windowState.id,
    });
  }

  private emitWindowEvent<T>(name: string, detail: T): void {
    this.dispatchEvent(
      new CustomEvent<T>(name, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define('app-window', AppWindow);

declare global {
  interface HTMLElementTagNameMap {
    'app-window': AppWindow;
  }
}
