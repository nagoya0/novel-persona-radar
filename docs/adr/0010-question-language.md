# 10. Write questions in English, keep the text in Japanese

- Status: Accepted
- Date: 2026-09-27

## Context

Jev's documentation names English as its primary language and warns of lower accuracy in others. The novels are Japanese. Early tests used English questions over Japanese text with sensible results.

## Decision

Write instructions and answer options in English, and pass the novel's text untranslated. Trait questions use the dictionary's English word and gloss; the Japanese labels are for display only.

## Consequences

Confirmed by comparing English and Japanese questions on five paragraphs of *Run, Melos!* (two characters, 100 traits). The top traits largely agreed and score correlations were 0.69 to 0.92, with neither version clearly better. English is kept: it is the model's primary language, and the trait dictionary's English glosses can go into the question.
