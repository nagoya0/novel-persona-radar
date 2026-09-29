# 7. Draw the chart's axes at random

- Status: Superseded by [0016](0016-precomputed-trait-dictionary.md)
- Date: 2026-09-27

## Context

With a fixed set of axes, every character is described by the same few traits and differs from the others only in the values on them.

## Decision

Draw the axes from a dictionary of traits for each reading.

## Consequences

Some traits will never be addressed by the story and stay grey. A grey axis is not an error: it tells the viewer that the story gives no evidence about that trait for that character.
