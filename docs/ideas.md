# Ideas

Things not decided yet. When an idea is settled it becomes an [ADR](adr/) and is removed from here.

## Open work

Decided but not built yet, roughly in order:

1. **Screenshot or video** for the README demo section, which would also serve as the
   narrow-screen fallback ([ADR 0012](adr/0012-desktop-browser-first.md)); which one is undecided.
   Capture it from the deployed site, not the dev server.
2. **Link previews.** Pages have a title and description but no Open Graph tags or preview image,
   which [ADR 0023](adr/0023-nextjs-static-export.md) planned per work.
3. **Licence and a fresh pre-release audit** before making the repository public. The audit
   includes the ADRs: check that each records what was actually agreed, not an assumption.

## Features

- **Jump to the evidence.** Clicking a trait in the ranking or on the radar jumps to the paragraph
  that raised it most ("this line sent *sense of justice* up"). Jev does not explain its answers;
  the paragraph itself can serve as the explanation.
- **Decay slider.** Let the viewer change how fast older paragraphs fade
  ([ADR 0004](adr/0004-older-paragraphs-fade.md)). The king in *Run, Melos!* is the showcase:
  with a fast decay his suspicion visibly drops at the end.
- **Reader with preconceptions.** An optional mode that passes the profile so far as context,
  to compare against the fresh-eyes default ([ADR 0006](adr/0006-context-for-each-paragraph.md)).
- **Speaker confidence.** Show how sure the speaker attribution is for each line.
- **Export a persona.** Turn an accumulated profile into a starting point for a chat character
  based on the same person.

## Interface

Proposed, not yet decided. Decided so far: layout ([ADR 0013](adr/0013-three-column-layout.md)),
analysis column ([ADR 0038](adr/0038-current-radar-and-trait-ranking.md)), reading controls
([ADR 0039](adr/0039-reading-controls.md)), work column ([ADR 0040](adr/0040-work-column.md)),
autoplay ([ADR 0041](adr/0041-autoplay-button.md)).

- **Evidence in the text.** Mark the paragraphs that gave evidence for the selected character;
  hovering a trait in the ranking or on the radar highlights its evidence.
- **Reputation.** A second profile built from paragraphs where a character is only mentioned
  ([ADR 0032](adr/0032-on-stage-profiles-and-two-first-appearances.md)): what others say before the
  reader meets them, against who they turn out to be. Fits *Run, Melos!*, a story about trust.
  How to draw it alongside the profile is the open part.
- **Compare two characters**, e.g. their rankings side by side (Melos and the king).
- **Detect highlights from the data.** The parts where the ranking moves most
  ([ADR 0018](adr/0018-highlights-and-autoplay.md)).
- **Deep links without the flash.** Read `?part=` before the first render instead of jumping after
  mount ([ADR 0039](adr/0039-reading-controls.md)).

## Translation choices ([ADR 0011](adr/0011-translation-decisions.md))

- Demo text: *Little Women* (public domain). Four sisters, so *sister* is an older or younger
  sister depending on who is speaking, and the sisters' ages are known, which gives ground truth.
- Split the work: Jev resolves *who* "my sister" refers to (a choice among known characters);
  code derives older or younger from their ages. Jev only guesses the relation directly when
  ages are unknown.
- Other choices with the same shape: *you* (あなた / 君 / お前 / あんた), *they*, *uncle*
  (伯父 / 叔父 depends on age relative to the parent), *cousin*.
- Early results: clear context gave 0.90–1.00; a sentence with no clue gave 0.51 / 0.49.

## Related Japanese judgments

Tested and worked, but outside this project's scope for now:

- Reading disambiguation: 辛い (からい / つらい), 生物 (せいぶつ / なまもの), 上手 (じょうず / うわて / かみて).
- Homophone misconversion: 追求 / 追及, 以外 / 意外.
- Omitted subjects: who treated whom in 「コーヒーをおごってくれた」.

## Open questions

- **Random draws.** Whether near-synonyms and opposites should be kept out of the same random draw
  of axes ([ADR 0016](adr/0016-precomputed-trait-dictionary.md)).
- **Speakers absorbing what they describe.** In the screening run, the old man, who only reports the
  king's cruelty, came out *suspicious*, *cruel* and *domineering* himself. The reverse of
  *characters seen through others*: describing a trait is read as having it.
- **Characters seen through others.** In paragraph 20 the king privately calls Melos a liar while
  Melos is on stage; Jev gave Melos *deceitful* evidence 0.53 with a score of 0.8. Paragraph-level
  annotation cannot separate such opinions from direct evidence (see [ADR 0032](adr/0032-on-stage-profiles-and-two-first-appearances.md)).
- **Speakers within a paragraph.** The annotation lists a paragraph's speakers but not which line
  is whose. Fine for *Run, Melos!*, where lines of dialogue are separate paragraphs; a work where
  two characters speak different lines in one paragraph would need speakers per quoted span.
- **Parsing richer Aozora Bunko markup.** The source is parsed with regular expressions, which is
  enough for *Run, Melos!* (ruby and line breaks only) but departs from
  [ADR 0026](adr/0026-node-pipeline-and-jev-client.md) (an HTML parser). Other works have gaiji
  images (JIS-less kanji, currently dropped without a trace), chapter headings (currently read as
  paragraphs) and indentation markup. Switch to an HTML parser and handle these before adding the
  next work.
- **First-person narrators.** Requests describe such works as told in the first person by the
  narrator character, but no first-person work has been judged yet (*Botchan* would be the first).
- **Which works to ship.** *Run, Melos!* is short and has a clear change of heart.
  *Botchan* is long (about a thousand paragraphs, so about a thousand requests).
