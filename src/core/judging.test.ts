import { describe, expect, it } from "vitest";
import { buildRequest, characterLabel, judgingJobs, readAnswers } from "./judging";
import type { Annotation, Character, Trait } from "./types";

const character = (id: string, name: string, names: string[], judged = true): Character => ({
  id,
  judged,
  name,
  names,
  firstMention: 0,
  firstOnStage: 0,
  intro: "",
});

const annotation: Annotation = {
  id: "run-melos",
  title: "走れメロス",
  author: "太宰治",
  narrator: { person: "third", character: null },
  summary: "",
  source: { url: "", file: "", sha256: "", credits: [] },
  excludedParagraphs: [3],
  characters: [
    character("melos", "メロス", ["メロス", "勇者"]),
    character("king", "ディオニス王", ["ディオニス", "王", "暴君", "王様", "国王"]),
    character("crowd", "群衆", ["群衆"], false),
  ],
  highlights: [],
  paragraphs: [
    { index: 0, voices: [{ kind: "narrative", subject: "narrator" }], onStage: ["melos"], mentioned: ["king"] },
    {
      index: 1,
      voices: [{ kind: "speech", subject: "king" }],
      onStage: ["king", "melos", "crowd"],
      mentioned: [],
      context: "The king speaks.",
      reviewNote: "Not for Jev.",
    },
    { index: 2, voices: [], onStage: ["crowd"], mentioned: [] },
    { index: 3, voices: [], onStage: ["melos"], mentioned: [] },
  ],
};

const traits: Trait[] = [
  { id: "suspicious", en: "Suspicious", gloss: "distrusts others", group: "negative", ja: { formal: "", casual: "" } },
  { id: "loyal", en: "Loyal", gloss: "stands by friends and allies", group: "positive", ja: { formal: "", casual: "" } },
];

describe("judgingJobs", () => {
  it("lists judged on-stage characters per paragraph, skipping excluded paragraphs", () => {
    const jobs = judgingJobs(annotation).map((j) => `${j.paragraph.index}/${j.character}`);
    expect(jobs).toEqual(["0/melos", "1/king", "1/melos"]);
  });
});

describe("characterLabel", () => {
  it("lists other names after the display name", () => {
    expect(characterLabel(annotation.characters[1])).toBe("ディオニス王 (also called ディオニス, 王, 暴君, 王様, 国王)");
    expect(characterLabel(annotation.characters[0])).toBe("メロス (also called 勇者)");
  });

  it("uses the name alone when there is no other", () => {
    expect(characterLabel(annotation.characters[2])).toBe("群衆");
  });
});

describe("buildRequest", () => {
  const [, king] = judgingJobs(annotation);
  const req = buildRequest(annotation, traits, king, "暴君は呟いた。");

  it("describes the paragraph by names, not ids, and leaves out the review note", () => {
    expect(req.state).toEqual({
      work: "走れメロス by 太宰治, told by a third-person narrator",
      paragraph: "暴君は呟いた。",
      voices: [{ kind: "speech", subject: "ディオニス王" }],
      characters_on_stage: ["ディオニス王", "メロス", "群衆"],
      characters_mentioned: [],
      context: "The king speaks.",
    });
  });

  it("asks an evidence and a score question per trait", () => {
    expect(Object.keys(req.questions)).toEqual(["suspicious.ev", "suspicious.sc", "loyal.ev", "loyal.sc"]);
    expect(req.questions["suspicious.ev"]).toEqual({
      type: "noul",
      instructions:
        "Does this paragraph itself give any evidence about whether ディオニス王 (also called ディオニス, 王, 暴君, 王様, 国王) is Suspicious (distrusts others)?",
    });
    expect(req.questions["suspicious.sc"]).toEqual({
      type: "score",
      instructions: "Judging from this paragraph, how Suspicious (distrusts others) is ディオニス王 (also called ディオニス, 王, 暴君, 王様, 国王)?",
      criteria: ["not at all", "slightly", "moderately", "very", "extremely"],
    });
  });

  it("omits context when the paragraph has none", () => {
    const [first] = judgingJobs(annotation);
    expect(buildRequest(annotation, traits, first, "").state).not.toHaveProperty("context");
  });
});

describe("readAnswers", () => {
  it("pairs evidence and score, rounded to two decimals", () => {
    const answers = { "suspicious.ev": 0.9512, "suspicious.sc": 3.8666, "loyal.ev": 0, "loyal.sc": 0.004 };
    expect(readAnswers(answers, traits)).toEqual({ suspicious: [0.95, 3.87], loyal: [0, 0] });
  });

  it("fails when an answer is missing", () => {
    expect(() => readAnswers({ "suspicious.ev": 1 }, traits)).toThrow("suspicious");
  });
});
