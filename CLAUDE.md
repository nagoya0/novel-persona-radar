# CLAUDE.md

Guidance for AI coding agents working in this repository.

## What this is

A reader for public-domain Japanese novels (Aozora Bunko) that draws each character's
personality as a radar chart, updated paragraph by paragraph. See [README.md](README.md).

## Next.js

This project uses a recent Next.js whose APIs may differ from what you know. Follow the rules in
@AGENTS.md and read the bundled docs in `node_modules/next/dist/docs/` before writing Next.js code.

- `pnpm dev` / `pnpm build` first run `scripts/build-data.ts`, which compiles `data/` into
  `src/generated/` (git-ignored). Run `pnpm data` on its own after changing data.
- `src/core/` is pure TypeScript with no React or Node dependencies; `pnpm test` runs its tests.
- `pnpm judge <work-id>` sends the missing judgments to Jev and appends them to
  `data/works/<id>/judgments.jsonl` (see [docs/judging.md](docs/judging.md)). It costs money:
  run it only when asked, and try `--dry-run` first.

## Language

Everything in the repository is in English: documentation, code, comments, commit messages.
The novels themselves stay in Japanese and are never translated before being judged.

## Decisions and ideas

- Design decisions are Architecture Decision Records in [docs/adr/](docs/adr/). Read the index
  ([docs/adr/README.md](docs/adr/README.md)) before changing the design, and do not work against
  an Accepted decision without proposing a new ADR that supersedes it.
- Record a new decision as the next numbered ADR and add it to the index. Replaced decisions are
  marked *Superseded* and linked to their replacement, not deleted.
- Write ADRs in plain, literal language: state the facts and the reasons directly. Avoid metaphors
  and compressed or poetic phrasing. A reader who was not part of the discussion, including the
  author months later, must be able to follow why the decision was made.
- Undecided ideas and open questions live in [docs/ideas.md](docs/ideas.md). When one is settled,
  write the ADR and remove it from the ideas file.
- Write down only what cannot be read from the code or the git history.

## Choosing technology

Fit with the product comes first. Never pick a tool the product does not need. Among options
that fit equally well, prefer the mainstream TypeScript web ecosystem (React, Next.js, Node.js).
Record each significant choice as an ADR with the alternatives considered.

## Jev

The judging model is [Jev](https://docs.typesafe.ai) by TypeSafe AI.

- Official API: `POST https://api.typesafe.ai/v1/systemone`, model `jev-latest`, question types
  `noul` / `choice` / `score`. Key: `TYPESAFE_API_KEY`.
- Fallback route: Vercel AI Gateway, `POST https://ai-gateway.vercel.sh/v1/evaluate`, model
  `typesafe-ai/jev` (it calls the yes/no type `boolean`). Key: `AI_GATEWAY_API_KEY`.
- Jev is stateless, and questions in one request cannot see each other's answers. Anything that
  spans paragraphs belongs in code ([ADR 0002](docs/adr/0002-model-judges-code-accumulates.md)).
- Capacity is limited and `429` responses can last for tens of minutes. Retry with backoff,
  store every judgment, and never re-request a judgment that is already stored.
- Treat its probabilities as scores, not calibrated probabilities.

## Secrets

- API keys are passed as environment variables (`TYPESAFE_API_KEY`, `AI_GATEWAY_API_KEY`) at run
  time and never stored in the repository. Ask the maintainer how to provide them.
- Never print, log or commit a key value. To check that a key is present, show its name and length only.
- Never ask the maintainer to paste a key into the chat.

## Repository hygiene

- This repository is public. Keep personal circumstances, employers, details of the maintainer's
  own machine and other private context out of documents, code, comments and commit messages.
- Commit author is the maintainer's GitHub noreply address; do not change it.
- Texts from Aozora Bunko keep their source credits ([ADR 0009](docs/adr/0009-aozora-bunko-credits.md)).
