# Novel Persona Radar

Read a novel and watch its characters take shape.

As you scroll through a public-domain Japanese novel from [Aozora Bunko](https://www.aozora.gr.jp/),
each character's personality is drawn as a radar chart that grows paragraph by paragraph.
The axes are picked at random from a dictionary of traits — *stingy*, *kind*, *hot-tempered*,
*suspicious* — so some come into focus as the story goes on, and some stay grey because the
story never tells us.

> **Status:** concept stage. Nothing runs yet; the design so far is recorded in [docs/adr](docs/adr/).

## How it works

1. **Code** splits the text into paragraphs and finds the characters and who is speaking.
2. **[Jev](https://typesafe.ai)** reads each paragraph (with a little of what came before) and
   answers two typed questions per character and trait:
   - *Is there any evidence here?* — a probability
   - *If so, how much does the trait fit?* — a score on a fixed scale
3. **Code** accumulates those answers, weighted by the evidence probability, with older
   paragraphs slowly fading so that characters can change over the course of the story.
4. A radar shows the impression the current page gives, and a ranking of all traits shows the
   profile built up so far; bars and ranks shift as the reader turns pages.

Jev returns decisions, not prose, so it can be asked dozens of questions per paragraph for a
fraction of a cent. The accumulation, weighting and drawing are ordinary code — the model is
only asked what a reader could judge from the text in front of them.

## Why two questions instead of one

A score on its own is noisy: asked how *suspicious* a character is in a paragraph where they
do not appear, the model still answers with a number. Asking first whether the paragraph says
anything about that trait at all, and weighting by the answer, keeps the chart from drifting.
See [ADR 0003](docs/adr/0003-evidence-and-score.md) for the test that showed this.
