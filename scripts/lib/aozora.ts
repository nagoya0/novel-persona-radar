/** Aozora Bunko XHTML (already decoded from Shift_JIS) into paragraphs, keeping ruby. */
import type { Paragraph, Segment } from "../../src/core/types";

const decodeEntities = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');

export function parseAozora(html: string): Paragraph[] {
  const main = html.match(/<div class="main_text">([\s\S]*?)<div class="bibliographical_information">/);
  if (!main) throw new Error("main_text not found");
  const lines = main[1].split(/<br\s*\/>/);
  const paragraphs: Paragraph[] = [];
  for (const raw of lines) {
    const segments: Segment[] = [];
    const re = /<ruby><rb>([\s\S]*?)<\/rb><rp>[\s\S]*?<\/rp><rt>([\s\S]*?)<\/rt><rp>[\s\S]*?<\/rp><\/ruby>/g;
    let last = 0;
    let m: RegExpExecArray | null;
    const pushText = (t: string) => {
      const text = decodeEntities(t.replace(/<[^>]+>/g, "")).replace(/[\r\n]/g, "");
      if (text) segments.push(text);
    };
    while ((m = re.exec(raw))) {
      pushText(raw.slice(last, m.index));
      segments.push({ rb: decodeEntities(m[1]), rt: decodeEntities(m[2]) });
      last = re.lastIndex;
    }
    pushText(raw.slice(last));
    // Drop the leading full-width space used for indentation; indentation is styling.
    if (typeof segments[0] === "string") segments[0] = segments[0].replace(/^　+/, "");
    const cleaned = segments.filter((s) => typeof s !== "string" || s.trim() !== "");
    if (!cleaned.length) continue;
    const length = cleaned.reduce((n, s) => n + (typeof s === "string" ? s.length : s.rb.length), 0);
    const first = typeof cleaned[0] === "string" ? cleaned[0] : cleaned[0].rb;
    paragraphs.push({ index: paragraphs.length, segments: cleaned, length, indent: !/^[「『（(]/.test(first) });
  }
  return paragraphs;
}

/** The text Jev reads: ruby base kept, readings and every full-width space dropped. */
export function plainText(p: Paragraph): string {
  return p.segments
    .map((s) => (typeof s === "string" ? s : s.rb))
    .join("")
    .replace(/　/g, "")
    .trim();
}
