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

*Amended 2026-09-29:* crawlers that collect pages for training AI models are turned away in
`robots.txt`. Such crawlers have been reported fetching a public page millions of times a day; on
the Hobby plan that would not bill but would use up the monthly transfer and pause the demo.
Search engines and fetches a person asks an assistant to make are still allowed.
