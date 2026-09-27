# 33. Pin each work's source file in the repository

- Status: Accepted
- Date: 2026-09-28

## Context

The annotation file and the stored judgments refer to paragraphs by index. If the text they were
made from changes, every index after the change can point at the wrong paragraph, and nothing
would notice. Aozora Bunko does revise its files; *Run, Melos!* was published in 2000 and corrected
in 2011. A correction that merges or splits a paragraph would silently break a work.

Works whose copyright has expired may be freely redistributed from Aozora Bunko, provided the
source credits are kept ([ADR 0009](0009-aozora-bunko-credits.md)). Some works on Aozora Bunko are
still under copyright and published with the holder's permission; those carry their own terms.

## Decision

- Store each work's Aozora Bunko XHTML file in the repository, byte for byte as downloaded, as
  `data/works/<id>/source.html`. Git treats these files as binary so that line-ending
  normalisation cannot change them.
- Record the file's SHA-256, source URL and download date in the annotation file. The pipeline
  refuses to run if the hash does not match.
- The importer derives paragraphs from the pinned file only, never from the live site.
- Only add works whose copyright has expired.

## Consequences

Annotations and judgments always refer to the text they were made from. Taking in a revised source
is a deliberate step: replace the file, update the hash, and review the annotation.
