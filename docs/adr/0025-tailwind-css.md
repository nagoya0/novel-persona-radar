# 25. Style with Tailwind CSS

- Status: Accepted
- Date: 2026-09-28

## Context

The page is a fixed three-column dashboard with a vertical-text column; nothing about it calls for a
particular styling approach.

## Decision

Use Tailwind CSS, the common choice alongside Next.js. Vertical writing uses the standard CSS
properties (`writing-mode`, `text-combine-upright`).

## Consequences

Styles live with the components that use them.
