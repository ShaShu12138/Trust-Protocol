# Trust Protocol — Campaign State and Save Design

## Purpose

This document defines runtime ownership, day progression, consequences, automatic saving, restoration, and migration for the five-day campaign.

## State separation

- **Desktop state:** open windows, positions, sizes, stacking, focus, and minimized state.
- **Daily UI state:** selected mail, current browser page, active call line, and temporary dialogue.
- **Campaign state:** current day/stage, event resolutions, actions, evidence, consequences, persistent flags, and final profile.

Opening or moving a window is not evidence discovery. Application components do not directly advance a day.

## Runtime state

```ts
export interface GameState {
  saveVersion: 1;
  campaignId: CampaignId;
  status: 'not-started' | 'in-progress' | 'completed';
  activeDayId: DayId | null;
  activeStageId: StageId | null;
  startedAt: string | null;
  updatedAt: string;

  completedDayIds: readonly DayId[];
  dayState: DayRuntimeState | null;
  campaignFlags: Readonly<Record<FlagId, boolean>>;
  cumulativeConsequences: readonly ConsequenceId[];
  actionLog: readonly GameActionRecord[];
  finalProfileId: FinalProfileId | null;
}

export interface DayRuntimeState {
  dayId: DayId;
  eventResolutions: Readonly<Record<EventId, ItemResolution>>;
  discoveredEvidenceIds: readonly EvidenceId[];
  visibleContentIds: readonly string[];
  readMailIds: readonly MailMessageId[];
  transactionStates: Readonly<Record<TransactionId, TransactionStatus>>;
  dailyFlagValues: Readonly<Record<FlagId, boolean>>;
  hintsShown: readonly DialogueId[];
  selectedConsequenceId: ConsequenceId | null;
  reviewConfirmed: boolean;
}
```

Definitions remain in content files. Saves store IDs and state values, not localized prose or artwork.

## Update flow

```text
application emits semantic action
  -> campaign controller validates it for active day/stage
  -> reducer records action and applies generic effects
  -> event resolution and stage transitions are evaluated
  -> observers update applications
  -> consequential checkpoint is saved
```

Reducers are deterministic and side-effect free. Timestamps and storage writes occur outside them.

## Day completion transaction

Ending a day is one deterministic transaction:

1. Evaluate required event resolutions.
2. If unresolved required items remain, show an explicit warning.
3. On confirmation, convert remaining blocking items to `ignored` and apply their effects.
4. Select the daily consequence using ordered rules.
5. Enter the review stage and save.
6. Present immediate outcome, behavior notes, and carry-forward effects.
7. On review confirmation, apply carry-forward effects exactly once.
8. Mark the day completed, initialize the next day from campaign flags, and save the new-day checkpoint.

Reloading during review must not reapply effects or choose a different consequence.

## Save location

Version 1 uses browser `localStorage`:

```text
trust-protocol.settings.v1
trust-protocol.save.v1
```

Settings and campaign progress are separate. Restarting the campaign preserves language and accessibility settings.

## Automatic checkpoints

Save after:

- starting or restarting the campaign;
- entering a day briefing or active stage;
- resolving/deferring/ignoring a required event;
- discovering consequential evidence;
- completing an unsafe, recovery, or protective action;
- selecting a daily consequence;
- confirming a day review and entering the next day;
- completing the final campaign review;
- changing persistent settings.

Do not save pointer movement, hover, animation, or drag previews. Desktop-layout persistence remains deferred until responsive restoration is defined.

## Resume behavior

- During a work period: restore the active day and application state at the last checkpoint.
- During a day review: reopen the already-selected review without reapplying consequences.
- At a day boundary: resume at the next briefing.
- After Day 5: open the final review.

Players are not expected to finish all five days in one sitting.

## Loading and reconciliation

1. Read raw save text.
2. Parse in `try/catch`.
3. Validate shape and known IDs.
4. Run sequential migrations.
5. Reconcile IDs against the campaign definition.
6. Verify completed-day order and active-day consistency.
7. Fall back safely if recovery is impossible.

Unknown optional evidence/action IDs may be discarded. A missing active day, stage, event resolution contract, or already-applied campaign effect invalidates that checkpoint and should offer a campaign restart or safe previous-day recovery when available.

## Migration

Every record has `saveVersion`. Migrations are sequential. Released IDs remain stable; renaming `case01` prototype IDs to `day01` requires an explicit migration if any public save already contains them.

## Start, continue, and restart

- No save: Start Five-Day Investigation.
- In progress: Continue Day N and Restart Campaign.
- Completed: Review Five Days and Start Again.
- Restart requires confirmation and preserves settings.

## Failure handling

- Storage unavailable: continue in memory with one non-blocking warning.
- Quota failure: continue in memory; do not spam notifications.
- Corrupt data: preserve raw text temporarily for diagnostics, start safely, and offer reset.
- A write failure never reverses an accepted player action.

## Privacy

Save data contains fictional state only. Never store real names, credentials, banking information, phone numbers, browsing history, or free-form sensitive input. Explain that progress stays in the current browser and clearing site data removes it.

## Test obligations

- round-trip each work, review, and day-boundary checkpoint;
- resume every supported daily route;
- ensure review effects apply exactly once;
- verify Days 1–5 order cannot be skipped through malformed data;
- exercise supported incoming campaign-state fixtures for every day;
- malformed JSON, wrong types, unknown IDs, and storage exceptions;
- all migrations;
- restart preserves settings;
- locale changes do not alter campaign state;
- final timeline reconstructs the saved action log deterministically.
