# 11. Resolve translation choices with the same machinery

- Status: Proposed
- Date: 2026-09-27

## Context

English-to-Japanese translation has to make choices from context: whether *sister* is an older or younger sister, how to render *you*. The per-character accumulation built here fits these choices. In a test, Jev answered 0.51 / 0.49 for a sentence with no clue: uncertainty showed instead of a confident guess.

## Decision

Add translation choices as another kind of per-character judgment after the first version.

## Consequences

Out of scope for the first version.
