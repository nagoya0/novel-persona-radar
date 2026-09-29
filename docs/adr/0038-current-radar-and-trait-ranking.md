# 38. A radar for the current part, a ranking for the story so far

- Status: Accepted
- Date: 2026-09-28
- Supersedes: [0005](0005-two-layer-chart.md), [0020](0020-radar-and-timeline.md)

## Context

The prototype showed two layers on the radar (the accumulated profile underneath, the current part
on top) and a timeline of the accumulated values below it. On screen this was too much information:
the overlapping shapes and the six coloured lines both have to be worked out before the viewer can
tell what they show.

What makes this demo interesting is a combination of two things: a reader for serious literary
classics, and personality judgments of their characters in casual words such as *キレやすい* or
*ぶっ飛んでる*. Visitors to a demo decide at first sight whether it is interesting. When the screen
first asks them to work out charts, the combination does not come across, and a visitor who does not
understand what they are looking at may simply stop.

So the analysis column is judged by whether a first look conveys what is interesting, not only by
whether each chart can be read. The prototype did not meet this, so the information shown was cut
down to the essentials.

## Decision

- **Radar: the current part only.** One filled shape showing the impression this part gives, on six
  axes chosen on the chart ([ADR 0037](0037-six-axes-chosen-on-the-radar.md)). An axis with no
  evidence in the part says 印象なし on the axis.
- **Ranking: the story so far.** All 30 traits of the dictionary ranked by accumulated value, top
  ten shown, each with its casual label and a bar. No rank-change markers and no count of traits
  without evidence; both were tried and made the list noisier.
- **Change is shown by animation.** When the reader turns a page, bars grow and shrink and rows slide
  to their new ranks; traits entering or leaving the top ten fade (Motion, with reduced motion
  honoured, [ADR 0021](0021-keyboard-and-reduced-motion.md)).
- **The timeline is dropped.**
- **Framing.** The column is titled *Jev が抱いた印象*; a *仕組み* section at the bottom explains
  in four points how the judgments are made and that they are computed in advance.
- **Evidence thresholds.** A trait shows on the radar with 0.4 evidence in the part, and in the
  ranking with 0.8 accumulated: a part holds only a few paragraphs.
- **What counts where.** A paragraph adds to the accumulated profile once, in the part where it
  starts; the current part's radar uses every paragraph shown in it, including the continuation
  of a split one ([ADR 0015](0015-judge-paragraphs-show-parts.md)).

## Consequences

Change over time is no longer drawn as lines; it shows as movement in the ranking while reading or
during autoplay. The king's change of heart in *Run, Melos!* reads as *怖い人*, *独裁者* and *鬼*
falling while *水に流せる* and *情に厚い* rise. The accumulated values are computed as before
([ADR 0002](0002-model-judges-code-accumulates.md), [ADR 0004](0004-older-paragraphs-fade.md)).

*Amended 2026-09-29:* with the radar and ranking on screen, the values need no normalisation. Where
evidence is strong, many traits score near the maximum in a single paragraph, but the weighted
accumulation keeps most values between 2 and 3 out of 4
([ADR 0035](0035-trait-dictionary-from-screening.md)), and the ranking reads naturally.
