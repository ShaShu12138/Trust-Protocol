# Trust Protocol — UI Flow

> 最新第一天规则：以 [DAY_01_DESIGN.md](DAY_01_DESIGN.md) 的线性版本为准。必须点击链接触发警方，信息在故事开始前已泄露，官网核验后标注邮件即结束。此前第一天自由调查、转账补救、任意结束及 v1 存档描述已被替换；当前使用 v2 存档，28 项测试通过。

> Five-day target update (2026-10-26): [PLAYABLE_CAMPAIGN_SPEC.md](PLAYABLE_CAMPAIGN_SPEC.md) takes precedence for the opening, call retries, and end-day confirmation. The target now enters Day 1 without a mandatory tutorial; help remains optional.

## Purpose

This document defines page-level and desktop-level navigation for the five-day campaign. Campaign structure belongs in `FIVE_DAY_CAMPAIGN.md`; Day 1 branching belongs in `DAY_01_DESIGN.md`.

## Top-level flow

```text
Boot
  -> Start screen
      -> New investigation -> Local-save notice -> Short tutorial -> Day 1 briefing
      -> Continue -> Active day/work/review checkpoint
      -> Review five days -> Campaign review
      -> Settings

Day briefing
  -> Desktop work period

Desktop work period
  -> Pause menu
  -> End-day confirmation
      -> unresolved-required-item warning (when needed)
      -> Daily consequence review
          -> Next day briefing / Campaign review after Day 5

Campaign review
  -> Return to desktop
  -> Start campaign again (confirmation)
  -> Start screen
```

## Boot

- Load locale and accessibility settings.
- Load and validate local save.
- Preload only essential shell assets.
- Display a recoverable error rather than a blank screen.
- Do not advance story during boot.

## Start screen

Primary actions vary by save state:

| Save state | Primary actions |
|---|---|
| None | Start five-day investigation |
| In progress | Continue Day N, Restart campaign |
| Completed | Review five days, Start again |

Always available: language and settings. Restart/start-again actions require confirmation when progress exists.

## Local-save notice

Shown once before first play:

- progress is stored in the current browser;
- no real banking information is requested;
- clearing site data removes progress;
- the player may continue without an account.

Acceptance is stored as a setting, not game progress.

## Tutorial

Teach by one reversible action at a time:

1. Focus a window.
2. Drag it by the title bar.
3. Minimize and restore it.
4. Open another application and arrange a comparison.

Tutorial can be skipped and replayed from settings. It must not contain case answers.

The current Day 1 prototype bypasses the tutorial and begins directly with an incoming unknown-number call. The tutorial remains a planned/replayable flow rather than part of this opening beat.

The current prototype presents its introductory explanation through the shared dialogue layer. Tutorial content is a data-defined sequence with progress, primary/secondary actions, and localized copy.

## Dialogue layer

Tutorials, progressive hints, and spoken call lines share one presentation component. A dialogue definition supplies its kind, speaker, text, optional portrait, progress, and actions. The visual variant may change the accent, but the interaction model remains consistent.

- Tutorial: instructional sequence with next, finish, and skip actions.
- Hint: short optional guidance with an acknowledgement or dismiss action.
- Call: speaker portrait/name, localized spoken line, and future response/end-call actions.

Dialogue content must remain data-driven. The component emits action IDs and never advances case state itself.

## Desktop

Persistent shell areas:

- desktop surface;
- application windows;
- taskbar/open-window controls;
- app launcher or initial application shortcuts;
- language/settings entry;
- pause control;
- optional unobtrusive save status.

Application content never controls its window position. Closing an essential application closes only its window; it remains reopenable.

## Day briefing

Shows the day number, a short contextual introduction, and any visible consequence carried from yesterday. It must not identify which incoming content is fraudulent. Continue enters the desktop work period and creates/updates the day checkpoint.

## Ending a day

The taskbar or day-status control exposes **End day** when required events are resolved or deliberately deferred.

If required items remain unseen/open, activation shows a confirmation listing only neutral counts—not which item is dangerous. Continuing records those items as ignored. Cancelling returns to the desktop without mutation.

Background messages never block End day.

## Daily consequence review

Sections:

1. what happened today;
2. chronological actions relevant to the result;
3. verification behaviors used or missed;
4. immediate account/task/relationship consequences;
5. one or two conditions that carry into tomorrow.

Confirming applies carry-forward effects exactly once and opens the next briefing. Day 5 instead opens the campaign review.

## Application navigation

### Mail

List -> message -> sender details / link action / evidence action.

### Browser

Start/search -> results -> page -> compare/contact actions. Back and forward operate only on in-game history.

### Bank

Overview -> activity / cards / security action -> confirmation.

### Phone

Contacts/history -> contact -> call -> dialogue choices -> call summary.

An incoming call first appears as a centered high-priority card above the desktop and application windows, with portrait, claimed identity, phone number, Answer, and Decline. While ringing it uses restrained repeated movement; reduced-motion mode replaces this with a static visual emphasis. After Answer, movement stops and only Hang up remains. Spoken lines appear through the shared non-modal dialogue layer below the call card so Hang up remains available at all times.

Every application provides a meaningful empty/loading/error state and an accessible route back to its root view.

## Cross-application transitions

Cross-app actions request the desktop to open/focus a target app with context:

```text
mail link -> browser page
browser phone number -> phone contact
phone advice -> bank security action
bank activity -> evidence board
```

The source app emits a semantic request. The desktop/app controller decides how to open and arrange the target window.

## Pause

Pause stops narrative timers and prevents new scheduled events. It does not hide evidence already visible. Pause menu actions:

- Resume;
- Settings;
- Restart campaign;
- Return to start screen.

Version 1 should prefer action/checkpoint pressure over real-time countdowns.

## Hints

Hints appear through a neutral desktop notification or help control. They are progressive, optional, and never identify the correct suspect/site directly.

## Campaign review

Sections:

1. five-day timeline;
2. direct and downstream consequences;
3. discovered and missed observations;
4. behavior dimensions across days;
5. recovery after mistakes;
6. transferable real-world protocol;
7. replay/start-screen actions.

## Responsive behavior

- Desktop target: side-by-side windows.
- Narrow screens: windows remain usable through taskbar switching; side-by-side comparison may become sequential.
- Essential buttons wrap rather than clip.
- Restored windows are clamped to current bounds.
- No checkpoint depends on a particular window coordinate.

## Error flows

- Corrupt save -> explain and offer reset.
- Missing content -> return to stable stage and log a diagnostic.
- Storage failure -> continue in memory with a non-blocking notice.
- Unknown route -> safe start screen, never a blank desktop.

## Exit criteria

- Every top-level view has an obvious forward or back action.
- No essential application can become permanently unavailable.
- Continue/restart behavior matches save state.
- All destructive actions require confirmation.
- Flow is operable in English, Simplified Chinese, and Dutch.
