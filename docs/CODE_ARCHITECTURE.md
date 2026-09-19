# Trust Protocol — Code Architecture

## Purpose

This document records technical decisions and boundaries for the project. Update it whenever the architecture, development workflow, or technical scope changes.

The current milestone contains only:

- a simulated desktop surface;
- generic empty windows;
- window dragging;
- window focus and stacking;
- minimizing, restoring, and closing windows through basic desktop controls.
- a localization foundation with English, Simplified Chinese, and Dutch resources.

It intentionally contains no game applications, narrative content, backend, database, or real web browsing.

## Technology choices

### Vite

Vite provides the local development server and production build. The project uses the `lit-ts` style of setup without additional framework layers.

### Lit

Lit is used to build standards-based Web Components. The desktop and each future application can remain independent components with explicit properties and custom events.

### TypeScript

TypeScript defines stable contracts for window state and events. This matters because later milestones will introduce multiple applications that all interact with the same desktop shell.

### Native Pointer Events

Dragging uses browser Pointer Events rather than a drag-and-drop dependency. The current interaction is small enough that a third-party library would add more complexity than value.

## Current structure

```text
src/
├── main.ts
├── desktop/
│   ├── app-window.ts
│   ├── game-desktop.ts
│   ├── window-manager.ts
│   └── window-state.ts
└── styles/
    └── global.css
```

### `game-desktop`

The root component owns the desktop surface and the current list of windows. It:

- renders visible windows;
- measures the draggable desktop area;
- listens for window events;
- renders the taskbar;
- delegates state mutations to `WindowManager`.

It should remain an orchestrator. Future email, browser, bank, or phone behavior must not be implemented directly inside this component.

### `app-window`

`app-window` is a generic window frame. It owns presentation and pointer interaction but does not own authoritative window state.

It currently provides:

- a title bar;
- an empty content area;
- pointer-driven dragging;
- a minimum visible title-bar boundary;
- minimize and close buttons;
- focused and unfocused appearance.

During a drag it stores only a temporary preview position. When the drag ends, it emits `window-move`; the desktop then commits the final position.

Future applications should be inserted into the window body through a slot or an explicit app-rendering layer. They should not duplicate window chrome.

### `WindowManager`

`WindowManager` is a small state service with no rendering responsibility. It implements:

- `focus`;
- `move`;
- `minimize`;
- `restore`;
- `close`.

All methods return cloned snapshots so Lit receives a new array and reliably updates the UI.

### Window events

Windows communicate upward with bubbling, composed custom events:

```text
window-focus
window-move
window-minimize
window-close
```

`composed: true` allows these events to cross Shadow DOM boundaries. Application-level events should follow the same approach later, but their names and payloads must be documented before use.

## State ownership rule

There will eventually be two separate state categories:

1. **Desktop state** — window position, stacking, visibility, and focus.
2. **Game state** — messages read, sites visited, calls made, clues found, time, and consequences.

These categories must not be merged. Opening a window is not equivalent to discovering a clue.

The current milestone implements only desktop state.

## Localization architecture

All user-visible strings are loaded through `src/localization/i18n.ts` from JSON resources under `src/locales/`. English defines the typed key set and acts as the fallback locale.

Window state stores `titleKey` rather than rendered title text. Components translate keys at render time so changing locale does not mutate game or desktop state.

The localization layer also owns locale-aware number, currency, and date formatting. Detailed contribution rules are documented in `LOCALIZATION.md`.

Do not hard-code visible prose, accessibility labels, story dialogue, or error text inside components.

## Dragging behavior

Dragging begins only from the title bar and only with the primary pointer button.

The pointer is captured by the title bar so dragging continues if the pointer moves quickly outside the bar. The window is constrained so:

- it cannot move above the desktop;
- its title bar cannot move behind the taskbar;
- at least part of its title bar remains horizontally reachable.

Pointer movement updates a local preview. The final position is committed only on `pointerup`. This prevents the root state from being rewritten for every pixel of movement.

## Accessibility notes

- Window controls are native buttons with accessible names.
- Focus indicators are retained.
- Pointer Events support mouse, touch, and pen input.
- Motion is minimal and disabled when `prefers-reduced-motion` is active.
- The taskbar allows minimized windows to be restored without dragging.

Keyboard-based window movement is not part of this milestone. It should be considered before the prototype is used for formal accessibility evaluation.

## Development commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Rules for the next milestone

Before adding an application:

1. Verify dragging, focus, minimize, restore, and close in a browser.
2. Add tests for `WindowManager` behavior.
3. Decide whether applications are rendered through slots or an app registry.
4. Keep application state outside `app-window`.
5. Add only one application first; the recommended first application is Mail.

## Deferred work

- window resizing;
- maximizing and snapping;
- persistent window positions;
- desktop icons and an application launcher;
- backend and API integration;
- Storybook;
- automated browser tests;
- application content;
- game scenario logic.
