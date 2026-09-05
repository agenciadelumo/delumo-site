# Delumo UX review

Scope: homepage, six solution pages, projects, about, contact and privacy. Existing standalone proposals, tours and applications are retained unchanged.

## Changes

- Short, concrete service descriptions and compact mobile service rows.
- Training methods and avatar examples grouped under expandable sections. Closing the examples stops video playback.
- Shorter homepage project summaries; complete case galleries remain on the projects page.
- Persistent navigation, current-page indication, accessible menu names and anchor offsets.
- Consistent solution detail pages with breadcrumbs, applications, deliverables, related services and contextual contact links.
- Contact form preselects the requested solution and provides a draft-link fallback. No message is sent automatically.
- Readable green text on light backgrounds, clearer focus and input borders, stable image ratios and smaller display headings.
- Tablet grid placement, small-screen footer and carousel/WhatsApp control spacing corrected.

## Verification

- Browser checks on all 11 marketing routes at 320, 360 and 1440 pixels; representative visual checks at 390 and 768 pixels.
- No horizontal overflow or missing same-page anchors in those route checks.
- Four learning tabs remain keyboard navigable, with valid panel references.
- Avatar video iframe mounts on request and unmounts when its disclosure closes.
- Demo rejects an incorrect password; the existing presentation-only gate is unchanged.
- RH solution passes its category to the contact form.
- At 390 x 844, the default homepage decreased from 22,612 to approximately 11,930 CSS pixels, with optional sections closed. This is a layout measurement, not a conversion or usability-study claim.
- `pnpm run build` then `pnpm test` verifies the export and preservation of standalone routes.

The existing client-side demo password is not server-side access control. No new security claim is made.
