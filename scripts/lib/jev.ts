/**
 * A small Jev client on fetch (ADR 0026). Two routes with different request shapes:
 * the official API and the Vercel AI Gateway, which calls the yes/no type `boolean`.
 */
import type { JudgeRequest } from "../../src/core/judging";

export interface JudgeResult {
  model: string;
  /** Each question's answer: noul 0–1, score 0–4. */
  answers: Record<string, number>;
  inputTokens: number;
}

/** Anything that can answer a request: Jev on either route, or a stand-in. */
export interface Judge {
  judge(request: JudgeRequest): Promise<JudgeResult>;
}

export type Route = "official" | "vercel";

const ROUTES = {
  official: { url: "https://api.typesafe.ai/v1/systemone", model: "jev-latest", keyVar: "TYPESAFE_API_KEY" },
  vercel: { url: "https://ai-gateway.vercel.sh/v1/evaluate", model: "typesafe-ai/jev", keyVar: "AI_GATEWAY_API_KEY" },
} as const;

type Answer = { noul?: number; probability?: number; score?: number };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function jev(route: Route, { attempts = 10, log = console.error } = {}): Judge {
  const { url, model, keyVar } = ROUTES[route];
  const key = process.env[keyVar];
  if (!key) throw new Error(`${keyVar} is not set`);

  const body = (req: JudgeRequest) => {
    const questions =
      route === "vercel"
        ? Object.fromEntries(
            Object.entries(req.questions).map(([k, q]) => [k, q.type === "noul" ? { ...q, type: "boolean" } : q]),
          )
        : req.questions;
    return JSON.stringify({ model, state: req.state, questions });
  };

  return {
    async judge(req) {
      const payload = body(req);
      for (let attempt = 0; attempt < attempts; attempt++) {
        let res: Response;
        try {
          res = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: payload,
            signal: AbortSignal.timeout(120_000),
          });
        } catch (e) {
          log(`network error (${(e as Error).message}), retrying`);
          await sleep(10_000);
          continue;
        }
        if (res.status === 429 || res.status === 529) {
          const wait = Math.min(60_000, 5_000 * 2 ** attempt);
          log(`${res.status}, retrying in ${wait / 1000}s`);
          await sleep(wait);
          continue;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
        const data = (await res.json()) as {
          model?: string;
          answers: Record<string, Answer>;
          usage?: { input_tokens?: number };
        };
        const answers: Record<string, number> = {};
        for (const [k, a] of Object.entries(data.answers)) {
          const v = a.noul ?? a.probability ?? a.score;
          if (typeof v === "number") answers[k] = v;
        }
        return { model: data.model ?? model, answers, inputTokens: data.usage?.input_tokens ?? 0 };
      }
      throw new Error(`gave up after ${attempts} attempts`);
    },
  };
}
