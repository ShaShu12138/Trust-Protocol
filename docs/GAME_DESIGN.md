# Trust Protocol — Game Design

## High concept

Trust Protocol is a narrative desktop investigation game about verifying financial and identity-related claims under uncertainty. Across five consecutive days, the player uses fictional Mail, Browser, Bank, and Phone applications to handle ordinary tasks, suspicious requests, and the consequences of earlier decisions.

> Cross-check digital evidence instead of selecting an answer from a quiz.

The game takes inspiration from the inspection pressure of *Papers, Please*, translated into a fictional personal computer and focused on transferable verification habits.

## Campaign structure

The game is one continuous five-day campaign, not five selectable cases.

```text
Tutorial
  -> Day 1 work -> consequences
  -> Day 2 work -> consequences
  -> Day 3 work -> consequences
  -> Day 4 work -> consequences
  -> Day 5 work -> consequences
  -> Final five-day review
```

Each day lasts approximately 5–8 minutes. Total target length is 30–40 minutes. Day boundaries provide natural checkpoint saves and a moment to explain direct and downstream consequences.

The detailed campaign arc, persistent-state budget, and daily themes are defined in `FIVE_DAY_CAMPAIGN.md`. Day 1 is defined in `DAY_01_DESIGN.md`.

## Design pillars

### Player actions are the answers

The game avoids reducing situations to “fraud / not fraud” questions. Instead of selecting “contact the bank,” the player should find an independent channel and make the call.

### Trust must be verified, not rejected

Some requests are genuine. Strong play means verifying proportionately through a channel the claimant did not control. Rejecting everything may avoid loss but does not demonstrate a reusable method.

### Information lives in different places

No single application always reveals the answer. The player compares sender addresses, fictional domains, contacts, account records, and conversations across windows.

### Mistakes change later days

Unsafe choices create consequences rather than instant game-over screens. Exposed information may make a later impersonation more convincing; defensive action may prevent loss but cause a legitimate payment inconvenience. Recovery remains possible.

### Ordinary content protects uncertainty

Every day mixes legitimate, suspicious, and background communication. If every new item were fraudulent, the optimal strategy would become mechanical rejection.

### Freedom is curated

The desktop feels open, but all content is authored. Search uses a fictional local web, calls connect to designed characters, and only relevant interactions are simulated.

## Daily play loop

```text
Receive daily briefing
  -> inspect inbox/calls/account state
  -> choose what to investigate
  -> compare information across applications
  -> act, defer, or ignore
  -> end the day
  -> review consequences and carry-forward effects
```

A player does not need to open every background item. Required events can be resolved, deliberately deferred, or ignored after an explicit warning. Omission is recorded as a choice rather than treated as missing input.

## Consequence model

Daily review communicates:

1. what happened today;
2. which verification behaviors the player used;
3. what will carry into tomorrow.

The campaign uses a small set of persistent flags and status values. Choices may select authored variants on later days, but must not create an exponentially branching campaign.

Final evaluation uses behavioral profiles and a reconstructed timeline rather than a single score.

## Core applications

1. **Mail** — incoming requests, ordinary messages, sender inspection, and cross-application links.
2. **Browser** — independent search, fictional pages, domain/contact comparison, and advice.
3. **Nova Bank** — trusted notices, transactions, approvals, freezes, and reports.
4. **Phone/Contacts** — incoming calls, verified callbacks, identity pressure, and dialogue choices.

Applications are reusable tools. They never contain day-specific outcome logic.

## Interaction principles

- Windows support side-by-side comparison.
- A closed application remains available from the desktop.
- Application content does not control its window position.
- Desktop friction is not meaningful difficulty.
- Essential actions are available without pointer dragging.
- Narrative pressure can be paused.
- Suspicion is never revealed only through colour or sinister styling.

## Content and difficulty progression

- **Day 1:** independently verify an unfamiliar bank request.
- **Day 2:** verify a familiar identity using a trusted prior channel.
- **Day 3:** resist authority and urgency during a phone call.
- **Day 4:** apply the method while attention is divided across work and personal tasks.
- **Day 5:** handle a real problem while rejecting a false solution offered through an untrusted channel.

Difficulty grows through cross-channel ambiguity and accumulated context, not tiny text, artificial time limits, or deliberately unusable interfaces.

## Scope boundary

The first playable milestone remains Day 1 plus its consequence review. Days 2–5 should not be implemented until the complete Day 1 loop has been tested.

Campaign ceiling:

- one principal investigation per day;
- one secondary task;
- one or two background messages;
- at most one incoming/scheduled call;
- two to three daily consequence variants;
- at most two new persistent effects per day.

## Language support

Interface and story prose use translation keys rather than hard-coded component text. English, Simplified Chinese, and Dutch must remain structurally complete. Layouts tolerate Dutch expansion and CJK wrapping.

## Current implementation status

Implemented:

- desktop, application icons, windows, and taskbar;
- localization foundation;
- shared tutorial/dialogue presentation;
- Mail application and initial Day 1 messages.
- initial Day 1 suspicious-call, retry, mail-link interruption, and police-warning sequence.

The dialogue component supports tutorials, but the current Day 1 opening deliberately starts without showing the tutorial.

Not yet implemented:

- campaign/day controller;
- required-item resolution and end-day action;
- consequence review;
- cross-day save state;
- Browser, Bank, and Phone content;
- Days 2–5.

## Change log

### 2026-09-20

- Reframed five independent cases as five consecutive campaign days.
- Added daily completion, consequence review, and bounded cross-day persistence.
- Limited the first playable milestone to Day 1 plus review.

### 2026-09-19

- Established the simulated desktop as the main game interface.
