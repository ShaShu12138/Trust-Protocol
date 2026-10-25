# Day 1 — The Security Review

## Role in the campaign

Day 1 is the first playable vertical slice of the five-day campaign. It teaches the desktop and the core verification loop without assuming prior knowledge. The former Case 01 design is retained here as one day rather than a standalone scenario.

- Target duration: 6–8 minutes.
- Principal event: Nova Bank new-device security email.
- Background mail: security digest and energy statement.
- Required apps: Mail, Browser, Nova Bank; Phone is used on the fullest safe/recovery routes.
- End state: Day 1 consequence review, followed by a campaign checkpoint.

## Daily objectives

Required item:

- resolve or explicitly ignore `event.day01.nova-security-review`.

Optional/background items:

- read the Civic Workspace security digest;
- read the Canal Energy statement;
- inspect ordinary Bank activity.

The day-end control becomes normally available when the required item is `resolved` or `deferred`. If it remains `unseen` or `open`, ending the day requires a warning confirmation and records it as `ignored`.

## Implemented opening sequence

The current playable opening intentionally starts without a tutorial or open application windows:

1. An unknown number calls immediately. The ringing card shows only the number, not a trusted nickname.
2. If answered, the caller claims to be bank support and says a confirmation email was sent.
3. Advancing the conversation without acting produces increasingly direct prompts, followed by a repeating “the system still shows no activity” pressure loop.
4. Declining or hanging up the suspicious call causes it to ring again after approximately three seconds.
5. The player may open Mail while the call continues. Selecting the email's confirmation link immediately interrupts/replaces the suspicious call with a police anti-fraud call.
6. When answered, police first say “Wait!!!!!”, then explain that a fraud group is impersonating bank staff and directing victims to emailed confirmation links.
7. The prototype deliberately stops after this explanation.

This is an authored prototype beat, not the final evidence model. The police interruption currently occurs at link activation—before any simulated form submission—so clicking can demonstrate consequence and timing without producing real loss. Later iteration must decide whether such an immediate rescue teaches the desired verification behavior or removes too much player agency.

## Primary event after the opening

The player receives an apparently legitimate Nova Bank email claiming an unfamiliar-device sign-in. It links to a fictional lookalike review page and supplies fake support contact details.

Independent search leads to the official fictional Nova Bank page with a different domain and phone number. The Bank application contains no authorized security-review request at the start of the day.

Opening the email is neutral. Meaningful actions are inspecting its sender, independently locating the bank, comparing details, checking Bank activity, choosing a contact channel, and responding to any consequence.

## Evidence

| ID | Discovery | Observation |
|---|---|---|
| `evidence.day01.sender-domain` | Inspect sender details | Display name and sending domain differ. |
| `evidence.day01.domain-mismatch` | Compare linked and official pages | The domains are not the same. |
| `evidence.day01.contact-mismatch` | Compare support numbers | The supplied number is not independently verified. |
| `evidence.day01.no-bank-review` | Inspect Bank notices/activity | The claimed review is absent. |
| `evidence.day01.pressure-script` | Continue fake-support contact | The speaker discourages independent verification. |
| `evidence.day01.independent-source` | Reach official site independently | The player established a separate source. |
| `evidence.day01.pending-transfer` | Inspect Bank after unsafe submission | A pending consequence is visible. |

Evidence records observations rather than labels such as “fraud” or “correct answer.”

## Resolution routes

### Verified safely

The player finds an independent official channel and confirms the claim is not legitimate, or checks trusted Bank notices and avoids the supplied channel.

Daily consequence: no financial exposure; verified-channel behavior is highlighted.

Campaign effects:

- set `campaign.bank-alerted` when a report/official call is completed;
- do not set `campaign.info-exposed`.

### Unsafe exposure

The player follows the supplied channel and submits the simulated verification interaction. A pending transfer or account-risk state appears.

Daily consequence: information exposure and a concrete account warning.

Campaign effects:

- set `campaign.info-exposed`;
- optionally set an account restriction that creates a legitimate inconvenience on a later day.

### Recovery

After unsafe exposure, the player notices the pending consequence, freezes/reports through the trusted Bank application, and contacts official support.

Daily consequence: the immediate loss is prevented, but exposed information remains relevant.

Campaign effects:

- set both `campaign.info-exposed` and `campaign.bank-alerted`;
- Day 2 may contain more personalized suspicious content plus a legitimate follow-up.

### Avoidance / excessive distrust

The player rejects or ignores the request without meaningful verification.

Daily consequence: no immediate loss, but the claim remains unverified and the review explains the difference between safety by avoidance and a reusable verification method.

Campaign effects: neither core flag is necessarily set.

## Day state graph

```text
day01.briefing
  -> day01.active

day01.active
  -> day01.resolved-safe
  -> day01.exposed
  -> day01.ignored                 [end-day warning confirmed]

day01.exposed
  -> day01.recovered
  -> day01.loss-contained-late

all daily resolutions
  -> day01.review
  -> day02.briefing                [review confirmed + checkpoint saved]
```

There is no real-time countdown. Pressure comes from authored dialogue and action order.

## Day-end review

Show:

- which channel introduced the claim;
- whether the player found an independent source;
- which sender/domain/contact details were compared;
- whether trusted account activity was checked;
- any information exposure or financial consequence;
- whether the player recovered;
- which campaign conditions will affect tomorrow.

## Editing rules

- Applications never contain `day01` branches.
- Story content, required-item status, evidence rules, consequence text, and carry-forward effects are data.
- Translation keys contain prose; identifiers remain language-neutral.
- Adding a background message must not silently make it required.
- The required-event exit conditions and all route fixtures must be updated together.

## Day 1 acceptance criteria

- The day can end through verified, exposed, recovered, and ignored fixtures.
- Background messages do not block progression.
- An unresolved required event triggers a clear end-day warning.
- The consequence review accurately reflects the action log.
- Review confirmation produces a deterministic Day 2 checkpoint.
- No route uses a real URL, bank, account, or phone number.
