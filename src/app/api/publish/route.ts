import { NextResponse } from "next/server";

// This runs on the server only. The GitHub token and the real passphrase live
// in server-side env vars (set them in Vercel) and are never sent to the client.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PublishBody {
  password?: string;
  title?: string;
  category?: string;
  date?: string;
  excerpt?: string;
  body?: string;
}

export async function POST(req: Request) {
  const expected = process.env.BLOG_PUBLISH_PASSWORD;
  const token = process.env.GITHUB_DISPATCH_TOKEN;
  const repo = process.env.BLOG_REPO || "drep2718/personal-website";

  if (!expected || !token) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Publishing isn't configured on the server yet. Set BLOG_PUBLISH_PASSWORD and GITHUB_DISPATCH_TOKEN in Vercel. (You can still use Download / Copy below.)",
      },
      { status: 503 }
    );
  }

  let data: PublishBody;
  try {
    data = (await req.json()) as PublishBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // Enforce the passphrase server-side — this is the real gate.
  if (typeof data.password !== "string" || data.password !== expected) {
    // Small delay to blunt brute-forcing.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "Wrong passphrase." }, { status: 401 });
  }

  const title = (data.title || "").trim();
  const body = (data.body || "").trim();
  if (!body) {
    return NextResponse.json({ ok: false, error: "The body can't be empty." }, { status: 400 });
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: "new-blog-post",
      client_payload: {
        title,
        category: (data.category || "Uncategorized").trim(),
        date: (data.date || "").trim(),
        excerpt: (data.excerpt || "").trim(),
        body,
      },
    }),
  });

  if (res.status === 204) {
    return NextResponse.json({
      ok: true,
      actionsUrl: `https://github.com/${repo}/actions`,
    });
  }

  const detail = await res.text().catch(() => "");
  return NextResponse.json(
    {
      ok: false,
      error: `GitHub rejected the request (${res.status}). Check the token's permissions. ${detail.slice(0, 160)}`,
    },
    { status: 502 }
  );
}

interface DeleteBody {
  password?: string;
  slug?: string;
}

// A post's slug is its filename without ".md" (e.g. "2026-07-20-dialing-in-the-perfect-shot"),
// so this charset is all that's ever legitimate — anything else is rejected outright.
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function DELETE(req: Request) {
  const expected = process.env.BLOG_PUBLISH_PASSWORD;
  const token = process.env.GITHUB_DISPATCH_TOKEN;
  const repo = process.env.BLOG_REPO || "drep2718/personal-website";

  if (!expected || !token) {
    return NextResponse.json(
      { ok: false, error: "Publishing isn't configured on the server yet." },
      { status: 503 }
    );
  }

  let data: DeleteBody;
  try {
    data = (await req.json()) as DeleteBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (typeof data.password !== "string" || data.password !== expected) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "Wrong passphrase." }, { status: 401 });
  }

  const slug = (data.slug || "").trim();
  if (!slug || slug.length > 120 || !SLUG_RE.test(slug)) {
    return NextResponse.json({ ok: false, error: "Invalid entry." }, { status: 400 });
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: "delete-blog-post",
      client_payload: { slug },
    }),
  });

  if (res.status === 204) {
    return NextResponse.json({
      ok: true,
      actionsUrl: `https://github.com/${repo}/actions`,
    });
  }

  const detail = await res.text().catch(() => "");
  return NextResponse.json(
    {
      ok: false,
      error: `GitHub rejected the request (${res.status}). Check the token's permissions. ${detail.slice(0, 160)}`,
    },
    { status: 502 }
  );
}
