# Trust Protocol — Art Direction and Asset Standards

## Document purpose

This is the living source of truth for the visual identity and art-asset pipeline of Trust Protocol. It exists to keep assets coherent as the prototype grows and to prevent individual applications, fictional brands, and story cases from drifting into unrelated styles.

Update this document whenever the project introduces:

- a new asset category;
- a new fictional brand;
- a new visual state or UI pattern;
- a new export size or file format;
- an external asset source or licence;
- a change to the colour, type, icon, illustration, or motion systems.

Rules marked **Required** should not be broken without documenting the reason. Rules marked **Provisional** are current working decisions that may change after user testing.

## Current status

The project currently contains only a simulated desktop and generic empty windows. The existing colours, grid texture, window chrome, and typography are an initial direction rather than a locked final style.

No production art assets have been approved yet.

## Art-direction statement

Trust Protocol should look like a believable personal computer interpreted through a warm editorial investigation aesthetic.

The visual identity combines:

- a restrained contemporary operating system;
- tactile paper, evidence, and archive references;
- trustworthy financial-product clarity;
- small traces of human imperfection;
- rising informational pressure without visual chaos.

The player should feel that ordinary digital life is becoming increasingly difficult to verify. The interface must remain usable and calm enough for close reading even when the narrative becomes tense.

## Visual pillars

### 1. Familiar, but fictional

Applications should be immediately understandable without copying Windows, macOS, ING, Gmail, Chrome, or another real product.

Use familiar interaction patterns such as:

- title bars;
- taskbar entries;
- address bars;
- inbox lists;
- transaction rows;
- call controls.

Do not reproduce real layouts, logos, brand colours, or proprietary icon arrangements closely enough to imply affiliation.

### 2. Evidence is readable

The player must be able to compare names, dates, addresses, domains, phone numbers, and transaction details across windows.

Readability has priority over decorative texture. Important evidence must never be hidden by:

- low contrast;
- distressed type;
- heavy grain;
- motion;
- tiny text;
- extreme perspective;
- decorative handwriting.

### 3. Suspicion is not colour-coded

Fraudulent content should not automatically look sinister, broken, or red. Real and fraudulent messages should share the same basic production quality.

The player should identify deception through evidence and inconsistency, not art-direction spoilers.

### 4. Warm technology

The overall system should feel human and slightly tactile rather than sterile or futuristic. Use warm neutral surfaces, restrained shadows, paper-like layers, and a limited accent palette.

Avoid cyberpunk neon, code rain, hooded-hacker imagery, aggressive glitch effects, and constant red warnings.

### 5. Pressure through density, not obstruction

Later scenes may introduce more windows, notifications, or competing events, but the game should not deliberately make controls unreadable or inaccessible.

Tension may be expressed through:

- more frequent notifications;
- overlapping information;
- shorter narrative response windows;
- denser taskbar activity;
- restrained sound and motion;
- changes in composition and rhythm.

It should not be expressed through flashing, shaking text, disappearing buttons, or illegible blur.

## Visual hierarchy

The screen contains three distinct visual layers.

### Layer A — Operating system

Examples:

- desktop background;
- windows;
- title bars;
- taskbar;
- system notifications;
- cursor and focus states.

This layer should be visually consistent throughout the game. It is the stable frame through which the player interprets changing content.

### Layer B — Applications

Examples:

- Mail;
- Browser;
- Nova Bank;
- Phone and Contacts;
- future Files, Calendar, or Security applications.

Applications may have individual accent colours and layouts, but they must share the operating system's spacing, controls, typography, and accessibility rules.

### Layer C — In-world content

Examples:

- emails;
- websites;
- fictional brands;
- profile pictures;
- invoices;
- bank cards;
- documents;
- advertisements.

This layer may intentionally contain inconsistent brands and visual voices because it represents different organisations and people. It must still meet minimum readability and production-quality requirements.

## Colour system

The following palette is **Provisional**. Final values should become CSS design tokens rather than being repeated directly throughout components.

### System neutrals

| Role | Working value | Use |
|---|---:|---|
| Desktop light | `#DAD5C8` | Main desktop field |
| Desktop dark | `#B9B5AA` | Desktop depth and gradient |
| Window surface | `#F7F3E8` | Primary window body |
| Window chrome | `#DFDACC` | Title bars and taskbar |
| Primary ink | `#252822` | Main text and strong controls |
| Secondary ink | `#666A61` | Metadata and supporting text |
| Structural line | `rgba(51, 54, 47, 0.28)` | Dividers and boundaries |

### Semantic accents

| Role | Direction | Use |
|---|---|---|
| System accent | Burnt orange | Selected and active states |
| Verified | Desaturated green | Independently verified information |
| Caution | Amber | Unresolved or time-sensitive information |
| Destructive | Muted red | Actual loss, destructive action, or critical failure |
| Informational | Dusty blue | Neutral system information |

### Colour rules

- **Required:** Colour must never be the only carrier of meaning.
- Pair semantic colours with labels, icons, shapes, or text.
- Red is reserved for actual danger or destructive actions, not every suspicious clue.
- Individual fictional brands may introduce one primary and one secondary colour.
- Brand colours must not override system focus, error, or accessibility states.
- Large decorative areas should use lower saturation than small interactive accents.
- Light and dark themes are not required for the first playable prototype. If a dark theme is added, it must be authored rather than generated by simple inversion.

## Typography

### System typography

Use a modern humanist sans-serif for most operating-system and application UI.

Preferred qualities:

- excellent rendering at 12–18 px;
- distinguishable `I`, `l`, `1`, `O`, and `0`;
- broad language support;
- multiple practical weights;
- open licence where possible.

Current implementation uses the system font stack. This remains acceptable until a project font is deliberately selected.

### Evidence typography

Use a monospace font selectively for:

- URLs;
- email addresses;
- phone numbers;
- transaction references;
- timestamps;
- technical identifiers.

Do not use monospace for long email bodies or dialogue.

### Typography rules

- **Required:** Essential text should not be rasterised into images.
- Body text should normally be at least 14 px in application content.
- Supporting metadata should normally be at least 12 px.
- Avoid weights below 400 for essential text.
- Use no more than three font families across the operating system and core applications.
- Fictional advertisements may use display type, but evidence must remain selectable, readable text.
- Do not use all caps for paragraphs. Reserve it for short system labels.
- Any selected font must cover every released language or define a visually compatible fallback stack.
- Interface layouts must be reviewed with longer translations and CJK text before visual approval.

## Shape, depth, and texture

### Geometry

- Windows use modest corner radii rather than highly rounded mobile-style cards.
- Small controls may use slightly tighter radii than windows.
- Application content should rely on alignment and spacing before adding containers.
- Avoid nesting many rounded cards inside rounded windows.

### Shadows

Shadows communicate window depth and focus.

- Focused windows receive a stronger shadow and clearer boundary.
- Unfocused windows remain visible but visually recede.
- Shadows should not be used on every row, button, or document.
- Shadow direction and softness must remain consistent across the operating system.

### Texture

Permitted textures include:

- subtle paper grain;
- low-opacity grid patterns;
- restrained printing imperfections in in-world documents;
- gentle noise in chapter illustrations.

Texture must not reduce contrast or interfere with small evidence.

## Icon system

### Style

Core system icons should use one coherent vector family with:

- rounded or softly squared line endings;
- consistent stroke width;
- simple geometry;
- no embedded text;
- good readability at 16, 20, and 24 px.

### Required icon categories

#### Operating-system icons

- close;
- minimize;
- restore/maximize if introduced;
- notifications;
- sound;
- network;
- settings;
- search.

#### Application icons

- Mail;
- Browser;
- Bank;
- Phone;
- Contacts;
- future Files, Calendar, Security, and Notes.

#### Evidence-action icons

- inspect sender;
- inspect link;
- verify contact;
- call;
- report;
- freeze card;
- check activity;
- mark or pin evidence.

### Icon rules

- **Required:** Interactive icons must have text labels or accessible names.
- Do not mix filled, outline, hand-drawn, and realistic icon styles in the system layer.
- Use SVG for interface icons.
- Do not communicate “safe” and “unsafe” only by changing icon colour.
- Application icons may be more illustrative than action icons but should share silhouette weight.

## Illustration system

Illustration is secondary to the interactive interface. It supports characters, chapter transitions, and atmosphere rather than replacing gameplay information.

### Recommended style

- editorial 2D illustration;
- simplified geometry;
- restrained detail;
- slightly textured colour fields;
- natural, inclusive characters;
- subtle facial expression rather than exaggerated cartoon emotion.

### Character portraits

For the first case, plan for:

- the player identity or a neutral player marker;
- a friend or family contact;
- an official support agent;
- a suspicious or unknown caller;
- one workplace contact if needed by the story.

Each important character may eventually require:

- neutral;
- concerned;
- urgent;
- relieved;
- disappointed or frustrated.

The first playable case should reuse neutral portraits wherever possible. Do not commission a full expression set before dialogue testing proves it necessary.

### Character portrait specification

- Master source: vector or layered raster at a minimum of `1024 × 1024`.
- Runtime export: WebP or PNG at `256 × 256` and `512 × 512`.
- Composition: head and upper shoulders, centred with safe padding.
- Background: transparent or a simple brand-neutral field.
- Avoid tiny accessories that disappear below 64 px.

### Chapter illustrations

Chapter illustrations are optional for the first playable case. If introduced:

- landscape master at `2560 × 1440` or larger;
- key content inside a central safe region;
- WebP runtime export;
- no essential text embedded in the image;
- provide an accessible text description.

## Fictional brands

All banks, delivery companies, investment services, employers, shops, and platforms should be fictional unless the project later receives explicit permission to use a real brand.

### Brand kit per organisation

Each recurring fictional organisation should have a small documented kit:

- name;
- purpose in the story;
- primary logo;
- simplified icon mark;
- primary colour;
- secondary colour;
- type treatment;
- website domain;
- email domain;
- support phone number format;
- legitimate and fraudulent variants used in the case.

### Nova Bank working direction

Nova Bank is the provisional core bank brand.

It should feel:

- competent;
- neutral;
- accessible;
- modern without looking like a technology start-up;
- clearly fictional;
- distinct from ING and other real banks.

Do not use ING orange, ING's lion mark, its typography, or a close reconstruction of its interfaces as Nova Bank's identity.

### Fraudulent brand variants

Fraudulent sites and messages may imitate fictional brands within the story, but the imitation should be authored deliberately.

Document every difference that players may discover, for example:

- altered domain;
- secondary logo variation;
- wrong support number;
- inconsistent footer;
- outdated colour;
- incorrect legal name.

Do not make every fraudulent asset visibly lower quality. Sophisticated scams should appear professionally produced.

## Application asset categories

### Desktop and window assets

- desktop wallpaper or procedural background;
- taskbar surfaces;
- focus, hover, pressed, disabled, and notification states;
- system icons;
- cursor states if custom cursors are later required.

Prefer CSS for surfaces, gradients, borders, shadows, and simple patterns. Do not export these as raster images unless a texture cannot be reproduced economically.

### Mail assets

- sender avatars;
- attachment icons;
- organisation logos;
- email signatures;
- promotional banners where narratively necessary;
- legitimate and fraudulent email templates.

Email body text should remain HTML text rather than part of screenshots.

### Browser assets

- favicon set;
- fictional website logos;
- product imagery;
- advertisement graphics;
- article thumbnails;
- search-result thumbnails where needed;
- browser security and navigation icons.

Websites should be implemented as responsive HTML/CSS whenever the player must inspect or interact with them. Use raster screenshots only for non-interactive background content.

### Bank assets

- Nova Bank logo and app icon;
- account and card illustrations;
- transaction category icons;
- security-state icons;
- merchant marks;
- support-agent portraits;
- optional payment or transfer illustrations.

Use obviously fictional card and account data. Never include real financial information in source assets.

### Phone and contacts assets

- contact avatars;
- call-state icons;
- keypad symbols;
- voicemail waveform or playback decoration;
- incoming-call backgrounds if required.

Voice content, subtitles, and dialogue structure are content assets and should be specified separately from the visual portrait assets.

### Documents and evidence

- invoices;
- receipts;
- bank statements;
- booking confirmations;
- identity-neutral account notices;
- screenshots;
- QR codes created solely for the fictional environment.

Whenever practical, documents should be assembled from HTML/CSS and structured data so names, dates, amounts, and identifiers remain testable and localisable.

## UI-state asset matrix

Every reusable interactive control should define only the states it actually needs.

Potential states:

| State | Visual requirement |
|---|---|
| Default | Clear neutral appearance |
| Hover | Secondary pointer feedback |
| Focus-visible | Strong keyboard focus indicator |
| Pressed | Immediate action feedback |
| Selected | Persistent selected state with non-colour cue |
| Disabled | Clearly unavailable while remaining legible |
| Loading | Stable layout; avoid unnecessary looping animation |
| Error | Explanation plus semantic icon/label |
| Verified | Independent verification, not merely “looks safe” |
| Unread | Noticeable without overpowering evidence |

Do not automatically create separate raster assets for these states. Prefer CSS and SVG state changes.

## Motion principles

Motion should explain state change rather than decorate every interaction.

Recommended uses:

- a window moving with the pointer;
- a window minimizing to the taskbar;
- a notification entering and leaving;
- focus changing between windows;
- a new message arriving;
- a verified item being added to an evidence board.

Rules:

- **Required:** Respect `prefers-reduced-motion`.
- Avoid looping ambient UI animation.
- Avoid shaking windows to indicate errors.
- Keep ordinary interface transitions short and interruptible.
- Do not use animation as the only explanation of what changed.

## Asset formats

### Preferred source formats

| Asset type | Source format |
|---|---|
| Interface icon | SVG source |
| Logo and brand mark | SVG source |
| Character portrait | SVG or layered raster source |
| Illustration | SVG or layered raster source |
| Texture | Lossless PNG or layered raster source |
| Photograph, if ever used | Original high-quality source |

### Preferred runtime formats

| Asset type | Runtime format |
|---|---|
| Icons and logos | Optimised SVG |
| Illustrations | WebP, with PNG only when necessary |
| Transparent portraits | WebP or PNG |
| Small textures | WebP or PNG |
| Simple gradients and shapes | CSS |

Do not commit editable source files such as PSD, AI, or very large layered documents without first defining a storage policy. They can quickly make the Git repository unnecessarily large.

## Resolution and density

- Author raster UI assets at a minimum of 2× their largest expected CSS display size.
- Avoid upscaling raster assets at runtime.
- SVG assets must include a valid `viewBox`.
- Keep important portrait features readable at 64 px.
- Test interface icons at 16, 20, and 24 px.
- Test application icons at 32, 48, and 64 px.
- Avoid text inside raster assets so scaling and localisation remain possible.

## Folder structure

Create asset folders only when the first asset of that category is introduced.

Recommended structure:

```text
public/
└── assets/
    ├── system/
    │   ├── icons/
    │   ├── wallpapers/
    │   └── textures/
    ├── brands/
    │   ├── nova-bank/
    │   └── other-brand-name/
    ├── characters/
    │   └── character-id/
    ├── applications/
    │   ├── mail/
    │   ├── browser/
    │   ├── bank/
    │   └── phone/
    ├── cases/
    │   └── case-01/
    └── shared/
```

Assets used by only one story case belong under that case. Assets reused across cases belong under `system`, `brands`, `characters`, `applications`, or `shared`.

Do not create duplicate files in multiple folders. Reference the shared asset from code.

## File naming

Use lowercase kebab-case ASCII names.

Pattern:

```text
<category>-<subject>-<variant>-<size>.<extension>
```

Examples:

```text
icon-mail-outline.svg
icon-call-end-filled.svg
portrait-maya-neutral-512.webp
portrait-maya-concerned-512.webp
brand-nova-bank-logo-horizontal.svg
brand-nova-bank-mark.svg
case-01-parcel-banner-1600.webp
texture-paper-grain-512.webp
```

Rules:

- Do not use spaces.
- Do not use names such as `final`, `final2`, or `new-version`.
- Use semantic variants such as `neutral`, `concerned`, `official`, or `imitation`.
- Add numeric size suffixes only to raster assets with multiple exports.
- Do not add `@2x` when the file already includes its pixel dimensions.

## Asset registry

Every externally sourced or generated production asset must be entered in an asset registry. Create `docs/ASSET_REGISTRY.md` when the first external or generated asset is added.

Each entry should record:

| Field | Description |
|---|---|
| Asset path | Repository path |
| Description | What the asset represents |
| Author | Person, studio, tool, or source |
| Source | Original URL or internal source reference |
| Licence | Applicable licence or usage agreement |
| Modified | What was changed |
| AI-assisted | Yes/no and tool if applicable |
| Approved | Reviewer and date |

Do not use unlicensed images found through search engines. Do not assume that an asset is reusable because it can be downloaded.

## AI-assisted assets

AI image generation may be used for exploration or production only if the project records it transparently and the result can be kept visually consistent.

Rules:

- Record the tool and purpose in the asset registry.
- Do not imitate a living artist or named studio style.
- Do not generate real bank logos, real employee likenesses, or deceptive evidence involving real people.
- Check hands, text, UI symbols, financial numbers, and repeated character identity carefully.
- Rebuild essential logos, icons, and evidence as controlled vector or HTML assets rather than relying on generated text.
- Do not use generated imagery merely to fill empty space.

## Accessibility requirements

- Text contrast should target WCAG AA for ordinary UI text.
- Meaning must not depend on colour alone.
- Essential information must remain available without hover.
- Images carrying narrative meaning require alternative text or an equivalent description.
- Decorative images should be hidden from assistive technology.
- Interactive target sizes should remain practical for touch input.
- Zooming the browser to 200% must not remove essential information or controls.
- Motion should respect reduced-motion preferences.
- Fake visual impairments should not be used as a substitute for authentic accessibility research.

## Legal and ethical guardrails

- Use fictional financial institutions and products.
- Do not imply endorsement by ING or another real organisation.
- Do not include real account numbers, addresses, phone numbers, or personal data.
- Use reserved or clearly fictional domains in authored content where practical.
- Do not publish functional phishing forms or collect credentials.
- QR codes and links used in the game must remain inside the fictional environment.
- Security education should avoid blaming victims or portraying them as unintelligent.

## Asset review checklist

Before approving an asset, verify:

- Does it belong to the correct visual layer?
- Does it match the established style and stroke weight?
- Is it readable at its actual in-game size?
- Does it reveal a gameplay answer unintentionally?
- Is essential information represented as real text where possible?
- Is the asset accessible without relying only on colour?
- Is the organisation or person fictional?
- Are source and licence recorded?
- Are the file name, folder, and format correct?
- Is the runtime file reasonably optimised?
- Does it need light, dark, selected, or reduced-motion handling?
- Has it been tested inside the actual window or application context?

## Decision log

Record material art-direction changes here. Small asset additions belong in the asset registry instead.

### 2026-09-19 — Initial direction

- Defined the visual identity as a modern fictional desktop with warm editorial investigation qualities.
- Separated operating-system, application, and in-world content layers.
- Chose a restrained warm-neutral system palette as a provisional direction.
- Required fictional brands and prohibited close imitation of ING or other real institutions.
- Established SVG-first interface assets, WebP/PNG raster exports, naming rules, and a future asset registry.
- Deferred final font selection, production character art, and complete brand kits.

## Open decisions

Resolve these only when the related feature enters production:

- final system typeface;
- final desktop accent colour;
- light-theme-only versus authored dark theme;
- vector versus painted character portraits;
- whether chapter illustrations are necessary;
- whether custom cursors add meaningful value;
- exact Nova Bank identity;
- external asset storage policy for large editable source files.
