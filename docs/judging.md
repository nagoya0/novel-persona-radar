# Judging requests

The shape of the requests behind `data/works/<id>/judgments.jsonl`. Built by
[src/core/judging.ts](../src/core/judging.ts) and sent by `pnpm judge <work-id>`
([ADR 0026](adr/0026-node-pipeline-and-jev-client.md)); the key is read from the environment
variable `TYPESAFE_API_KEY` (`AI_GATEWAY_API_KEY` for the Vercel route). `--dry-run` prints the
first request without sending anything.

## One request per paragraph and on-stage character

For every paragraph that is not excluded, and every character that is `judged` and listed in the
paragraph's `onStage` ([ADR 0032](adr/0032-on-stage-profiles-and-two-first-appearances.md)):

```
POST https://api.typesafe.ai/v1/systemone
Authorization: Bearer $TYPESAFE_API_KEY
```

```json
{
  "model": "jev-latest",
  "state": {
    "work": "走れメロス by 太宰治, told by a third-person narrator",
    "paragraph": "<the paragraph text, ruby readings removed>",
    "voices": [{ "kind": "speech", "subject": "ディオニス王" }, { "kind": "narrative", "subject": "narrator" }],
    "characters_on_stage": ["ディオニス王", "メロス"],
    "characters_mentioned": [],
    "context": "<the paragraph's context note, only if it has one>"
  },
  "questions": { "…": "…" }
}
```

- `paragraph`: text only, ruby base kept and readings dropped; the full-width indent space removed.
- `voices`: the annotation's voices with character ids replaced by display names
  ([ADR 0034](adr/0034-paragraph-voices.md)).
- No previous paragraphs ([ADR 0030](adr/0030-annotated-cast-instead-of-previous-paragraphs.md)).
- `reviewNote` is never sent.

## Questions: two per trait, 60 per request

The character is named as `<name> (also called <other names>)`, e.g.
`ディオニス王 (also called ディオニス, 王, 暴君, 王様, 国王)`. For each trait in
`data/traits/dictionary.json`, with `<label>` = `<en> (<gloss>)`, e.g. `Suspicious (distrusts others)`:

```json
"<trait id>.ev": {
  "type": "noul",
  "instructions": "Does this paragraph itself give any evidence about whether <character> is <label>?"
},
"<trait id>.sc": {
  "type": "score",
  "instructions": "Judging from this paragraph, how <label> is <character>?",
  "criteria": ["not at all", "slightly", "moderately", "very", "extremely"]
}
```

`noul` answers come back as `answers[k].noul` (0–1), `score` answers as `answers[k].score` (0–4).
The Vercel AI Gateway route calls the yes/no type `boolean` and returns `probability`.

## Stored form

One JSON line per request, appended as answers arrive so a run can resume
([ADR 0027](adr/0027-files-not-a-database.md)):

```json
{"paragraph": 20, "character": "king", "model": "jev-1.13.0", "traits": {"suspicious": [0.95, 3.87], "…": [0, 0]}}
```

`traits[id]` is `[evidence, score]`.

## Numbers

- Screening, 100 candidate traits (200 questions per request): *Run, Melos!* in 152 requests, about
  2 million input tokens, about US$0.09, one minute.
- The 30-trait dictionary (60 questions per request): 152 requests, 670 thousand input tokens,
  about US$0.03. It took twelve minutes with no `429`s: the first forty responses took about
  seventeen seconds each, the rest a third of a second.
- Repeatability: judging again with the same model (`jev-1.13.0`) and the same requests changed
  evidence by 0.01 and scores by 0.05 on average (correlation above 0.99), and left each character's
  top five traits unchanged apart from the king's fourth and fifth.
