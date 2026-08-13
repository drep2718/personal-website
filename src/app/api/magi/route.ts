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
  "You are the MAGI System of NERV: three supercomputers embodying the fractured psyche of Dr. Naoko Akagi. " +
  "MELCHIOR-1 = the Scientist (cold logic, data, first principles). " +
  "BALTHASAR-2 = the Mother (protection, risk, long-term wellbeing, caution). " +
  "CASPER-3 = the Woman (instinct, ambition, desire, bold human truth). " +
  "Given the pilot's decision, each unit renders a verdict of APPROVE, REJECT, or CONDITIONAL with ONE clipped in-character sentence. " +
  "Then they debate in two short sentences. " +
  'Respond with ONLY minified JSON, no prose, no code fences: ' +
  '{"melchior":{"verdict":"APPROVE|REJECT|CONDITIONAL","reason":"..."},' +
  '"balthasar":{"verdict":"...","reason":"..."},' +
  '"casper":{"verdict":"...","reason":"..."},"debate":"..."}';

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
