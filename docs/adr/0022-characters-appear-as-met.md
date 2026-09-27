# 22. Characters appear as the reader meets them

- Status: Accepted
- Date: 2026-09-28

## Context

Listing every character up front gives parts of the story away, and offers characters in the
analysis column before the reader knows who they are. The annotation file records where each
character first appears ([ADR 0019](0019-work-annotation-files.md)).

## Decision

Only characters whose first appearance is at or before the current position are shown, in the
work column's character list and in the analysis column's character picker alike. The list is
recomputed from the position, so jumping to a highlight or moving back gives the right list.
A newly met character is added with a short animation and their introduction, following
[ADR 0021](0021-keyboard-and-reduced-motion.md) for reduced motion.

## Consequences

Part of the first version. No extra data is needed beyond the annotation file.
