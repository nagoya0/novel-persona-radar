# 8. Replay recorded judgments in the public demo

- Status: Accepted
- Date: 2026-09-27

## Context

Jev is new and its capacity is limited. During testing, requests through one provider failed with `429` for tens of minutes at a time. A public demo that calls the model on every view would also cost money per viewer.

## Decision

Compute judgments in advance and store them with the text. The public demo only replays them. The judging step sits behind an interface, so that another model or a rule-based fallback can stand in when Jev is unavailable.

## Consequences

Viewers never trigger a model call, and running the demo costs nothing. Trying new texts requires running the judging step locally.
