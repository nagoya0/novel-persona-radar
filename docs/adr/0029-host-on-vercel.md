# 29. Host on Vercel

- Status: Accepted
- Date: 2026-09-28

## Context

The site is static files built by Next.js. Vercel and Cloudflare Pages would both serve it for free.

## Decision

Host on Vercel's Hobby plan, which builds and serves Next.js without configuration.

## Consequences

Hobby plan limits pause the site rather than bill, and the plan is for non-commercial use, which
fits a personal demo.
