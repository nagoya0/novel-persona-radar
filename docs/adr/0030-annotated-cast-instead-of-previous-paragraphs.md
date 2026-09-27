# 30. Give each paragraph its annotated speakers and cast, not the previous paragraphs

- Status: Accepted
- Date: 2026-09-28
- Supersedes: [0006](0006-context-for-each-paragraph.md)

## Context

[ADR 0006](0006-context-for-each-paragraph.md) passed the previous two or three paragraphs so that
Jev could tell who is speaking and who "he" is. The purpose was to read the current paragraph
correctly, not to add evidence.

An experiment on five paragraphs of *Run, Melos!* (two characters, 100 traits each) compared three
forms of the request:

| Paragraph | Previous three paragraphs | No context | Annotated speakers and cast |
|---|---|---|---|
| 28, 妹は頬をあからめた (Melos) | *deceitful* evidence 0.45 | highest evidence 0.13 | highest evidence 0.14 |
| 68, the king's change of heart (king) | *outspoken* 0.77, *emotional* 0.77 | *emotional* 0.68, *forgiving* 0.67 | *emotional* 0.86, *forgiving* 0.85, *trusting* 0.81 |

With previous paragraphs, Jev counted their content as evidence in the current paragraph: in 28,
Melos hiding the truth from his sister one paragraph earlier. Each paragraph's evidence would be
counted again in the paragraphs after it. Where a paragraph's evidence was clear (the king in 12
and 20), the form of the request made little difference.

## Decision

Send the current paragraph only, together with facts from the work's annotation file
([ADR 0019](0019-work-annotation-files.md)) for that paragraph: its speakers (or "narration") and
the characters present or mentioned. Never send the whole annotation file: its introductions and
highlights describe later parts of the story.

The annotation file therefore holds, for every paragraph, its speakers and the characters present.

## Consequences

Annotating a work includes every paragraph, not only the characters. Paragraphs whose speaker is
not stated in the text are flagged for human review. Sarcasm or irony that only the preceding
scene reveals is not covered; the speaker usually makes the meaning clear enough.
