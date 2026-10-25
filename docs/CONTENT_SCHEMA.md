# Trust Protocol — Campaign Content Schema

## Purpose

This document defines editable, language-neutral content contracts for the five-day campaign. Applications render content; they do not contain day-specific story logic. The campaign engine evaluates generic actions, conditions, effects, item resolutions, day transitions, and consequences.

## Design goals

- Designers can tune a day without editing application components.
- Days share a stable campaign state without creating exponential branches.
- Mail, Browser, Bank, Phone, evidence, events, and consequences connect through stable IDs.
- All visible prose uses translation keys.
- A validator can detect invalid references, unreachable daily resolutions, missing locales, and unsupported carry-forward states.
- Definitions remain serializable so a future visual editor is possible.

## Planned layout

```text
src/content/
  content-types.ts
  campaign.ts
  days/
    day-01.ts
    day-02.ts
    day-03.ts
    day-04.ts
    day-05.ts
```

The current prototype still uses `src/content/cases/case-01.ts`. Rename that technical namespace only when the campaign controller and save migration are implemented.

## Identifiers

New IDs use lowercase dotted namespaces:

```text
day01.active
event.day01.nova-security-review
mail.day01.nova-security-review
evidence.day01.sender-domain
consequence.day01.info-exposed
campaign.info-exposed
```

Released IDs are save-data references. Renaming requires a migration map and must never depend on localized text.

## Campaign definition

```ts
export interface CampaignDefinition {
  schemaVersion: 1;
  id: CampaignId;
  titleKey: TranslationKey;
  initialDayId: DayId;
  days: readonly DayDefinition[];
  persistentFlagIds: readonly FlagId[];
  finalProfiles: readonly FinalProfileDefinition[];
}
```

## Day definition

```ts
export interface DayDefinition {
  id: DayId;
  ordinal: 1 | 2 | 3 | 4 | 5;
  titleKey: TranslationKey;
  briefing: DialogueSequenceDefinition;
  initialStageId: StageId;
  stages: readonly DayStageDefinition[];
  events: readonly DailyEventDefinition[];
  content: DayContentBundle;
  evidence: readonly EvidenceDefinition[];
  consequences: readonly DailyConsequenceDefinition[];
  nextDayId: DayId | null;
}
```

Days are ordered explicitly. `nextDayId: null` is valid only for Day 5.

## Daily events and completion

```ts
export type ItemResolution =
  | 'unseen'
  | 'open'
  | 'resolved'
  | 'deferred'
  | 'ignored';

export interface DailyEventDefinition {
  id: EventId;
  role: 'required' | 'secondary' | 'background';
  sourceContentIds: readonly string[];
  resolvedWhen: GameCondition;
  canDefer: boolean;
  ignoredEffects?: readonly GameEffect[];
}

export interface EndDayRule {
  normalWhen: GameCondition;
  warningWhen: GameCondition;
  warningKey: TranslationKey;
}
```

Background events never block progression. Ending with a required event in `unseen` or `open` state requires a confirmation and converts it to `ignored` before consequences are evaluated.

## Stages and transitions

```ts
export interface DayStageDefinition {
  id: StageId;
  kind: 'briefing' | 'active' | 'consequence' | 'review' | 'complete';
  entryEffects?: readonly GameEffect[];
  availableAppIds: readonly AppId[];
  transitions: readonly StageTransition[];
}

export interface StageTransition {
  id: string;
  priority: number;
  when: GameCondition;
  targetStageId: StageId;
  effects?: readonly GameEffect[];
}
```

Transitions are evaluated by ascending priority after accepted semantic actions. Priorities must be unique within a stage.

## Conditions

```ts
export type GameCondition =
  | { type: 'always' }
  | { type: 'action-completed'; actionId: ActionId }
  | { type: 'evidence-found'; evidenceId: EvidenceId }
  | { type: 'event-resolution-is'; eventId: EventId; resolution: ItemResolution }
  | { type: 'day-is'; dayId: DayId }
  | { type: 'stage-is'; stageId: StageId }
  | { type: 'flag-is'; flagId: FlagId; value: boolean }
  | { type: 'all'; conditions: readonly GameCondition[] }
  | { type: 'any'; conditions: readonly GameCondition[] }
  | { type: 'not'; condition: GameCondition };
```

Do not add arbitrary JavaScript callbacks. Serializable conditions keep content testable and editable.

## Effects

```ts
export type GameEffect =
  | { type: 'set-flag'; flagId: FlagId; value: boolean }
  | { type: 'set-event-resolution'; eventId: EventId; resolution: ItemResolution }
  | { type: 'reveal-content'; contentId: string }
  | { type: 'add-transaction'; transactionId: TransactionId }
  | { type: 'update-transaction'; transactionId: TransactionId; status: TransactionStatus }
  | { type: 'discover-evidence'; evidenceId: EvidenceId }
  | { type: 'queue-dialogue'; dialogueId: DialogueId }
  | { type: 'record-consequence'; consequenceId: ConsequenceId };
```

Only campaign/day controllers apply effects. Components emit semantic requests and never mutate campaign flags.

## Application content

```ts
export interface DayContentBundle {
  mailMessages: readonly MailMessageDefinition[];
  browserPages: readonly BrowserPageDefinition[];
  searchEntries: readonly SearchEntryDefinition[];
  contacts: readonly ContactDefinition[];
  calls: readonly CallDefinition[];
  transactions: readonly TransactionDefinition[];
  dialogue: readonly DialogueSequenceDefinition[];
}
```

Representative mail definition:

```ts
export interface MailMessageDefinition {
  id: MailMessageId;
  senderNameKey: TranslationKey;
  senderAddress: string;
  subjectKey: TranslationKey;
  previewKey: TranslationKey;
  bodyKey: TranslationKey;
  timestamp: string;
  initiallyRead?: boolean;
  link?: {
    pageId: BrowserPageId;
    labelKey: TranslationKey;
  };
}
```

`initiallyRead` seeds a new day only. Runtime read state belongs to the save. Fictional URLs, addresses, and phone numbers are data; narrative prose and accessible descriptions are translation keys.

## Consequences

```ts
export interface DailyConsequenceDefinition {
  id: ConsequenceId;
  priority: number;
  when: GameCondition;
  titleKey: TranslationKey;
  summaryKey: TranslationKey;
  behaviorNotes: readonly BehaviorNoteDefinition[];
  carryForwardEffects: readonly GameEffect[];
}
```

Exactly one primary daily consequence is selected; optional consequence notes may supplement it. Carry-forward effects are applied once when the player confirms the day review, then the next-day checkpoint is saved.

## Cross-day variants

Later days may select authored variants using campaign flags:

```ts
export interface ContentVariant<T> {
  when: GameCondition;
  value: T;
}
```

Variant rules:

- provide a default variant;
- prefer one or two relevant flags;
- do not enumerate every possible campaign state;
- do not change the learning objective or make a day unwinnable;
- each supported variant needs a route fixture.

## Validation

The validator must verify:

- exactly five ordered days and a valid initial day;
- Day 5 is the only day without `nextDayId`;
- globally unique persistent IDs;
- every stage, transition, event, content, evidence, dialogue, and consequence reference exists;
- every non-complete stage has an exit;
- required events have a resolution path or an ignored end-day path;
- background events are never used as hard blockers;
- consequence priorities are deterministic;
- carry-forward effects reference declared campaign state;
- every supported persistent-state fixture can complete every remaining day;
- all translation keys exist in all three locales;
- timestamps are valid ISO strings;
- URLs/phone details are fictional and non-live;
- asset paths are project-local.

## Editing workflow

1. Change a `day-0x.ts` definition or translations.
2. Run schema, reference, locale, and route validation.
3. Inspect the day from each relevant incoming campaign-state fixture.
4. Verify its end-day review and next-day checkpoint.
5. Update `FIVE_DAY_CAMPAIGN.md` or the relevant day design if player-facing behavior changed.
6. Never patch an application component solely for one day.

## Future visual editor

The editor can present each day as a bounded graph, events as checklist-like authored objects, and carry-forward effects as edges between daily state summaries. It should not expose arbitrary code execution.
