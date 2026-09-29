# 12. Target desktop browsers; show a video on narrow screens

- Status: Accepted
- Date: 2026-09-28

## Context

The point of the demo is seeing the text and the character charts side by side, changing
together as the reader moves through the story. On a tall, narrow phone screen there is no room
for that. Fitting it anyway would turn the page into a plain novel reader with a chart somewhere
below it, which loses what the demo is for. Making every panel responsive would also cost a large
share of the effort for a view that cannot show the idea.

Some visitors will still open the link on a phone.

## Decision

Design for desktop browsers, with a common laptop width (around 1280 px) as the minimum that must
fit all three columns. Below that width, show a short note asking the visitor to open the page on
a desktop browser, together with a recorded video of the demo in use.

## Consequences

No layout work for phones or tablets in portrait. The demo video, which the README needs anyway,
doubles as the narrow-screen fallback, so visitors on a phone still see the idea working.

*Amended 2026-09-29:* no video of the whole page: its movement is small and brief next to its size,
so it would be hard to follow. Narrow screens show the note and the link-preview screenshot of the
whole page (`public/og-image.png`, [ADR 0023](0023-nextjs-static-export.md)). The README opens with
a short edited video instead, zoomed in on the text and the impression, with captions and a drawn
cursor; it is attached through GitHub rather than kept in the repository. Narrow screens keep the
screenshot rather than that video: it would cost mobile data for people who did not ask for it,
and visitors arriving from a post of the video have already seen it.
