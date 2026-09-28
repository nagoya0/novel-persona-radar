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

*Amended 2026-09-29:* there is no table-of-contents page. The site opens on the first work, and
works are switched in the work column ([ADR 0013](0013-three-column-layout.md)). A static export
cannot redirect, so the root page renders the first work itself; each work keeps its own URL under
`/works/<id>`.

*Amended 2026-09-29:* link previews carry each work's title and summary, and one shared image: a
screenshot of the first page of *Run, Melos!* at 1200 × 630 (`public/og-image.png`), taken from
the deployed site. A per-work image can come with the second work.
