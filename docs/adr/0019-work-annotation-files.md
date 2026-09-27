# 19. Annotate each work once, with AI assistance and human review

- Status: Accepted
- Date: 2026-09-28

## Context

Several things need a reading of the whole work, which Jev cannot do — it sees one request at a
time and does not write text:

- Who the characters are, and every name they go by. The king in *Run, Melos!* is 王, ディオニス,
  暴君 and 王様; Selinuntius is also 竹馬の友.
- Where each character first appears, so the character list can grow as the reader meets them.
- A short, spoiler-free introduction for each character and for the work.
- The highlight scenes ([ADR 0018](0018-highlights-and-autoplay.md)).

The demo only needs a handful of works, so this is a one-off job per work.

## Decision

Keep one annotation file per work in the repository, holding the characters (id, names, first
appearance, introduction), the highlights and the work's introduction. Draft it with a general
language model (Claude, working in the development environment) reading the full text, then
review and correct it by hand.

The division of labour:

- **Annotation (once per work):** anything that needs the whole text.
- **Code:** name matching, accumulation, display.
- **Jev (per paragraph):** trait judgments, and presence where names alone miss it
  ([ADR 0017](0017-presence-gate.md)).

## Consequences

The README states that annotations were drafted with AI assistance and reviewed by a person.
Adding a work means writing and reviewing its annotation file before judging it. Introductions
must only describe a character as they are known at their first appearance.
