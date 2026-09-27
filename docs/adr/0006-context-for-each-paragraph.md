# 6. Give each paragraph some context

- Status: Superseded by [0030](0030-annotated-cast-instead-of-previous-paragraphs.md)
- Date: 2026-09-27

## Context

A paragraph on its own often does not say who "he" is, who is speaking, or whether a line is sarcastic.

## Decision

Pass the previous two or three paragraphs along with the current one. Resolve the speaker of each line first, and attribute trait evidence to that character.

Passing the accumulated profile as context was considered and rejected as the default: a first impression would colour every later judgment and reinforce itself. It may be offered later as a deliberate "reader with preconceptions" mode, to compare with the fresh-eyes default.

## Consequences

More input tokens per request. Speaker resolution becomes a separate step that trait judgments depend on.
