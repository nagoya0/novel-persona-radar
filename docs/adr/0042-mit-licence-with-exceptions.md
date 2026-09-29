# 42. MIT License, except for the novels and the judgments

- Status: Accepted
- Date: 2026-09-29

## Context

The repository is about to become public. It holds material with different owners:

- code, documentation, screenshots and the annotation files, written for this project;
- the novels' source files, public-domain works published by Aozora Bunko, whose guidelines ask
  that the credits be kept ([ADR 0009](0009-aozora-bunko-credits.md));
- the judgments, which are Jev's output. TypeSafe AI's Master Customer Agreement
  (<https://typesafe.ai/legal/mca>, section 4.2) disclaims ownership of output and assigns it to
  the customer, and does not restrict publishing it. Section 2.3(b) forbids using output for model
  distillation, to train a model to imitate the service, or to develop, or facilitate the
  development of, a competing product.

Alternatives considered for the code: Apache-2.0, whose patent terms this project does not need,
and no licence, which would leave the code visible but not reusable.

## Decision

- Release the code, documentation and annotations under the MIT License.
- Exclude the novels: they stay in the public domain, with their Aozora Bunko credits.
- Exclude the judgments: they are published so that the demo can be reproduced and checked, with a
  request not to use them to train or distil models, so that publishing them does not facilitate
  what section 2.3(b) forbids.

The scope and the exceptions are stated in the README's License section.

## Consequences

Anyone may reuse the code. Adding a work adds its source file and judgments under the same
exceptions.
