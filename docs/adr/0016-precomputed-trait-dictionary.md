# 16. Judge a fixed trait dictionary in advance; let the viewer pick the axes

- Status: Accepted
- Date: 2026-09-28
- Supersedes: [0007](0007-random-axes.md)

## Context

[ADR 0007](0007-random-axes.md) drew the chart's axes at random. With judgments computed in
advance ([ADR 0008](0008-replay-in-the-demo.md)), any axis the viewer might see has to be judged
beforehand, so the set of possible axes has to be fixed.

A test on one paragraph of *Run, Melos!* (the king privately sneering that Melos will never come
back) sent 5 characters × 30 traits × 2 questions = 300 questions in a single request. It
returned in 0.51 s with about 22,300 input tokens. The king came out as *腹黒い* (scheming)
evidence 0.94 / score 3.8, *疑り深い* (suspicious) 0.93 / 3.8, *策士* (schemer) 0.88 / 3.4 —
casual, playful trait names were understood when each came with a short English description.
At that size a whole short story (75 paragraphs) costs roughly ten yen.

## Decision

Keep a dictionary of about 30 traits, labelled with casual, everyday words rather than
psychological terms (*良い上司* "would make a good boss", *キレやすい* "quick to snap",
*ぶっ飛んでる* "wildly out there"): judging characters of serious literary classics in such words
is what makes the demo interesting ([ADR 0038](0038-current-radar-and-trait-ranking.md)). Each
trait has a short English description that goes into the question. Judge every character against every trait
for every paragraph in advance. The viewer picks the chart's axes from the dictionary, and can
also draw a random set.

## Consequences

Switching axes is instant and costs nothing. Adding a trait to the dictionary means judging every
paragraph of every work again for that trait. One request per paragraph is enough at this size;
if the dictionary or cast grows, split requests by character.
