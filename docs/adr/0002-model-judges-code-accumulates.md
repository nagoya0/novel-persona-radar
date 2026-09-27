# 2. The model judges; the code accumulates

- Status: Accepted
- Date: 2026-09-27

## Context

Jev is stateless: every request stands alone, and questions within one request cannot see each other's answers. A character's profile, however, builds up over the whole story.

## Decision

Jev is only asked about the paragraph in front of it. Everything that spans the story (accumulating evidence, weighting, fading, deciding what to draw) is ordinary code.

## Consequences

The accumulation can be tuned and replayed from stored judgments without calling the model again. The model never sees the running profile unless we choose to pass it (see [0006](0006-context-for-each-paragraph.md)).
