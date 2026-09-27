# 3. Ask for evidence and score separately

- Status: Accepted
- Date: 2026-09-27

## Context

An early test on the opening of *Run, Melos!*: two paragraphs, two characters, five traits, one request of 40 questions, about 0.27 s.

- Melos, paragraph 1, *sense of justice*: evidence 0.93, score 3.81 / 4
- King Dionis, paragraph 2, *suspicious*: evidence 0.95, score 3.87 / 4
- Melos, paragraph 2 (he does not appear), *suspicious*: evidence 0.22, **score 1.43**

Asked for a score about a character who is not in the paragraph, the model still returns a number.

## Decision

For each character and trait, ask two questions: whether the paragraph gives any evidence about the trait (a probability), and how strongly the trait fits (a score). Weight each score by its evidence probability when accumulating. A trait with little accumulated evidence is drawn grey, as *unknown*, rather than as a value.

## Consequences

Twice the questions per paragraph. Questions in one request are answered in parallel, so this costs input tokens but not time.
