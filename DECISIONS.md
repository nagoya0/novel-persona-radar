# Decisions

Why things are the way they are. Only what cannot be read from the code or the git history.

## The model judges; the code remembers

Jev is stateless: every request stands alone, and questions within one request cannot see each
other's answers. So Jev is only asked about the paragraph in front of it, and everything that
spans the story — accumulating evidence, weighting, fading, deciding what to draw — lives in
code. This also means the accumulation can be tuned and replayed without calling the model again.

## Ask for evidence and score separately

Early test on the opening of *Run, Melos!* (two paragraphs, two characters, five traits, one
request of 40 questions, ~0.27 s):

- Melos, paragraph 1 — *sense of justice*: evidence 0.93, score 3.81 / 4
- King Dionis, paragraph 2 — *suspicious*: evidence 0.95, score 3.87 / 4
- Melos, paragraph 2 (he does not appear) — *suspicious*: evidence 0.22, **score 1.43**

The last line is the reason for two questions. Without an evidence question, paragraphs that say
nothing about a character still move their chart. Scores are weighted by the evidence probability,
and a trait with little accumulated evidence is drawn grey ("unknown") rather than as a value.

## Older paragraphs fade

A plain average hides character change: the king in *Run, Melos!* stops being suspicious at the
very end, and an average over the whole story would barely move. Evidence is weighted toward
recent paragraphs with an adjustable decay. A slow decay shows who a character *is*; a fast one
shows who they are *right now*.

## Two layers on the chart

Per-paragraph judgments jump around, which is expected — each scene shows a different side of a
character — and is interesting to watch. The chart shows both: the current paragraph as a thin
line, the accumulated picture as a thick one.

## Context

A paragraph on its own often does not say who "he" is, who is speaking, or whether a line is
sarcastic. Two measures:

- Pass the previous two or three paragraphs along with the current one.
- Resolve the speaker of each line first, then attribute trait evidence to that character.

Considered: passing the accumulated profile so far as context. This risks self-reinforcement —
a first impression that colours every later judgment. It may be worth offering as a deliberate
"reader with preconceptions" mode to compare against the fresh-eyes default, but not as the default.

## Random axes

Axes are drawn from a trait dictionary instead of a fixed set. Traits the story never addresses
stay grey, and that is a result in itself.

## The public demo replays recorded judgments

Jev is new and its capacity is limited: during testing, requests through one provider failed with
`429` for tens of minutes at a time. The demo therefore runs on judgments computed in advance and
stored with the text. Viewers never trigger a model call, which also keeps the running cost at zero.
The judging step sits behind an interface so that another model or a rule-based fallback can be
used when Jev is unavailable.

## Texts

Works come from Aozora Bunko. Its file-handling guidelines ask that the source edition and the
names of the volunteers who input and proofread the text be kept; the demo shows them with each work.

## Later: translation decisions

The same per-character accumulation can resolve choices that English-to-Japanese translation
has to make from context — whether *sister* is an older or younger sister, how to render *you*.
In a test, Jev answered 0.51 / 0.49 for a sentence with no clue, which is the behaviour wanted:
uncertainty shows instead of a confident guess. Not in scope for the first version.
