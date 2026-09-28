# 38. A radar for the current part, a ranking for the story so far

- Status: Accepted
- Date: 2026-09-28
- Supersedes: [0005](0005-two-layer-chart.md), [0020](0020-radar-and-timeline.md)

## Context

The prototype showed two layers on the radar (the accumulated profile underneath, the current part
on top) and a timeline of the accumulated values below it. Looking at it on screen, neither read
easily: overlapping shapes and six coloured lines both have to be decoded before they say anything,
and the charm of the project — plain, casual words applied to classic characters — was buried under
the geometry.

## Decision

- **Radar: the current part only.** One filled shape showing the impression this part gives, on six
  axes chosen on the chart ([ADR 0037](0037-six-axes-chosen-on-the-radar.md)). An axis with no
  evidence in the part says 印象なし on the axis.
- **Ranking: the story so far.** All 30 traits of the dictionary ranked by accumulated value, top
  ten shown, each with its casual label and a bar. No rank-change markers and no count of traits
  without evidence; both were tried and made the list noisier.
- **Motion carries the change.** When the reader turns a page, bars grow and shrink and rows slide
  to their new ranks; traits entering or leaving the top ten fade (Motion, with reduced motion
  honoured, [ADR 0021](0021-keyboard-and-reduced-motion.md)).
- **The timeline is dropped.**

## Consequences

Change over time is no longer drawn as lines; it shows as movement in the ranking while reading or
during autoplay. The king's change of heart in *Run, Melos!* reads as *怖い人*, *独裁者* and *鬼*
falling while *水に流せる* and *情に厚い* rise. The accumulated values are computed as before
([ADR 0002](0002-model-judges-code-accumulates.md), [ADR 0004](0004-older-paragraphs-fade.md)).
