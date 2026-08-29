# Agivant JSON Data Rules & Normalization Guide

**Document purpose:** Single source of truth for creating, cleaning, normalizing, and reviewing Agivant JSON data.

**Scope:** This document governs JSON content files created from existing `.ts` data, new page data, and future content migrations. It is based on the approved backend reference JSON supplied by Sir, plus the conventions already validated in the Agivant implementation (`case-study.json`, `solutionPage.json`, and `proof.json`).

---

## 1. Core Principle

The JSON file describes **content and data**, not frontend presentation.

Use this separation:

```text
JSON
  ↓
WHAT the page/section says
  ↓
TS
  ↓
types + data access + adapters
  ↓
TSX
  ↓
HOW the data is rendered
  ↓
CSS
  ↓
HOW it looks
```

### JSON may contain

- page identity
- slugs
- titles/headings
- descriptions/body copy
- authors
- section/block content
- media references
- CTA labels and destinations
- filter/taxonomy metadata where applicable
- SEO content
- nullable content fields required by the contract

### JSON must NOT contain

- CSS classes
- font sizes
- colors
- spacing
- animation values
- GSAP settings
- layout coordinates
- component names
- React/TSX markup
- presentation-only implementation instructions

---

# 2. Source-of-Truth Hierarchy

When creating or cleaning JSON, use this order:

1. **Sir's approved/reference JSON contract**
2. **Actual client/Figma content**
3. **Existing approved Agivant JSON already normalized to that contract**
4. **Existing TS data, only as the source of content that still needs normalization**
5. **Never guess missing structure or content**

If the source files do not establish something, mark it as **unknown** and do not invent a schema.

---

# 3. Universal Page Envelope

Sir's reference files establish a common top-level envelope across the supplied content types:

```json
{
  "schemaVersion": "1.0",
  "pageType": "blog | caseStudy | partnershipLanding | solution",
  "slug": "string",
  "title": "string",
  "seo": {
    "title": null,
    "description": null,
    "canonical": null,
    "ogImage": null
  },
  "hero": {
    "eyebrow": null,
    "title": "string",
    "subtitle": null,
    "summary": null,
    "authors": [],
    "partner": null,
    "media": null,
    "primaryCta": null,
    "secondaryCta": null
  },
  "sections": [],
  "footerCta": {
    "enabled": true,
    "heading": "string",
    "subheading": null,
    "partner": null,
    "primaryCta": null,
    "secondaryCta": null
  }
}
```

### Rules

- Use `schemaVersion: "1.0"` for the current contract.
- `pageType` must identify the content type.
- `slug` is the canonical identity used for routing.
- `title` is the page title.
- Use the common `seo`, `hero`, `sections`, and `footerCta` envelope for full page documents when the relevant backend contract applies.
- Do not rename these fields into page-specific alternatives.

---

# 4. Nullability Rule

Sir's reference files consistently keep contract fields present even when they are unused.

Therefore:

> **If a field belongs to the approved contract but has no value, keep the field and use `null` rather than silently removing it.**

Examples:

```json
"subtitle": null,
"partner": null,
"primaryCta": null,
"secondaryCta": null
```

This is different from inventing a field that the contract does not contain.

### Correct

```json
"hero": {
  "eyebrow": null,
  "title": "...",
  "subtitle": null
}
```

### Incorrect

```json
"hero": {
  "title": "..."
}
```

when the omitted field is a required contract field.

---

# 5. Section Structure

Every observed backend section follows the same outer shape:

```json
{
  "id": "section-id",
  "type": "section_type",
  "enabled": true,
  "conditions": null,
  "data": {
    "eyebrow": null,
    "heading": null,
    "description": null,
    "columns": [],
    "media": null,
    "cta": null
  },
  "blocks": []
}
```

### Rules

- `id` identifies the section.
- `type` must use an approved section type.
- `enabled` controls whether the section is active.
- `conditions` remains `null` unless an approved contract explicitly defines a populated structure.
- `data` follows the standardized section data shape.
- `blocks` contains the content belonging to the section.
- Do not invent page-specific section types.

### Do NOT create

```json
"type": "custom_solution_cards"
```

or:

```json
"type": "homepage_special"
```

unless a future approved contract explicitly introduces it.

---

# 6. Approved Section Types Observed in Sir's References

The supplied reference files establish these section types:

- `rich_text`
- `card_grid`
- `split_content`
- `numbered_list`
- `comparison_table`
- `checklist`
- `quote`
- `media`
- `case_study_grid`
- `stats`
- `architecture_diagram`

### Important

These types are **content structures**, not mandatory sections for every page.

Different page types use different combinations.

For example:

```text
Solution:
card_grid
card_grid
comparison_table
case_study_grid
```

Case Study:

```text
checklist
card_grid
rich_text
stats
architecture_diagram
```

Blogs can use:

```text
rich_text
card_grid
numbered_list
comparison_table
```

Do not assume that one example's section order is mandatory for every page.

---

# 7. Block Structure

Blocks are identified by their own `type`.

Observed block types include:

| Block type | Standard fields observed |
|---|---|
| `richText` | `id`, `type`, `heading`, `body` |
| `card` | `id`, `type`, `eyebrow`, `title`, `body`, `media`, `cta`, `items` |
| `numberedItem` | `id`, `type`, `number`, `title`, `body`, `items`, `media` |
| `tableRow` | `id`, `type`, `cells` |
| `quote` | `id`, `type`, `quote`, `authorName`, `authorRole`, `authorImage` |
| `metric` | `id`, `type`, `label`, `value`, `detail` |
| `media` | `id`, `type`, `media`, `title`, `description` |

The `type` discriminator determines how the block should be interpreted.

---

# 8. Standard Card Contract

For standard `card` blocks, use the established fields:

```json
{
  "id": "unique-id",
  "type": "card",
  "eyebrow": null,
  "title": "...",
  "body": "...",
  "media": null,
  "cta": null,
  "items": []
}
```

### Do NOT invent custom card fields

Avoid adding:

```json
"metric": "...",
"metricLabel": "...",
"footer": "..."
```

when the same content can be represented by the approved `items` field.

This normalization was applied to the Agivant Proof cards.

---

# 9. `items[]` Convention for the Proof Card Pattern

For the current reusable Proof card implementation, the existing UI needs three distinct pieces of supporting content.

The normalized JSON representation is:

```json
"items": [
  "Primary metric",
  "Metric label",
  "Supporting/footer text"
]
```

For example:

```json
"items": [
  "Days to Minutes",
  "Quoting cycle compression",
  "Amp'd the sales engineering workflow."
]
```

### Important distinction

The standard contract establishes the `items` field.

The positional interpretation:

```text
items[0] → metric
items[1] → metricLabel
items[2] → footer
```

is an **Agivant Proof presentation convention**, not a claim that Sir explicitly documented those positions.

The TS adapter may map the standardized array into presentation properties:

```text
items[0] → metric
items[1] → metricLabel
items[2] → footer
```

The JSON must still remain:

```json
"items": []
```

and must not reintroduce the custom keys.

---

# 10. Heading Rule

### ALWAYS prefer one heading string.

Use:

```json
"heading": "Client success<br>in production, at scale"
```

when the design requires a forced line break.

Do NOT create custom heading structures such as:

```json
"heading": {
  "line1": "...",
  "line2": "..."
}
```

or:

```json
"highlightWord": "...",
"line1Rest": "...",
"line2": "..."
```

or:

```json
"headingLine1": "...",
"headingLine2": "..."
```

unless a future approved backend contract explicitly requires them.

### `<br>` rule

Use `<br>` only when the design/content requires a forced line break.

There may be:

- no `<br>`
- one `<br>`
- two `<br>`
- more than two

depending on the actual Figma/client requirement.

Do NOT enforce a fixed number of `<br>` tags globally.

---

# 11. Highlighted Heading Text

Highlighting is a **presentation concern**.

JSON should contain the text:

```json
"heading": "Client success<br>in production, at scale"
```

It should NOT contain:

```json
"highlightWord": "Client success"
```

and should NOT contain:

```json
"heading": "<span class='highlight'>Client success</span>..."
```

The TSX rendering layer is responsible for:

1. interpreting the `<br>` line breaks;
2. determining the text that belongs to the highlighted treatment according to the established component rule;
3. wrapping the data-derived text in the appropriate `<span>`;
4. leaving CSS to define the accent appearance.

Example rendering responsibility:

```tsx
<span className={styles.highlight}>{dataDerivedHeadingPart}</span>
```

The actual words must come from JSON, not be hardcoded in TSX.

---

# 12. Media Object

The approved media object observed in Sir's references is:

```json
{
  "kind": "image | logo | diagram | video",
  "src": null,
  "assetKey": "string",
  "alt": "string",
  "caption": null
}
```

### Rules

- `kind` describes the media.
- `assetKey` identifies the intended asset.
- `alt` contains accessible alternative text.
- `caption` is nullable.
- Do not invent an asset filename.
- If an actual asset is unavailable, preserve the `assetKey` and use `src: null` when following the backend contract.

### Project implementation note

Some current Agivant local JSON files use real local `src` paths because the frontend already has those assets.

Do not automatically replace every valid existing local path with `null`.

When a file is being prepared specifically as a client/backend-contract JSON, follow the approved media convention used by the relevant reference.

---

# 13. CTA Object

Use the standard CTA structure:

```json
{
  "enabled": true,
  "label": "CTA text",
  "href": "/destination",
  "external": false
}
```

### Rules

- `enabled` states whether the CTA is active.
- `label` is the visible CTA text.
- `href` is the destination.
- `external` identifies external navigation.
- `href` may be `null` when the approved reference intentionally leaves it unresolved.

### Do NOT create

```json
"caseStudySlug": "..."
```

```json
"redirectTo": "..."
```

```json
"route": "..."
```

```json
"detailPage": "..."
```

Use the standard `href`.

---

# 14. Page Slugs and Relationships

A slug is the canonical identity of a content record.

For Case Studies:

```text
Case Study Hub record
        ↓
canonical slug
        ↓
/case-studies/[slug]
        ↓
Case Study detail JSON
```

Example:

```text
ai-for-scalable-tech-support
```

The same canonical slug must be used by the corresponding detail record.

### Do not duplicate complete detail content in a Hub record.

The Hub/listing data should contain the preview/filter/navigation information it needs.

The detail JSON contains the complete Case Study content.

Small shared metadata such as:

- slug
- title
- industry
- capability
- techPlatform

may intentionally exist in both listing and detail representations because that metadata describes the Case Study itself.

---

# 15. Case Study Hub vs Case Study Detail

These are separate responsibilities.

## Hub / Landing JSON

Used for:

- cards
- search
- filters
- preview content
- navigation

Typical fields:

```text
id
slug
title
media
industry
capability
techPlatform
cta
```

## Detail JSON

Used for:

- hero
- objectives
- solution
- technology
- outcome
- architecture
- footer CTA
- other full-page content

Do NOT put the entire detail document inside the Hub record.

Do NOT make the detail page depend on the Hub JSON merely to discover its classification.

The detail record should contain the Case Study metadata needed to identify/classify itself.

---

# 16. Taxonomy / Filter Metadata

For Case Studies, these are Case Study metadata:

```text
industry
capability
techPlatform
```

The Hub uses them for filtering.

The detail page may also use them to show what the Case Study belongs to.

Therefore:

> The filter UI belongs to the Hub, but the classification metadata belongs to the Case Study.

Do not confuse UI responsibility with data ownership.

---

# 17. `columns`

The reference files contain:

```json
"columns": []
```

across the supplied examples.

Do not invent the shape of a populated `columns` array.

If a future requirement needs populated columns, it must be established from an approved reference/contract before creating a new structure.

---

# 18. Section Closing / Supporting Text

Do NOT create custom keys such as:

```json
"supportingText": "..."
```

```json
"bottomText": "..."
```

```json
"footerText": "..."
```

inside `section.data` unless an approved contract explicitly introduces them.

The reference analysis established that section `data` has a consistent shape and does not contain a dedicated closing-text field.

When closing/supporting text is required, use an already-approved structure, such as a trailing `richText` block or a separate `rich_text` section, only when the actual section contract supports that representation.

Never make a unilateral schema change just to fit one design.

---

# 19. `conditions`

The supplied references use:

```json
"conditions": null
```

Do not invent a new conditions structure.

If the backend team later provides a defined conditions contract, follow that contract exactly.

---

# 20. Do Not Add Presentation Variants to JSON

Do not put values such as:

```json
"fontSize": "...",
"color": "...",
"blur": "...",
"animation": "...",
"gridColumn": "...",
"gridRow": "...",
"gsap": {},
"className": "..."
```

into content JSON.

If a reusable component requires a generic presentation variant, that decision belongs in the frontend/component layer unless the approved content contract explicitly defines such a field.

---

# 21. Reusable Component Rule

A JSON migration must not create page-specific component duplication.

Correct:

```text
JSON A ──┐
         ├──> same reusable component
JSON B ──┘
```

Incorrect:

```text
JSON A → HomepageProof
JSON B → SolutionProof
```

when both are the same visual/content pattern.

Page-specific data belongs in the data source.

Reusable presentation belongs in the component.

---

# 22. Existing `.ts` → JSON Normalization Procedure

When cleaning an old `.ts` data file:

### Step 1 — Do not copy the TypeScript structure blindly

First identify:

- actual content
- page identity
- sections
- blocks
- metadata
- navigation
- media
- presentation-only fields

### Step 2 — Compare against the approved contract

Classify every existing field as:

```text
KEEP
RENAME
RESTRUCTURE
MOVE
REMOVE
ADD
NULLABLE
FRONTEND-ONLY
UNKNOWN
```

### Step 3 — Normalize headings

Convert old structures such as:

```ts
heading: {
  line1: "...",
  highlight: "...",
  line2: "..."
}
```

into a single heading string where the approved convention requires it:

```json
"heading": "First line<br>Second line"
```

Do not preserve old key names simply because the old TS used them.

### Step 4 — Normalize blocks

Use the approved block `type` and fields.

### Step 5 — Normalize CTAs

Use:

```text
enabled
label
href
external
```

### Step 6 — Normalize media

Use the standard media object.

Do not invent filenames.

### Step 7 — Remove custom schema fields

If an old field does not belong to the approved JSON contract:

- determine whether an existing standard field can represent it;
- move it through an adapter if necessary;
- otherwise classify it as frontend-only;
- never silently invent a new contract field.

### Step 8 — Validate

Parse the JSON and inspect every section/block.

### Step 9 — Only after the JSON is clean

Update the TS data-access/adapter layer and connect the existing frontend.

---

# 23. TS After JSON Migration

A `.ts` data file may remain after migration.

Its job is:

- TypeScript types
- JSON import/data access
- getters
- adapters
- mappings from backend/content structure to component presentation models

It must NOT contain duplicate hardcoded content that already exists in JSON.

Example:

```text
content JSON
    ↓
getData()
    ↓
adapter
    ↓
component-facing model
    ↓
TSX
```

The adapter may rename or derive presentation properties when required.

Example:

```text
items[0] → metric
items[1] → metricLabel
items[2] → footer
```

Those presentation property names do not need to appear in the JSON.

---

# 24. Do Not Put Content Back Into TSX

TSX should not contain:

```tsx
<h2>Client success</h2>
```

if `"Client success"` is content.

Instead:

```tsx
<h2>
  {data.heading}
</h2>
```

If special presentation is required, derive it from the data.

Do not hardcode:

- headings
- descriptions
- card titles
- CTA labels
- Case Study slugs
- metrics
- supporting copy

inside reusable components.

---

# 25. Figma → JSON Rule

When Figma requires a specific line break:

```text
Figma:
Client success
in production, at scale
```

Represent the content as:

```json
"heading": "Client success<br>in production, at scale"
```

Do not create:

```json
"headingLine1": "Client success",
"headingLine2": "in production, at scale"
```

unless the approved backend contract explicitly requires that structure.

Figma determines **what content and line breaks are required**.

TSX/CSS determine **how that content is rendered/styled**.

---

# 26. Image Rule

Never invent an image path.

Before putting a path into JSON:

1. Check whether the actual asset exists.
2. Confirm the filename.
3. Confirm the extension.
4. Use the real path if the project's approved local-media convention calls for it.
5. Otherwise preserve `assetKey` and use `src: null` according to the backend contract.

Do not change `.jpg` to `.png` merely because it looks likely.

Verify the actual file.

---

# 27. Content Preservation Rule

During normalization:

> **Normalize structure, do not rewrite approved content.**

Do not improve wording, shorten copy, invent statistics, or "clean up" client copy unless explicitly requested.

For example, moving:

```ts
metric: "Days to Minutes"
```

into:

```json
"items": [
  "Days to Minutes"
]
```

is normalization.

Changing the wording to:

```text
"Days → Minutes"
```

would be a content change and requires explicit approval.

---

# 28. `items: []` Rule

Do not remove `items` merely because a frontend component does not currently need it.

First determine whether the standard card contract requires/uses it.

The supplied reference contract establishes `items` as part of the standard card shape.

If a standard card has no items, use:

```json
"items": []
```

unless the approved contract for that exact structure explicitly permits omission.

Do not make the decision based only on frontend convenience.

---

# 29. Proof Section Example

The current reusable Proof data follows:

```text
case_study_grid
    ↓
card blocks
    ↓
standard card fields
    ↓
items[]
```

Current visual data includes:

```text
Heading:
Client success
in production, at scale

Cards:
Agentic Quote Accelerator
Global Markets Agent Network
AI-Native SRE Transformation
```

The current visual arrangement is:

```text
┌─────────────────────────┬─────────────────────────┐
│ Agentic Quote           │                         │
│ Accelerator             │                         │
├─────────────────────────┤  AI-Native SRE          │
│ Global Markets Agent    │  Transformation         │
│ Network                 │                         │
└─────────────────────────┴─────────────────────────┘
```

The reusable component handles the layout.

The JSON provides the content.

---

# 30. Case Study Data Relationship Example

For the existing Case Study:

```text
Canonical slug:
ai-for-scalable-tech-support
```

The Hub record and detail record should use that same identity.

```text
caseStudies.json
    ↓
slug: ai-for-scalable-tech-support
    ↓
/case-studies/ai-for-scalable-tech-support
    ↓
case-study.json
```

The detail registry may resolve the slug to the detail JSON.

Do not create a second unrelated slug for the same Case Study.

---

# 31. Footer CTA

When a page has a page-specific footer CTA, use the standardized structure:

```json
"footerCta": {
  "enabled": true,
  "heading": "...",
  "subheading": null,
  "partner": null,
  "primaryCta": null,
  "secondaryCta": {
    "enabled": true,
    "label": "...",
    "href": "/contact",
    "external": false
  }
}
```

Do not invent:

```text
buttonLabel
buttonHref
footerButton
```

inside the standardized page contract.

If only one CTA is active, use the appropriate existing CTA slot according to the approved implementation/reference rather than inventing a third CTA field.

---

# 32. JSON Validation Checklist

Before declaring a JSON file clean, verify:

### Structure

- [ ] Valid JSON syntax
- [ ] Correct `schemaVersion`
- [ ] Correct `pageType`
- [ ] Correct canonical `slug`
- [ ] Correct top-level envelope where applicable
- [ ] Correct section types
- [ ] Correct block types

### Naming

- [ ] No `headingLine1`
- [ ] No `headingLine2`
- [ ] No invented heading objects
- [ ] No `supportingText`
- [ ] No `caseStudySlug`
- [ ] No `redirectTo`
- [ ] No page-specific route keys
- [ ] No presentation keys

### Content

- [ ] Existing approved copy preserved
- [ ] Figma-required `<br>` breaks represented in heading strings
- [ ] Highlighted text remains data-derived
- [ ] No content hardcoded into TSX

### Media

- [ ] Real assets verified
- [ ] No invented image paths
- [ ] Correct extension
- [ ] `assetKey` preserved where applicable
- [ ] `src: null` used when required by the contract

### CTA

- [ ] `enabled`
- [ ] `label`
- [ ] `href`
- [ ] `external`

### Cards

- [ ] Standard card fields
- [ ] `items` used where required
- [ ] No unnecessary custom card keys
- [ ] No duplicated inner-page content in Hub data

### Integration

- [ ] JSON is the content source
- [ ] TS contains only types/data access/adapters
- [ ] TSX contains rendering only
- [ ] CSS contains presentation
- [ ] Existing reusable components are reused

### Build

- [ ] `npx tsc --noEmit`
- [ ] `npm run build`
- [ ] Visual verification against Figma

---

# 33. What To Do When a Field Does Not Fit

Never immediately invent a new field.

Use this decision tree:

```text
Does the field exist in Sir's approved contract?
        │
       YES
        ↓
Use it exactly as defined.
        │
       NO
        ↓
Can existing standard structure represent it?
        │
   ┌────┴────┐
  YES       NO
   ↓         ↓
Use/adapt    Is it purely
existing     frontend presentation?
field              │
               ┌───┴───┐
              YES      NO
               ↓        ↓
         Keep in TS/   STOP + REPORT
         component     unknown schema
```

Do not make unilateral schema changes.

---

# 34. Unknown vs Frontend-Only

These must not be confused.

### FRONTEND-ONLY

A value is known to be required by the UI but has no backend contract representation.

Example:

- animation configuration
- CSS layout values
- component-specific visual state

Keep it in the frontend layer.

### UNKNOWN

The source material does not establish how a value should be represented.

Do not guess.

Report the gap and wait for a confirmed convention/reference.

---

# 35. Current Agivant Project Decisions

The project is currently using physical JSON files for the normalized content datasets we have already established, including:

```text
src/data/case-study.json
src/data/case-study-dummy.json
src/data/solutionPage.json
src/data/proof.json
```

This is a **current project implementation decision**.

It should not be confused with Sir's reference files themselves.

Sir's files establish the **JSON contract/schema**.

Agivant's implementation decides how those contract-shaped datasets are consumed locally today and eventually replaced by WordPress/API data.

---

# 36. Future WordPress Compatibility

The desired architecture is:

```text
Today:

JSON
 ↓
TS data access
 ↓
components


Future:

WordPress API
 ↓
TS data access
 ↓
same components
```

The component should not care whether its data originated from:

- local JSON
- WordPress REST
- WordPress GraphQL
- another approved API

The data-access layer is the seam.

Therefore, keeping the JSON contract clean now reduces future migration work.

---

# 37. Final Rule

Before creating or modifying ANY future Agivant JSON:

> **STOP → CHECK THE CONTRACT → CLEAN THE DATA → NORMALIZE THE STRUCTURE → VALIDATE → CONNECT TO FRONTEND.**

Never:

> **COPY OLD TS → RENAME FILE TO JSON → CALL IT DONE.**

Every future migration — Case Studies Hub, Blogs, Talk Tech, Solutions, Partners, and additional pages — should follow this document.

---

## Reference Basis

This rulebook is based on:

- Sir's supplied backend reference JSON contract (`solutions_single.json`, `case_study_single.json`, `partnership_single.json`, and `blog_single_1..5.json`)
- Agivant's normalized `case-study.json`
- Agivant's normalized `solutionPage.json`
- Agivant's reusable `proof.json`
- The previously completed schema audit of the supplied reference files

Where this document distinguishes a **Sir/reference rule** from an **Agivant project convention**, the distinction is intentional.

If a future backend reference contradicts a project convention, the new approved backend contract takes precedence and this document must be updated before further migrations.
