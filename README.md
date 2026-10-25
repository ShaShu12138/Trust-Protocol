# Trust Protocol

A playable browser game about recognising bank-impersonation fraud.

You sit at a fictional desktop. Mail arrives, the bank's website is open in another window,
the phone rings — and someone is lying to you. The game is about the moment before you
decide whether to trust them.

Built with **Lit + strict TypeScript**. No UI framework, no game engine — one runtime
dependency.

![Trust Protocol — concept art](public/assets/marketing/portfolio-hero-investigation-1672x941.webp)

<sub>Concept art. The application itself is a flat, functional desktop UI — no cinematic
rendering in-app.</sub>

---

## What is actually implemented

I would rather list this honestly than describe the design document.

| Area | State |
|---|---|
| Desktop shell — open, close, focus, move, resize, minimise, restore, z-index stacking, per-window minimum sizes | Working |
| Mail application — inbox, reading, session state | Working |
| Phone — incoming-call state machine (ringing → connected → retry → escalation) | Working |
| Dialogue layer — portraits, typewriter text, keyboard focus trap | Working |
| Localisation — English, Simplified Chinese, Dutch | Working |
| Day 1 scripted flow (case 01, calls, police branch) | Playable prototype |
| Bank and Browser windows | Shells with empty states |
| Save / load, end-of-day review, days 2–5 | Designed, not built (`docs/`) |

## How it is built

The rule I hold to: **logic that must not break does not live in a component.**

```
src/
  content/    case data, call scripts, mail definitions — pure data, no DOM
  desktop/    WindowManager (pure class), window-state, app registry, shell element
  apps/       mail, bank, browser, phone — each its own element + session logic
  ui/         dialogue panel, incoming call, tutorial
  locales/    en / zh-CN / nl
```

- `WindowManager` is a plain class over an immutable `DesktopWindowState[]`. Components
  render it; they never own window state.
- `MailSession` and the call state machine are DOM-free, which is why they can be tested
  without a browser or a fake DOM.
- All narrative content is data. Adding a case or a day means adding data, not a component.
- Timer-driven transitions carry re-entry guards, so a retry cannot double-fire.

## Numbers a reviewer can check

| | |
|---|---|
| Unit tests | **15 passing** (`vitest`) — window manager and mail session |
| Localisation | **63 keys × 3 locales**, zero missing, zero orphaned |
| Production build | **74.4 kB JavaScript, 22.6 kB gzipped** |
| Source size | **21 files, 2,132 lines** |
| TypeScript | `strict`, `noUnusedLocals`, `noUnusedParameters` |
| Accessibility | ARIA labelling, keyboard focus trapping in the dialogue layer, `prefers-reduced-motion` fallback |

## Run it

```bash
npm install
npm run dev      # local dev server
npm test         # 15 unit tests
npm run build    # tsc + vite build → dist/
```

## Documentation

The design work is in `docs/` — this is a campaign game, not a single scene:

- [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md) — concept, principles, scope boundaries
- [`docs/FIVE_DAY_CAMPAIGN.md`](docs/FIVE_DAY_CAMPAIGN.md) — the five-day arc and cross-day consequences
- [`docs/DAY_01_DESIGN.md`](docs/DAY_01_DESIGN.md) — first-day events, resolutions, acceptance criteria
- [`docs/CODE_ARCHITECTURE.md`](docs/CODE_ARCHITECTURE.md) — state ownership and development rules
- [`docs/CONTENT_SCHEMA.md`](docs/CONTENT_SCHEMA.md) — data format for campaigns, days, events, consequences
- [`docs/GAME_STATE_AND_SAVE.md`](docs/GAME_STATE_AND_SAVE.md) — runtime state, checkpoints, save migration
- [`docs/UI_FLOW.md`](docs/UI_FLOW.md) — player-facing screens and transitions
- [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) — accessibility target and release gates
- [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) — what is tested, and how
- [`docs/LOCALIZATION.md`](docs/LOCALIZATION.md) — keys, locale resources, layout rules
- [`docs/ART_DIRECTION.md`](docs/ART_DIRECTION.md) — visual identity and asset standards
- [`docs/ASSET_REGISTRY.md`](docs/ASSET_REGISTRY.md) — asset origin, licence, AI assistance
- [`docs/AI_HANDOFF_PROMPT.md`](docs/AI_HANDOFF_PROMPT.md) — context prompt for working with an AI developer

## Context

Solo student project, part of my graduation portfolio (HBO GameDevelopment, Amsterdam
University of Applied Sciences). Targeting a February–July 2027 graduation internship.

The subject is deliberate: bank-impersonation fraud is the fraud type most Dutch banks
train their customers against, and the training is usually a quiz. A desktop simulation
can put the decision back where it actually happens — in the middle of a normal day,
with three windows open and someone on the phone.

## Licence

No licence yet. The code is public so that applications and interviews can verify the
claims above; it is not offered for reuse.
