# 26. A Node.js pipeline with a small Jev client of our own

- Status: Accepted
- Date: 2026-09-28

## Context

Before the page can be built, each work has to be imported from Aozora Bunko (Shift_JIS XHTML with
ruby), judged paragraph by paragraph, and compiled into the files the page loads. Jev is reachable
through two routes with different request shapes, and its capacity is limited
([ADR 0008](0008-replay-in-the-demo.md)).

## Decision

Write the pipeline as TypeScript scripts run by Node.js: import, judge, compile. Call Jev with a
small client of our own built on `fetch`, behind a judge interface, rather than an SDK. The client
handles both routes, retries `429` and `529` with exponential backoff, and records every request's
answers. Parse Aozora Bunko's XHTML with an HTML parser after decoding Shift_JIS, keeping ruby.

## Consequences

Retries, recording and the choice of route stay under our control. A rule-based or other-model
judge can implement the same interface.
