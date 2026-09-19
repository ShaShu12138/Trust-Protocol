# Trust Protocol — Localization Standards

## Purpose

Trust Protocol is designed for multiple languages from the beginning. User-visible text must be stored in locale resources rather than written directly inside components.

The current implementation supports:

- English (`en`), the fallback language;
- Simplified Chinese (`zh-CN`);
- Dutch (`nl`);
- browser-language detection;
- saved language preference;
- runtime language switching;
- translated accessibility labels;
- placeholder interpolation;
- locale-aware number, currency, and date formatting.

## Source structure

```text
src/
├── locales/
│   ├── en.json
│   ├── nl.json
│   └── zh-CN.json
└── localization/
    └── i18n.ts
```

English is the source and fallback locale. Its keys define the TypeScript `TranslationKey` union, so using an unknown key in application code produces a compile error.

## Required rule

Do not write user-visible prose directly in TypeScript templates.

Incorrect:

```ts
html`<button>Close window</button>`
```

Correct:

```ts
html`<button>${translate(locale, 'window.close', { title })}</button>`
```

This rule applies to:

- visible labels;
- buttons and menus;
- window titles;
- notifications;
- empty and loading states;
- validation and error messages;
- accessibility labels;
- tutorial text;
- dialogue and story content.

The project name, fictional brand names, IDs, domain names, and technical identifiers may remain untranslated when that is an explicit content decision.

## Key naming

Use lowercase dot-separated semantic keys:

```text
<feature>.<area>.<purpose>
```

Examples:

```text
desktop.emptyState
taskbar.languageLabel
window.close
mail.inbox.title
browser.error.unknownAddress
case01.email.bankAlert.subject
```

Keys describe meaning, not the English sentence. Avoid keys such as `clickHere` or `text1`.

## Adding a new string

1. Add the key and English value to `src/locales/en.json`.
2. Add the same key to every supported locale file.
3. Use the key through `translate(locale, key)`.
4. Run `npm run build` to catch unknown keys and type errors.
5. Inspect the longest expected translation in the real interface.

The runtime falls back to English if a translated value is absent, but missing translations should not be treated as finished work.

## Placeholders

Use named placeholders when a sentence contains dynamic values:

```json
{
  "window.close": "Close {title}"
}
```

```ts
translate(locale, 'window.close', { title });
```

Do not build sentences through concatenation because word order differs between languages.

Incorrect:

```ts
translate(locale, 'window.closePrefix') + title;
```

## Numbers, money, and dates

Use the helpers from `src/localization/i18n.ts`:

```ts
formatNumber(locale, value);
formatCurrency(locale, value, 'EUR');
formatDateTime(locale, timestamp, options);
```

Do not manually insert decimal separators, currency symbols, or date order.

Amounts and dates stored in game state should remain language-neutral values. Localise only when rendering them.

## Story content

Small interface strings currently live in locale JSON files. Larger future story content should use structured, language-neutral records containing translation keys rather than embedding prose directly in TypeScript.

Example:

```json
{
  "id": "bank-alert-01",
  "senderNameKey": "case01.sender.novaSecurity",
  "subjectKey": "case01.email.bankAlert.subject",
  "bodyKey": "case01.email.bankAlert.body"
}
```

If case content becomes large, it may be separated by locale and case rather than stored in the general UI dictionary. That decision should be documented in `CONTENT_SCHEMA.md` before implementation.

## Layout requirements

- Components must tolerate translated text becoming roughly 30–50% longer.
- Do not give buttons fixed widths unless the design provides safe overflow behavior.
- Use wrapping or ellipsis deliberately; do not clip essential evidence.
- Window titles may use ellipsis because the full title remains available through an accessible label.
- Test CJK text without relying on spaces for wrapping.
- Do not embed essential text in images.
- Right-to-left layout is not implemented yet, but new layouts should avoid assumptions that make it unnecessarily difficult.

## Fonts and glyph coverage

Any future project font must support every released language or define a compatible fallback stack. Font selection must be recorded in `ART_DIRECTION.md`.

Do not use decorative fonts for evidence such as URLs, phone numbers, dates, and transaction references.

## Locale selection

Initial locale priority:

1. saved player preference;
2. matching browser language;
3. English fallback.

Changing language updates the document `lang` attribute and saves the preference in `localStorage`.

The language picker displays each language in its own language—`English`, `简体中文`, and `Nederlands`—so it remains usable after an accidental language change.

## Adding a language

1. Add the locale code to `SUPPORTED_LOCALES`.
2. Add a locale JSON file containing every English key.
3. Add the file to the `messages` map.
4. Give `locale.name` the language's native name.
5. Confirm `Intl` formatting behavior for the locale.
6. Test window titles, controls, accessibility labels, and text expansion.
7. Update this document's supported-language list.

## Deferred localization work

- automated detection of missing keys across locale files;
- lazy-loading large case translations;
- plural-message syntax;
- grammatical gender or case handling;
- right-to-left interface mirroring;
- translator notes and external translation workflow;
- localized voice acting and subtitle timing.

Introduce a full ICU MessageFormat library only when pluralisation or grammar requirements justify the dependency.

## Change log

### 2026-09-19

- Added the localization service and typed translation keys.
- Added English, Simplified Chinese, and Dutch resources.
- Added browser detection, persistence, English fallback, and runtime switching.
- Added locale-aware number, currency, and date helpers.
- Removed current user-visible strings from desktop and window component code.
