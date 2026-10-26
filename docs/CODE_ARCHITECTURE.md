# Trust Protocol — Code Architecture

> 最新第一天规则：以 [DAY_01_DESIGN.md](DAY_01_DESIGN.md) 的线性版本为准。必须点击链接触发警方，信息在故事开始前已泄露，官网核验后标注邮件即结束。此前第一天自由调查、转账补救、任意结束及 v1 存档描述已被替换；当前使用 v2 存档，28 项测试通过。

> 2026-10-26: Day 1 now uses `src/game/day-one-session.ts` for pure transitions/save validation and `src/apps/day-one-panel.ts` for local Browser/Bank/Phone content and review. The desktop delegates story decisions to the session, owns storage and retry timers, and consumes Mail events. See [DAY_01_PLAYTEST.md](DAY_01_PLAYTEST.md). Earlier prototype-only status statements below are historical and do not describe this completed Day 1 slice.

## Purpose

This document records technical decisions and boundaries for the project. Update it whenever the architecture, development workflow, or technical scope changes.

The current milestone contains only:

- a simulated desktop surface;
- generic application windows with slotted placeholder content;
- window dragging;
- window focus and stacking;
- minimizing, restoring, and closing windows through basic desktop controls.
- a localization foundation with English, Simplified Chinese, and Dutch resources.

Beyond this shell it intentionally contains no backend, no database, and no real web browsing. Milestone 2 added the first real game applications (Mail, Phone) and the scripted Day 1 call flow; there is still no save system, no settings, no campaign reducer, and no Browser or Bank implementation.

> This section and the tree below describe the code as it is, not as originally planned. When code changes, update them in the same change.

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
├── apps/
│   ├── app-registry.ts
│   ├── mail/
│   │   ├── mail-app.ts
│   │   ├── mail-session.ts
│   │   └── mail-session.test.ts
│   └── phone/
│       └── incoming-call.ts
├── content/
│   ├── content-types.ts
│   ├── tutorial.ts
│   ├── calls/
│   │   └── day-01-demo-call.ts
│   └── cases/
│       └── case-01.ts
├── desktop/
│   ├── app-window.ts
│   ├── game-desktop.ts
│   ├── window-manager.ts
│   ├── window-manager.test.ts
│   └── window-state.ts
├── localization/
│   └── i18n.ts
├── locales/
│   ├── en.json
│   ├── nl.json
│   └── zh-CN.json
├── styles/
│   └── global.css
└── ui/
    └── dialogue-panel.ts
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
- pointer resizing from the lower-right corner with application-specific minimum sizes.

During a drag it stores only a temporary preview position. When the drag ends, it emits `window-move`; the desktop then commits the final position.

Applications are inserted into the window body through the default slot. They must not duplicate window chrome.

### Application registry

`src/apps/app-registry.ts` is the single catalogue of application identities and launch defaults. It currently declares Mail, Browser, Bank, and Phone. A new session starts with no open windows; players launch applications from the icons aligned along the left side of the desktop.

All registered applications appear as permanent desktop icons. Activating an icon opens a closed application, restores a minimized one, or focuses an already open one. Closing every window therefore reveals the desktop and its launch icons rather than an artificial empty-state message.

Desktop window state stores an `appId`. `game-desktop` resolves that ID through the registry and places the relevant application component inside `app-window`. Until real applications are implemented, the slot contains a localized placeholder.

Adding an application should normally require:

1. adding its stable ID and metadata to the registry;
2. implementing a self-contained Lit component;
3. mapping the ID to that component in the desktop application-rendering layer;
4. adding translation keys and tests.

Case data must refer to stable application and action IDs, never component class names.

### Mail application

`src/apps/mail/mail-app.ts` renders an inbox from `MailMessageDefinition` data. It does not contain Case 01 prose or decide whether a message is legitimate. Case content currently lives in `src/content/cases/case-01.ts` and all visible copy is referenced through translation keys.

`MailSession` owns temporary mail UI state: selected message, read IDs, and the expanded sender-details panel. It returns isolated snapshots and has pure unit tests. When persistent game state is introduced, read IDs can be supplied by the game store without changing the content definition.

Mail emits `mail-unread-state-changed` with the unread count and read-message IDs. The desktop retains those IDs for the current session so closing and reopening Mail does not restore a cleared unread badge. The desktop and Mail toolbar choose between `app-mail-unread.svg` and the badge-free `app-mail.svg`; future new-message effects can use the same state boundary.

Mail emits semantic, bubbling events for the future game engine:

```text
mail-message-opened    { messageId }
mail-sender-inspected  { messageId }
mail-link-requested    { messageId, pageId }
```

Current handling in `game-desktop`: `mail-link-requested` is the only one consumed — it cancels the suspicious call and selects `DAY_01_POLICE_CALL`. `mail-message-opened` and `mail-sender-inspected` are still unhandled and are meant for evidence tracking. Browser navigation and evidence discovery must later be implemented by a controller/game reducer, not inside `mail-app`.

### Dialogue presentation

`src/ui/dialogue-panel.ts` is the shared modal presentation layer for tutorials, hints, and phone dialogue. It accepts a `DialoguePresentation` data object and emits `dialogue-primary` or `dialogue-secondary` with stable presentation/action IDs. It contains no case branching.

The initial three-step sequence lives in `src/content/tutorial.ts`. Future hint and call definitions should use the same contract while their controllers decide which line appears next. The component provides localized copy, an optional image, progress, responsive layout, initial focus, Escape dismissal when allowed, and a Tab focus loop.

`dialogue-panel` also supports a non-modal presentation mode for spoken call lines. Non-modal dialogue does not add a blocking backdrop or steal focus, allowing the persistent call card's Hang up action to remain available.

### Incoming calls

`src/apps/phone/incoming-call.ts` presents caller portrait, localized display name, fictional number, and call controls. It accepts `ringing` or `connected` state and emits semantic `call-accepted`, `call-declined`, and `call-ended` events. It does not choose dialogue or mutate campaign state.

The current desktop starts `DAY_01_SUSPICIOUS_CALL` immediately, with no tutorial or open windows. Declining/hanging up schedules a bounded three-second retry. Advancing dialogue cycles through authored pressure lines. `mail-link-requested` cancels that sequence and selects `DAY_01_POLICE_CALL`; its final authored line has no continue action, intentionally stopping the prototype. The future day controller should own this state machine rather than `game-desktop`.

### `WindowManager`

`WindowManager` is a small state service with no rendering responsibility. It implements:

- `focus`;
- `move`;
- `minimize`;
- `restore`;
- `close`.

All methods return cloned snapshots so Lit receives a new array and reliably updates the UI.

The constructor also clones its input. Neither the original array nor snapshots returned to callers can mutate the manager's authoritative state.

### Window events

Windows communicate upward with bubbling, composed custom events:

```text
window-focus
window-move
window-resize
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

## Resizing behavior

Version 1 resizing uses only a lower-right pointer handle. During a resize, width and height remain local preview state; `window-resize` commits them on pointer release. Each application declares a minimum size in the app registry. Maximum size is clamped to the available desktop area above the taskbar.

Keyboard resize alternatives, edge/corner handles other than the lower-right corner, maximize, snapping, and size persistence are deferred.

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
npm test
npm run test:watch
```

## Rules for the next milestone

Before adding playable content:

1. Keep application state outside `app-window`.
2. Complete Day 1 using `DAY_01_DESIGN.md`, `FIVE_DAY_CAMPAIGN.md`, and `CONTENT_SCHEMA.md`.
3. Load campaign/day content as validated data rather than embedding story branches in components.
4. Add fixtures for every Day 1 resolution and next-day checkpoint.
5. Re-run desktop interaction, localization, keyboard, and build checks.

## Deferred work

- maximizing and snapping;
- persistent window positions;
- backend and API integration;
- Storybook;
- automated end-to-end browser tests;
- application content;
- game scenario logic.
