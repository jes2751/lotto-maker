# Service Identity Review

Date: 2026-04-22

## Purpose

This note defines what the service is, what stays visible, and what should be simplified.

The site has two jobs:

1. A real lotto utility product.
2. SEO and AdSense content inventory.

The second job is valid and should stay. The mistake would be letting it overpower the product.

## Current Identity

The site should feel like:

- a practical lotto tool first,
- a stats and history resource second,
- a guide library third,
- a trustable service overall.

One-line summary:

> A lotto utility site that helps people generate numbers, review draws, inspect stats, and read supporting guides.

## Route Classification

Rule of thumb:

- Keep the core product routes prominent.
- Keep `guides/*` as SEO/AdSense inventory.
- Merge obvious duplicates.
- Remove pages that do not add a clear user or business job.

| Route | Class | Why |
|---|---|---|
| `/` | keep | The front door. It should explain the product in one screen. |
| `/generate` | keep | Primary action page. This is the tool people actually use. |
| `/stats` | keep | Main interpretation hub for draw data. |
| `/draws` | keep | The archive of record. Important utility page. |
| `/check` | keep | Clear user job, check winning status. |
| `/generated-stats` | keep | Distinct crowd/public-data view. Worth keeping. |
| `/guides` | keep | SEO/AdSense hub. Keep it. |
| `/guides/*` | keep | Inventory pages for search and ad monetization. |
| `/faq` | keep | Trust and support reduction. |
| `/privacy` | keep | Required legal page. |
| `/terms` | keep | Required legal page. |
| `/policies/ads` | keep | Required for AdSense operations. |
| `/contact` | keep | Operations and support. |
| `/about` | keep | Brand, operating principles, editorial standards, and trust info live here. |
| `/lotto-number-generator` | merge candidate | Same job as `/generate`. |
| `/latest-lotto-results` | merge candidate | Overlaps with home, `/draws`, and analysis pages. |
| `/draw-analysis` | merge candidate | Overlaps with `/stats` as an analysis hub. |
| `/hot-numbers` | shrink candidate | Can live as a section inside `/stats`. |
| `/cold-numbers` | shrink candidate | Can live as a section inside `/stats`. |
| `/odd-even-pattern` | shrink candidate | Better as a subtopic of `/stats`. |
| `/sum-pattern` | shrink candidate | Better as a subtopic of `/stats`. |
| `/recent-10-draw-analysis` | shrink candidate | Better as a subtopic of `/stats` or `/draw-analysis`. |
| `/lotto-buy-guide` | merge candidate | Likely duplicates guide content. |

## Site Structure

The site should be organized into three layers.

### Product Layer

This is the actual user-facing product.

- `/`
- `/generate`
- `/stats`
- `/draws`
- `/check`
- `/generated-stats`

These pages should dominate the header, homepage, and primary navigation.

### Inventory Layer

This is the SEO and AdSense content layer.

- `/guides`
- `/guides/*`

Rules:

1. Keep the pages.
2. Do not let them crowd the product experience.
3. Surface only a few representative guides on the homepage.
4. Keep the full list in sitemap and guide hub.

### Trust / Ops Layer

These pages reduce friction and make the service feel legitimate.

- `/about`
- `/faq`
- `/privacy`
- `/terms`
- `/policies/ads`
- `/contact`

`about` should explain:

1. What the service does.
2. How editorial or statistical content is chosen.
3. What the operating principles are.
4. Why users should trust the site.

Placement rule:

- Keep `about` out of the primary header.
- Place it in the footer trust group with the other policy and support links.
- Treat it as a confidence page, not a primary conversion page.

## Consolidation Plan

Use consolidation, not raw deletion, for most extra pages.

### Merge into `/generate`

- `/lotto-number-generator`

Why:

- It is a duplicate landing page.
- It does not create a new user job.
- It only adds another entry point to the same tool.

### Merge into `/draws` or the homepage

- `/latest-lotto-results`

Why:

- The home page already shows the latest draw.
- `/draws` already owns the archive behavior.
- The page is useful, but not unique enough to deserve strong standalone prominence.

### Merge into `/stats`

- `/draw-analysis`
- `/hot-numbers`
- `/cold-numbers`
- `/odd-even-pattern`
- `/sum-pattern`
- `/recent-10-draw-analysis`

Why:

- `stats` is the natural analysis hub.
- These are all subviews of the same user intent.
- Keeping them as separate top-level pages makes the site feel fragmented.

### Merge into `guides/*`

- `/lotto-buy-guide`

Why:

- If the goal is explanation or SEO, it belongs in the guide stack.

### Keep as a trust page

- `/about`

Why:

- It carries the brand story and operating principles.
- It reduces skepticism without turning into a marketing page.
- It helps separate the product from the guide inventory.

## Redirect Map

Use permanent redirects for duplicate routes so search engines and users land on the canonical pages.

| Old route | New route | Reason |
|---|---|---|
| `/lotto-number-generator` | `/generate` | Same product job. |
| `/latest-lotto-results` | `/draws` | The archive is the canonical browse surface. |
| `/draw-analysis` | `/stats` | The analysis hub belongs under stats. |
| `/draw-analysis/:round` | `/draws/:round` | Round detail belongs to the draw archive. |
| `/hot-numbers` | `/stats` | Frequency view belongs inside stats. |
| `/cold-numbers` | `/stats` | Frequency view belongs inside stats. |
| `/odd-even-pattern` | `/stats` | Pattern view belongs inside stats. |
| `/sum-pattern` | `/stats` | Pattern view belongs inside stats. |
| `/recent-10-draw-analysis` | `/stats` | Recent trend view belongs inside stats. |
| `/lotto-buy-guide` | `/guides/how-to-buy-lotto-online` | The guide stack already has a better canonical article. |

## What Should Stay Visible

On the homepage and in the header, the order should be:

1. `Generate`
2. `Stats`
3. `Draws`
4. `Check`
5. `Guides`

That ordering makes the product clear:

- first, do something,
- then interpret,
- then browse history,
- then verify,
- then read supporting content.

## What Not To Do

1. Do not give guide pages the same visual weight as the core tools.
2. Do not keep multiple nearly identical landing pages for the same intent.
3. Do not let `latest`, `analysis`, and `generator` become separate top-level concepts if they are really the same flow.
4. Do not keep `about` vague. It should have real trust content or not exist.
5. Do not move `guides` out of the site. They are part of the monetization and acquisition layer.

## Next Steps

This is the execution order I would follow:

1. Keep the core product pages and confirm they remain the primary navigation.
2. Keep all `guides/*` pages, but reduce how loudly they appear in the UI.
3. Keep `/about` and finalize it as a friendly trust page.
4. Redirect duplicate landing pages to their canonical routes.
5. Collapse analysis satellites into `/stats`.
6. Update `sitemap` and internal links after route decisions are final.

## Definition of Done

The review is complete when:

- the site identity is easy to explain in one sentence,
- the product layer is visibly dominant,
- the guide layer stays intact for SEO and AdSense,
- `about` feels useful and trust-focused,
- duplicate pages are either merged or intentionally kept.

## Canonical State

The canonical pages should be:

- `/` for the home experience
- `/generate` for the generator
- `/stats` for analysis
- `/draws` for browsing history
- `/check` for validation
- `/generated-stats` for crowd/public-data stats
- `/guides` and `/guides/*` for SEO and AdSense content
- `/about` for trust and brand context

## Legacy Archive

Legacy routes that have been consolidated are documented in:

- [legacy-pages-archive.md](C:/Users/jes27/OneDrive/code/lotto_v2/doc/project/legacy-pages-archive.md)

That archive is the source of truth for deprecated public routes and their canonical replacements.
