# 40. The work column: a scene picker and an avatar grid

- Status: Accepted
- Date: 2026-09-28

## Context

In the first prototype the scene list and the character list, each with an introduction per
character, took most of the work column's height.

## Decision

- **Scenes.** A dropdown labelled 場面. Scenes are numbered §1, §2 … in the dropdown (and wherever
  else they are shown), with § set in a Latin face: the Japanese face draws it full-width, which
  leaves a gap before the number.
- **Characters.** A two-column grid of avatars with names. The avatar is one generic
  head-and-shoulders silhouette for everyone, on a background colour derived from the character id:
  it looks arbitrary but never changes between visits. No per-character artwork.
- **Not yet on stage.** Mentioned characters are shown greyed with "？" over the silhouette until
  they appear ([ADR 0032](0032-on-stage-profiles-and-two-first-appearances.md)).
- **Introductions.** Shown as a tooltip on the avatar, "？" until the character appears.

## Consequences

The column has room to spare, with the source credits at the bottom. Long names such as
フィロストラトス wrap onto two lines in the grid.
