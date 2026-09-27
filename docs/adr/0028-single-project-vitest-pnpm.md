# 28. One project, tested with Vitest, managed with pnpm

- Status: Accepted
- Date: 2026-09-28

## Context

The page, the pipeline and the core calculations (evidence weighting, presence gating, decay,
part packing) are small and share types. The calculations are where mistakes would be least visible
on screen.

## Decision

Keep one Next.js project: the page under `src/app`, pure calculation code under `src/core` with no
dependency on React or Node, and the pipeline under `scripts`. Test `src/core` with Vitest. Use pnpm
and the current Node.js LTS release.

## Consequences

No workspace setup to maintain. `src/core` can move into its own package later if something else
needs it.
