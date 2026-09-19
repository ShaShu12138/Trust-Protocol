# Trust Protocol — Game Design and Flow

## High concept

Trust Protocol is a desktop investigation game about verifying financial and identity-related information under uncertainty. The player eventually uses simulated applications—such as email, a browser, banking, contacts, and phone—to decide whom and what to trust.

The intended experience can be summarized as:

> Cross-check digital evidence instead of selecting an answer from a quiz.

The conceptual comparison is a financial-fraud version of *Papers, Please*, translated from a physical inspection desk into a fictional computer desktop.

## Design pillars

### Player actions are the answers

The final game should avoid presenting every situation as a multiple-choice question. Instead of choosing “contact the bank,” the player should find an independent number and make the call.

### Trust must be verified, not rejected

The ideal strategy is not to distrust every person or message. Some requests will be genuine. Strong play means verifying through independent channels before acting.

### Information lives in different places

No single screen should always reveal the solution. The player may need to compare an email address, a bank transaction, a saved contact, and a search result in separate windows.

### Mistakes create consequences, not immediate failure

An unsafe action should usually change later events or reveal more information to an attacker. The player should have opportunities to recognize the mistake and limit the damage.

### Freedom is curated

The simulated desktop should feel open, but its content will be authored. The browser will search a fictional local web, calls will connect to designed characters, and applications will expose only mechanics relevant to the investigation.

## Current milestone: desktop interaction prototype

The current milestone is not yet a playable case. It tests only whether the simulated desktop can serve as the game's main interaction space.

Included:

- a desktop surface;
- two empty windows;
- overlapping windows;
- dragging windows to compare their positions;
- focus and stacking;
- minimizing, restoring, and closing windows.

Excluded:

- email;
- browser;
- banking;
- phone calls;
- contacts;
- story events;
- game time;
- scoring;
- clues;
- win or fail states.

The empty windows are deliberate. They isolate the desktop interaction from content and allow the technical foundation to be evaluated before application development begins.

## Target player experience

In a later playable prototype, a typical sequence may be:

```text
Receive a bank security email
→ inspect its sender and link
→ open the simulated browser
→ search for the bank independently
→ compare official and supplied contact details
→ call one of the numbers
→ inspect bank activity
→ take or avoid a security action
→ experience the consequence
```

The player should feel that they investigated the event themselves. The interface should not automatically mark suspicious details as correct or incorrect.

## Planned prototype scope

The first playable case should eventually contain only four applications:

1. Mail
2. Browser
3. Bank
4. Phone/Contacts

It should contain one investigation, approximately 10–15 minutes long, involving:

- one suspicious bank email;
- one fake website;
- one official website;
- one fake support number;
- one official support number;
- one small set of bank activity records;
- a safe route, an unsafe route, and a recovery route.

This scope is a ceiling, not the current task.

## Visual direction

The desktop combines:

- a restrained modern operating-system layout;
- warm editorial colors;
- subtle dossier or evidence-board qualities;
- clear typography and accessible controls;
- increasing informational pressure without visual chaos.

The design should avoid stereotypical hacker imagery, flashing red warnings, code rain, and interfaces that reveal danger only through color.

Current empty windows use warm paper-like surfaces and a quiet grid. This is provisional and may change after interaction testing.

## Interaction principles for windows

- Windows should support side-by-side comparison.
- A window must never become permanently unreachable.
- Window controls should behave consistently across all future applications.
- Application content should not control its own window position.
- Desktop friction should not be confused with meaningful difficulty.
- The player must be able to pause future time pressure.

## Language support

The game is designed for multiple languages. Interface and story content must be referenced by translation keys rather than embedded as fixed prose in code. Layouts should tolerate text expansion and CJK line wrapping. Detailed implementation and writing rules are maintained in `LOCALIZATION.md`.

## Questions to validate before adding applications

- Does dragging feel stable with a mouse and touch input?
- Is it clear which window is focused?
- Can the player recover a minimized window without instruction?
- Can two windows be placed side by side comfortably?
- Does the taskbar obscure useful workspace?
- Is the desktop legible at common laptop resolutions?
- Does the visual style feel investigative without becoming visually noisy?

## Future design documents

Add separate documents when their subjects become concrete rather than expanding this file indefinitely. Likely additions include:

- `CASE_01_DESIGN.md` for the first fraud scenario;
- `CONTENT_SCHEMA.md` for emails, sites, calls, and bank records;
- `RESEARCH_PLAN.md` for user testing and study design;
- `ART_DIRECTION.md` defines the current visual-asset and interface-art standards;
- `ACCESSIBILITY.md` for accessibility requirements and test results.

## Change log

### 2026-09-19

- Established the simulated desktop as the main game interface.
- Limited the first implementation milestone to desktop and generic draggable windows.
- Deferred all applications and narrative content.
