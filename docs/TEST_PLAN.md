# Trust Protocol — Test and Acceptance Plan

> 最新第一天规则：以 [DAY_01_DESIGN.md](DAY_01_DESIGN.md) 的线性版本为准。必须点击链接触发警方，信息在故事开始前已泄露，官网核验后标注邮件即结束。此前第一天自由调查、转账补救、任意结束及 v1 存档描述已被替换；当前使用 v2 存档，28 项测试通过。

> Day 1 playtest validation (2026-10-26): 36 unit tests pass, including 21 Day 1 transition/save cases; build and three-locale key parity pass. Browser checks cover recovery, independent verification, ignored requests, required police warning, reload and replay. See [DAY_01_PLAYTEST.md](DAY_01_PLAYTEST.md) for limits; the older status section below is historical.

## Purpose

This document defines evidence required to call the first playable version complete. Passing a build alone is not sufficient.

## Test layers

### Static checks

- TypeScript strict compilation.
- Production Vite build.
- Missing localization keys across all supported locales.
- Campaign/day-content schema and reference validation.
- Asset-path validation for referenced content.

### Unit tests

Desktop:

- WindowManager focus, move, minimize, restore, close, immutable snapshots.
- WindowManager resize and application minimum-size enforcement.
- bounds/clamping calculations when extracted.

Game:

- reducer actions and effects;
- condition evaluation;
- transition priority;
- daily event resolution and end-day warning evaluation;
- consequence selection and exactly-once carry-forward effects;
- final profile evaluation;
- save validation and migrations.

### Component tests

- each application renders empty and populated states;
- semantic actions have correct payloads;
- localization updates without resetting application/game state;
- minimized content leaves the keyboard tab order;
- cross-app requests focus/open the correct application.
- incoming call shows claimed identity/number and Answer/Decline controls;
- accepting stops ringing motion, leaves one Hang up action, and opens the authored dialogue line;
- declining or hanging up removes the call and associated dialogue;
- reduced-motion mode disables call shaking.

### Day 1 end-to-end routes

Required automated or repeatable scripted routes:

1. Safe verification.
2. Unsafe approval/loss.
3. Unsafe action followed by recovery.
4. Excessive distrust.
5. Save and resume from every checkpoint in routes 1–3.

Each route must reach the Day 1 review and deterministic Day 2 checkpoint without manual state editing or a dead end.

### Five-day campaign matrix

For each day, maintain a bounded set of incoming campaign-state fixtures rather than every mathematical flag combination. Minimum campaign tests:

1. verified/safe behavior across all five days;
2. early information exposure alters later authored content;
3. unsafe action followed by recovery and legitimate inconvenience;
4. repeated avoidance/excessive distrust;
5. mixed route reaching each final behavioral profile;
6. required item ignored through the explicit end-day warning;
7. background items left unread without blocking progression;
8. save/resume during work, during consequence review, and at every day boundary.

Every supported incoming fixture must still be able to complete the current and remaining days.

## Current desktop validation

Before applications are added, manually verify:

- drag with mouse/pointer;
- focus and stacking;
- minimize and taskbar restore;
- close behavior;
- title bar remains reachable at bounds;
- resize viewport and re-test bounds;
- resize each window from its lower-right handle; verify its minimum size and taskbar/right-edge limits;
- language switching in English, Chinese, Dutch;
- reduced-motion preference;
- common laptop viewport and narrow viewport.

Record failures as issues before treating the desktop shell as stable.

## Content validation

For the campaign and every day definition:

- all IDs unique;
- all references resolve;
- five days ordered correctly and only Day 5 has no next day;
- all stages reachable and escapable;
- required events have resolved/deferred/ignored paths;
- background events never block End day;
- all daily consequences reachable by at least one route fixture;
- all carry-forward flags are declared and deterministic;
- no live real-world URL/number;
- no visible prose hard-coded in content logic;
- translations complete in three locales.

## Save testing

- fresh start;
- save/load round trip;
- refresh after each checkpoint;
- review reload does not apply carry-forward effects twice;
- each next-day checkpoint contains the expected previous-day consequences;
- browser close/reopen;
- malformed JSON;
- missing fields;
- unknown IDs;
- simulated storage exception;
- restart campaign clears progress but preserves settings;
- locale change before and after saving;
- responsive restoration without off-screen essential UI.

## Accessibility testing

Use the requirements in `ACCESSIBILITY.md`. Minimum release evidence includes keyboard completion of safe and recovery routes, automated accessibility scans, reduced-motion verification, zoom testing, and a screen-reader smoke test.

## Browser matrix

Minimum:

- latest stable Chrome/Edge;
- latest stable Firefox;
- latest stable Safari where hardware is available.

Primary development target is a modern laptop browser. Narrow/touch layouts are supported but do not need to mimic a desktop perfectly.

## Localization QA

For each locale:

- complete one safe route;
- inspect long buttons, window titles, call dialogue, transaction rows, and review;
- verify number, date, time, and EUR formatting;
- check CJK wrapping and Dutch text expansion;
- confirm document language and accessible names.

## Performance and assets

- initial shell should become interactive without loading every case master image;
- prefer runtime WebP over PNG masters;
- no broken asset requests;
- no avoidable layout shift in primary screens;
- test throttled network once deployment exists.

## User acceptance session

With 3–5 participants who did not author the case, observe without coaching:

- whether they understand how to open/compare applications;
- whether they independently verify the claim;
- where they become stuck;
- whether color appears to reveal the answer;
- whether recovery is understood;
- play time and review comprehension.

## Release checklist

- `npm test` passes.
- `npm run build` passes.
- content validation passes.
- all four route fixtures pass.
- save/resume passes at every checkpoint.
- no critical accessibility blocker.
- all three locales reviewed.
- privacy/local-save notice present.
- deployed URL tested independently.
- documentation and asset registry updated.

## Current status

- Desktop shell exists.
- WindowManager has six automated unit tests covering state isolation, focus, movement, minimize/restore, close, and unknown IDs.
- MailSession has five automated unit tests covering initial state, marking messages read, persisted read-state restoration, snapshot isolation, and sender-detail toggling.
- MailSession also verifies persisted read IDs on application reopen. The Mail desktop/toolbar icon must show the unread badge while unread messages exist, remove it when the count reaches zero, and keep it removed after closing and reopening Mail.
- The shared dialogue layer was manually verified for three-step progression, primary autofocus, Tab focus cycling, Escape dismissal, responsive presentation, localized text, and a clean console.
- Incoming-call presentation was manually verified for continuous ringing animation, Answer/Decline, connected-state Hang up, non-modal dialogue reuse, teardown, localization, and a clean console.
- The Day 1 opening was manually verified for an empty no-tutorial desktop, number-only suspicious caller, three-second retry after hang-up, pressure-dialogue looping, immediate police-call replacement on `mail-link-requested`, two police lines, and a deliberate stop with no remaining Continue action.
- WindowManager has two additional launch tests covering reopening a closed application and restoring without duplication. A new session must start with no open windows; left-aligned desktop icons must remain available and open Mail, Browser, Bank, and Phone.
- On 2026-09-20, Mail was manually validated in the local Chromium-based in-app browser: all three messages render, opening the unread message updates the count, sender details reveal the configured address, all three locales switch correctly, independent panes scroll within the window, and no console errors were observed.
- On 2026-09-20, the desktop was manually validated in the local Chromium-based in-app browser: drag and focus, minimize and taskbar restore, close, and English/Simplified Chinese/Dutch switching all passed; no console errors were observed.
- `npm test` and `npm run build` passed on 2026-09-20 with Node 18.19.0, Vite 6.4.3, and Vitest 3.2.6.
- `npm audit` reports two moderate, development-only Vitest path-traversal advisories. The available fixed Vitest release requires a newer Node/Vite toolchain; upgrade after moving the project to a supported newer Node version. Production dependencies have no reported vulnerability.
- Mail is implemented; Browser, Bank, Phone, the game reducer, and playable routes are not implemented yet.
