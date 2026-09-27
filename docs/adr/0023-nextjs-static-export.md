# 23. Next.js with static export

- Status: Accepted
- Date: 2026-09-28

## Context

The demo is a static page: every judgment is computed in advance
([ADR 0008](0008-replay-in-the-demo.md)) and nothing runs on a server. It will mostly be reached
through shared links, so each work benefits from its own URL and its own link preview.

Considered: Vite with React, which is simpler and would be enough for the page itself, but
per-work pages and link previews would have to be built by hand.

## Decision

Use Next.js (App Router, TypeScript) with `output: 'export'`. Generate one page per work at build
time from the work's data files, with per-work metadata for link previews. Use no server features.

## Consequences

The site deploys as plain files. Route handlers remain available should a live mode ever be
wanted, but using them would need its own decision about cost and rate limits.
