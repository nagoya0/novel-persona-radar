# 27. Keep data in files, judgments as append-only JSON Lines

- Status: Accepted
- Date: 2026-09-28

## Context

The data is small — a short story's full judgments are a few hundred kilobytes — and never changes
at run time. Judging a work takes many requests, any of which may fail on capacity.

## Decision

No database. Per work, keep the text, the annotation file and the judgments as files in the
repository. Judgments are written as JSON Lines, one line per paragraph, appended as they arrive,
so an interrupted run resumes where it stopped. A build step compiles them into compact JSON for the
page. Accumulation and decay are computed in the browser, so the decay can be adjusted live
([ADR 0004](0004-older-paragraphs-fade.md)).

## Consequences

Everything is reviewable in version control. If data ever grew large enough to matter, the
compile step is the place to change the format.
