# Trust Protocol — Five-Day Campaign

> 最新第一天规则：以 [DAY_01_DESIGN.md](DAY_01_DESIGN.md) 的线性版本为准。必须点击链接触发警方，信息在故事开始前已泄露，官网核验后标注邮件即结束。此前第一天自由调查、转账补救、任意结束及 v1 存档描述已被替换；当前使用 v2 存档，28 项测试通过。

> Concrete five-day rules (2026-10-26): [PLAYABLE_CAMPAIGN_SPEC.md](PLAYABLE_CAMPAIGN_SPEC.md). Use that specification for exact flag semantics, daily scenarios, transaction timing, and final profiles where this earlier outline differs.

## Purpose

This document is the authoritative campaign-level design. The game is one continuous five-day experience, not a menu of five unrelated cases. Each day contains ordinary communication, legitimate tasks, and one principal fraud-related situation. Player choices create immediate consequences and a small number of persistent conditions that alter later days.

## Experience target

- Total play time: 30–40 minutes.
- Day length: approximately 5–8 minutes.
- Natural save point: start and end of every day.
- Applications: Mail, Browser, Nova Bank, Phone/Contacts.
- Languages: English, Simplified Chinese, Dutch.
- No live internet, real financial service, account, or phone call.

The five-day arc teaches a method rather than five scam answers:

> Treat a message as a claim, verify it through an independently chosen channel, and respond proportionately.

## Campaign rhythm

```text
Prologue and tutorial
  -> Day briefing
  -> Desktop work period
  -> End-day confirmation
  -> Consequence review
  -> Persistent-state update and checkpoint save
  -> Next day

After Day 5
  -> Campaign review
```

## Daily content budget

Each day should normally contain:

- one principal event requiring investigation;
- one secondary task or follow-up;
- one or two ordinary background messages;
- zero or one scheduled/incoming call;
- two to three meaningful daily consequence variants;
- no more than two persistent changes passed into the next day.

This is a production ceiling. Adding more inbox items does not automatically make a day more interesting.

## What counts as handled

Items have an explicit resolution state:

- `unseen` — available but not opened;
- `open` — inspected but not decided;
- `resolved` — necessary action or verification completed;
- `deferred` — deliberately left for later;
- `ignored` — the player ends the day without addressing it.

Only required items block the normal end-day action. Background items never block progression. The player may still end a day with unresolved required items after a warning; doing so records an explicit `ignored` resolution so omission can have authored consequences.

Opening every message is not the objective. The game evaluates decisions and verification behavior, not inbox completion.

## Five-day outline

### Day 1 — The unfamiliar request

Primary event: a Nova Bank security-review email claims a new-device sign-in.

Learning focus:

- a message is only one source;
- display name is not proof of sender identity;
- find the bank independently rather than following the supplied channel.

Persistent consequences:

- `campaign.info-exposed` if simulated details are submitted;
- `campaign.bank-alerted` if official support is contacted/reporting is completed.

Detailed design: `DAY_01_DESIGN.md`.

### Day 2 — A familiar identity

Primary event: a friend or colleague requests urgent help through a new account/channel.

Learning focus:

- familiarity of name and tone is not identity proof;
- verify a person through a previously trusted channel;
- refusing everything is different from verifying safely.

Day 1 variation:

- if information was exposed, the impersonation includes more convincing personal context;
- if the bank was alerted, a legitimate bank follow-up appears as a secondary task.

Persistent consequences:

- `campaign.contact-compromised` if the impersonator receives engagement or funds;
- `campaign.social-verified` if the player independently contacts the real person.

### Day 3 — Pressure on the phone

Primary event: a caller claiming to represent Nova Bank references plausible account details and asks the player to act in the Bank application.

Learning focus:

- caller ID and personal knowledge are not authentication;
- urgency and secrecy are behavioral evidence;
- hang up and call an independently sourced number.

Prior variation:

- exposed information changes the fake caller's script;
- prior reporting changes what legitimate support already knows;
- a previous banking restriction may cause a real service inconvenience.

Persistent consequences:

- `campaign.account-at-risk` if an approval/security action benefits the caller;
- `campaign.official-channel-established` after a verified callback.

### Day 4 — Attention under load

Primary event: work and personal requests arrive together, including a shared-file or credential request.

Learning focus:

- transfer the verification habit to a non-bank context;
- distinguish urgency from importance;
- inspect the destination and sender before opening/signing in.

Prior variation:

- frozen-card or account protections may cause a legitimate payment failure;
- a compromised contact can introduce the malicious work request;
- strong prior verification may produce clearer trusted-channel shortcuts.

Persistent consequences:

- `campaign.work-access-exposed` if credentials are submitted;
- `campaign.work-incident-reported` if the player verifies and reports correctly.

### Day 5 — A real problem through a false channel

Primary event: real suspicious account activity exists, while an impersonator simultaneously offers a false solution through mail or phone.

Learning focus:

- a true problem does not make every messenger trustworthy;
- correlate Mail, Browser, Bank, and Phone evidence;
- contain harm through verified channels.

The final situation is assembled from a small number of authored variants based on persistent flags. It must not generate a unique branch for every previous click.

## Consequence review between days

The end-of-day review contains three layers:

1. **What happened today** — transactions, completed tasks, exposed information, prevented harm, or missed obligations.
2. **How the player worked** — independent verification, comparison, pressure response, proportionate trust, and recovery.
3. **What carries forward** — one or two clearly explained changes that may affect tomorrow.

Avoid a single accuracy score. Consequences should describe behavior without calling the player stupid, careless, or morally bad.

The player confirms the review before the next day begins. The checkpoint save occurs after consequences are applied, so reloading cannot reroll them.

## Persistent state budget

Persistent campaign flags are deliberately few and coarse. Recommended maximum: eight booleans plus financial/relationship status values.

Core candidates:

- `campaign.info-exposed`;
- `campaign.bank-alerted`;
- `campaign.contact-compromised`;
- `campaign.social-verified`;
- `campaign.account-at-risk`;
- `campaign.official-channel-established`;
- `campaign.work-access-exposed`;
- `campaign.work-incident-reported`.

Daily content may read these flags to select a variant. It must not mutate earlier day definitions or create arbitrary procedural dialogue.

## Final review

After Day 5, reconstruct the five-day timeline and summarize:

- claims received and channels used;
- independent verification habits;
- details compared;
- responses to urgency and authority;
- mistakes and successful recovery;
- downstream consequences;
- one transferable real-world protocol.

The final review selects a behavioral profile, not a good/bad rank. Current profile directions remain: calm verifier, convenience-first loss, recovery expert, and excessive distrust.

## Scope controls

- No free-form internet or dialogue generation.
- No more than one principal investigation per day.
- A persistent flag may select authored content, not create a new subsystem.
- Most daily decisions converge at the day review.
- Later days acknowledge earlier choices through content variants and state changes, not wholly separate levels.
- The first playable milestone implements Day 1 plus its consequence review before Days 2–5 are authored.

## Acceptance criteria

- Every day contains both legitimate and suspicious content.
- A player can end each day without opening every background item.
- Ignoring a required item is an explicit, warned decision.
- Every day has at least one safe, unsafe, and recovery-aware resolution.
- At least one earlier choice visibly changes each later day.
- All five days remain completable from every supported persistent-state fixture.
- The campaign can be saved and resumed at every day boundary.
