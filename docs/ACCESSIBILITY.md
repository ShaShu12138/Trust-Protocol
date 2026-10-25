# Trust Protocol — Accessibility Requirements

## Purpose

This document defines testable accessibility requirements for the first playable version. Target baseline: WCAG 2.2 AA where applicable to a simulated desktop game.

## Principles

- Fraud evidence is never communicated through color alone.
- Simulation realism does not override usability.
- Time pressure can be paused.
- Every audio event has a text equivalent.
- Mistakes do not trap the player in inaccessible recovery paths.

## Keyboard

- All controls use native buttons, links, inputs, or equivalent semantics.
- Tab order follows the active window and then persistent desktop controls.
- Focus is always visible.
- Minimized applications are keyboard-restorable.
- Essential functionality does not require pointer dragging.
- Before formal evaluation, provide keyboard alternatives for moving/rearranging windows or a deterministic layout command.
- Pointer resizing currently has no keyboard alternative. Before formal evaluation, add preset sizes, maximize/restore, or another deterministic keyboard-operable layout control.
- Escape closes non-destructive overlays and pause menus according to documented priority.
- Modal dialogue moves focus to its primary action, cycles Tab focus within its actions, and supports Escape only when a dismiss/secondary action exists.

## Focus management

- Opening a modal moves focus into it.
- Closing a modal returns focus to the invoking control.
- Opening/focusing an application announces its title without repeatedly announcing during pointer drag.
- Inactive windows must not expose hidden/minimized controls in the tab order.
- Route and stage changes move focus to a meaningful heading or status region.

## Screen readers and semantics

- Desktop and taskbar have accessible landmarks and names.
- Every window has an accessible title.
- Window controls include the target window name.
- Lists, messages, transactions, contacts, and search results use appropriate list/article/table semantics.
- Important game-state changes use a restrained `aria-live` region.
- Decorative art uses empty alternative text; evidence art receives a localized description only when it conveys information not already present in text.

## Visual requirements

- Normal text contrast: at least 4.5:1.
- Large text and essential graphical controls: at least 3:1.
- Focus indicators remain visible against all surfaces.
- Evidence differences include text/shape/position cues, not only red versus teal.
- Interface remains usable at 200% browser zoom.
- Text can expand 50% without losing essential content.
- Minimum target size goal: 24 by 24 CSS pixels; primary controls should aim for 44 by 44 where layout permits.

## Motion

- Respect `prefers-reduced-motion`.
- Incoming-call shaking is disabled under `prefers-reduced-motion` and replaced with a static emphasized outline.
- No flashing content above safe thresholds.
- Window movement follows direct input and does not add inertia.
- Non-essential transitions can be disabled.
- Narrative progress never depends on watching an animation.

## Audio and calls

- Calls always provide synchronized or equivalent text.
- Critical clues are never audio-only.
- Separate controls for master audio and voice if voice is added.
- Incoming-call cues include a visual and screen-reader announcement.

## Cognitive accessibility

- Use consistent application layouts and control placement.
- Separate observation from judgment: describe what differs before labeling meaning.
- Provide progressive hints without penalty.
- Allow pause and review of prior messages/calls.
- Avoid deceptive controls that imitate real consent or payment dialogs too closely.
- Confirm irreversible/reset actions.

## Language

- Set document `lang` to the selected locale.
- Test English, Simplified Chinese, and Dutch at 200% zoom.
- Do not encode essential prose in images.
- URLs, phone numbers, dates, and currency remain selectable/readable text.

## Testing checklist

- Keyboard-only complete safe route.
- Keyboard-only complete recovery route.
- Screen-reader smoke test of start, Mail, Browser, Bank, Phone, and review.
- 200% zoom at common laptop viewport.
- Windows High Contrast/forced-colors smoke test.
- Reduced-motion test.
- Color-blind simulation plus text-cue inspection.
- Touch target test on a narrow viewport.

## Known current gaps

- Keyboard window movement is not implemented.
- No full application content exists yet.
- Automated accessibility tooling is not configured.
- Screen-reader behavior across nested Shadow DOM remains unverified.

These gaps block a claim of first-version accessibility completion but do not block continued implementation.

## Release gate

All critical/serious automated findings and keyboard route blockers must be resolved. Remaining limitations must be documented with impact and a concrete follow-up.
