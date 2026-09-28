# 18. Judge the whole text; shorten the visit with highlights and autoplay

- Status: Accepted
- Date: 2026-09-28

## Context

Few visitors to a demo will read a whole story. Showing only excerpts would break the point of
the project: the accumulated profile at a scene depends on everything before it. The king's change
of heart at the end of *Run, Melos!* only shows as a change against the suspicion built up earlier.

## Decision

Judge every paragraph of every work, and offer two ways to see the result without reading it all:

- **Highlights.** A few marked scenes per work to jump to. The chart at a highlight includes
  everything accumulated up to that point.
- **Autoplay.** A play button that advances through the parts automatically
  ([ADR 0041](0041-autoplay-button.md)).

Highlights are chosen by hand in the work's annotation file
([ADR 0019](0019-work-annotation-files.md)). Detecting them from the data — the parts where the
charts move most — is a possible later addition.

## Consequences

Autoplay can also produce the demo video ([ADR 0012](0012-desktop-browser-first.md)).
