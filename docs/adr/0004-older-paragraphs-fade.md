# 4. Older paragraphs fade

- Status: Accepted
- Date: 2026-09-27

## Context

A plain average hides character change. The king in *Run, Melos!* stops being suspicious at the very end; averaged over the whole story, his chart would barely move.

## Decision

Weight evidence toward recent paragraphs with an adjustable decay.

## Consequences

With a slow decay, older paragraphs keep much of their weight, so the profile describes the character over the story so far. With a fast decay, recent paragraphs dominate, so the profile describes the character in the current scene. The decay is a display setting and can be changed without new model calls.
