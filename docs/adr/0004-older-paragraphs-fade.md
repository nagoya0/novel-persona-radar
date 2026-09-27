# 4. Older paragraphs fade

- Status: Accepted
- Date: 2026-09-27

## Context

A plain average hides character change. The king in *Run, Melos!* stops being suspicious at the very end; averaged over the whole story, his chart would barely move.

## Decision

Weight evidence toward recent paragraphs with an adjustable decay.

## Consequences

A slow decay shows who a character *is*; a fast one shows who they are *right now*. The decay is a display setting and can be changed without new model calls.
