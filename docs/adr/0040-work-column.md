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
- **Characters.** A two-column grid of avatars with names, listing only the characters Jev judges,
  as the analysis column does; minor figures such as the crowd are left out. The avatar is one generic
  head-and-shoulders silhouette for everyone, on a background colour derived from the character id:
  it looks arbitrary but never changes between visits. No per-character artwork.
- **Not yet on stage.** Mentioned characters are shown greyed with "？" over the silhouette until
  they appear ([ADR 0032](0032-on-stage-profiles-and-two-first-appearances.md)).
- **Heading.** 主な登場人物, since minor figures are left out.
- **Introductions.** Pointing at an avatar (or focusing it with the keyboard) shows the character's
  introduction in a section below the grid, without repeating the name; the section is hidden otherwise. Until the
  character appears, it says they have not appeared yet. This replaced a tooltip on the avatar.

## Consequences

The column has room to spare, with the source credits at the bottom. Long names such as
フィロストラトス wrap onto two lines in the grid.
