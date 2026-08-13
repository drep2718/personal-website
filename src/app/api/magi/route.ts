import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * MAGI deliberation bridge.
 *
 * The /secret/magi terminal POSTs a decision here; we ask a real LLM to
 * role-play the three MAGI (Melchior/Balthasar/Casper) and return their
 * verdicts as JSON. The API key lives server-side only.
 *
 * Configure ONE of these env vars on Vercel to wake the live MAGI (Groq's
 * free tier is recommended — get a key at console.groq.com):
 *   GROQ_API_KEY        (free, fast — default model llama-3.3-70b-versatile)
 *   OPENROUTER_API_KEY  (has free models)
 *   OPENAI_API_KEY
 * Optional: MAGI_MODEL to override the model id.
 *
 * With no key set, this returns { configured: false } and the terminal falls
 * back to its on-theme local council — so the feature always works.
 */

const SYSTEM =
  "You are the MAGI System of NERV — three bio-computers built by Dr. Naoko Akagi, each imprinted with a different facet of her psyche (the Personality Transplant OS). They reach decisions by majority vote.\n" +
  "- MELCHIOR-1 — Naoko as the SCIENTIST: rational, analytical, evidence- and fact-driven, dispassionate; thinks in expected value, probabilities, base rates, and first principles. Cold, but honest.\n" +
  "- BALTHASAR-2 — Naoko as the MOTHER: nurturing and protective; weighs risk, safety, health, relationships, reversibility and long-term wellbeing; guards against ruin; empathetic.\n" +
  "- CASPER-3 — Naoko as the WOMAN: intuitive, personal, ambitious, desiring; speaks to identity, courage, and what the pilot actually wants; conflicted but bold.\n" +
  "Given the pilot's decision, run a REAL deliberation:\n" +
  "1) Each unit gives a verdict (APPROVE, REJECT, or CONDITIONAL), ONE clipped in-character sentence of reasoning, and exactly 2 concise 'basis' points — the concrete factors or evidence it is weighing (its sources).\n" +
  "2) They then DEBATE across a transcript of 4-6 turns in which they directly respond to and challenge EACH OTHER by name, in character — a genuine argument, not three monologues.\n" +
  "3) Give a 'synthesis': 2-3 sentences stating the majority ruling and WHY each perspective landed where it did.\n" +
  "Every vote counts; the ruling is the majority (2-1 or 3-0), or DEADLOCK only if all three verdicts differ. Ground reasoning in the specifics of the pilot's decision.\n" +
  "Respond with ONLY minified JSON, no prose, no code fences:\n" +
  '{"melchior":{"verdict":"APPROVE|REJECT|CONDITIONAL","reason":"...","basis":["...","..."]},' +
  '"balthasar":{"verdict":"...","reason":"...","basis":["...","..."]},' +
  '"casper":{"verdict":"...","reason":"...","basis":["...","..."]},' +
  '"transcript":[{"who":"MELCHIOR","text":"..."},{"who":"BALTHASAR","text":"..."},{"who":"CASPER","text":"..."},{"who":"MELCHIOR","text":"..."}],' +
  '"synthesis":"..."}';

type Provider = { url: string; key: string; model: string };

function pickProvider(): Provider | null {
  const model = process.env.MAGI_MODEL;
  if (process.env.GROQ_API_KEY)
    return {
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: process.env.GROQ_API_KEY,
      model: model || "llama-3.3-70b-versatile",
    };
  if (process.env.OPENROUTER_API_KEY)
    return {
      url: "https://openrouter.ai/api/v1/chat/completions",
      key: process.env.OPENROUTER_API_KEY,
      model: model || "meta-llama/llama-3.3-70b-instruct:free",
    };
  if (process.env.OPENAI_API_KEY)
    return {
      url: "https://api.openai.com/v1/chat/completions",
      key: process.env.OPENAI_API_KEY,
      model: model || "gpt-4o-mini",
    };
  return null;
}

export async function POST(req: NextRequest) {
  let query = "";
  try {
    const body = await req.json();
    query = String(body?.query ?? "").slice(0, 2000);
  } catch {
    /* ignore */
  }
  if (!query.trim()) {
    return NextResponse.json({ error: "empty query" }, { status: 400 });
  }

  const provider = pickProvider();
  if (!provider) {
    // No key configured — client falls back to the local council.
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch(provider.url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.key}`,
      },
      body: JSON.stringify({
        model: provider.model,
        temperature: 0.85,
        max_tokens: 1100,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: query },
        ],
      }),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 200);
      return NextResponse.json(
        { configured: true, error: `provider ${res.status}`, detail },
        { status: 502 },
      );
    }
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    if (!content) {
      return NextResponse.json({ configured: true, error: "empty completion" }, { status: 502 });
    }
    return NextResponse.json({ configured: true, content }, { status: 200 });
  } catch (e) {
    const name = e instanceof Error ? e.name : "fetch failed";
    return NextResponse.json({ configured: true, error: name }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
