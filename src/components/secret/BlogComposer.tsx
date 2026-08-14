"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Lock, Copy, Download, Check, ArrowLeft, Send, Loader2, ExternalLink, Trash2 } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/date";
import type { BlogPost } from "@/lib/blog";

// SHA-256 of the passphrase — the plaintext is never stored in the repo.
// Override at deploy time with NEXT_PUBLIC_BLOGENTRY_SHA256 if you rotate it.
// This only gates the UI; the server (/api/publish) enforces the real check.
const EXPECTED_HASH =
  process.env.NEXT_PUBLIC_BLOGENTRY_SHA256 ||
  "489bbc0d333cc0fcd2353cc392df98440f0adcb4e51adbb10a4d422a50eeac92";

const CATEGORIES = ["Coffee", "Life", "Tech", "Climbing", "Books", "Photography"];

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function BlogComposer({ posts }: { posts: BlogPost[] }) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(false);
    const hash = await sha256Hex(password);
    if (hash === EXPECTED_HASH) {
      setUnlocked(true); // password kept in memory for the publish request
    } else {
      setError(true);
      setPassword("");
    }
    setChecking(false);
  };

  if (!unlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <form onSubmit={submitPassword} className="content-panel w-full max-w-sm p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center rounded-full border border-[var(--color-border-highlight)] text-[var(--color-accent-red)]">
            <Lock size={18} />
          </div>
          <h1 className="text-xl font-light text-[var(--color-text-primary)] mb-2">Author access</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Enter the passphrase to open the composer.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            placeholder="Passphrase"
            className="w-full text-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-red)] transition-colors"
          />
          {error && <p className="mt-3 text-sm text-[var(--color-accent-red)]">Nope — try again.</p>}
          <button
            type="submit"
            disabled={checking || !password}
            className="mt-6 w-full rounded-full bg-[var(--color-accent-red)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {checking ? "Checking…" : "Unlock"}
          </button>
          <Link
            href="/blog"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            <ArrowLeft size={12} /> Back to the journal
          </Link>
        </form>
      </div>
    );
  }

  return <Composer password={password} posts={posts} />;
}

type PublishState =
  | { status: "idle" }
  | { status: "publishing" }
  | { status: "success"; actionsUrl?: string }
  | { status: "error"; message: string };

function Composer({ password, posts }: { password: string; posts: BlogPost[] }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today());
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);
  const [publish, setPublish] = useState<PublishState>({ status: "idle" });
  const [existingPosts, setExistingPosts] = useState(posts);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const firstLine = body.split(/\r?\n/).find((l) => l.trim()) || "";
  const slug = slugify(title) || slugify(firstLine) || "note";
  const filename = `${date}-${slug}.md`;

  const fileContent = useMemo(() => {
    return [
      "---",
      ...(title ? [`title: ${title}`] : []),
      `date: ${date}`,
      `category: ${category || "Uncategorized"}`,
      ...(excerpt ? [`excerpt: ${excerpt}`] : []),
      "---",
      "",
      body,
      "",
    ].join("\n");
  }, [title, date, category, excerpt, body]);

  const previewHtml = useMemo(() => renderMarkdown(body || "_Start typing to preview…_"), [body]);

  const copy = async () => {
    await navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const download = () => {
    const blob = new Blob([fileContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const publishToSite = async () => {
    if (!body.trim()) {
      setPublish({ status: "error", message: "Write something in the body first." });
      return;
    }
    setPublish({ status: "publishing" });
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, title, category, date, excerpt, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setPublish({ status: "success", actionsUrl: data.actionsUrl });
      } else {
        setPublish({ status: "error", message: data.error || `Failed (${res.status}).` });
      }
    } catch {
      setPublish({ status: "error", message: "Network error — couldn't reach the server." });
    }
  };

  const deletePost = async (post: BlogPost) => {
    const label = post.title || "this note";
    if (!window.confirm(`Delete "${label}"? Once the workflow runs, it's really gone.`)) return;
    setDeletingSlug(post.slug);
    setDeleteError(null);
    try {
      const res = await fetch("/api/publish", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, slug: post.slug }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setExistingPosts((prev) => prev.filter((p) => p.slug !== post.slug));
      } else {
        setDeleteError(data.error || `Failed (${res.status}).`);
      }
    } catch {
      setDeleteError("Network error — couldn't reach the server.");
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 md:px-8 pt-28 pb-24">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-2">
          Author · Composer
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)]">
          New entry
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-4">
          <Field label="Title (optional)">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Leave blank for a quick one-liner"
              className="composer-input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category (optional)">
              <input
                list="blog-categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Uncategorized"
                className="composer-input"
              />
              <datalist id="blog-categories">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="composer-input"
              />
            </Field>
          </div>

          <Field label="Excerpt (optional)">
            <input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="One line that teases the post"
              className="composer-input"
            />
          </Field>

          <Field label="Body — required, everything else is optional">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={14}
              placeholder={"Just write. Blank lines start new paragraphs.\n\nMarkdown works too: ## headings, - lists, **bold**, *italic*, `code`, [links](https://example.com).\n\nOr just one line and hit publish — that counts."}
              className="composer-input font-mono text-sm leading-relaxed resize-y"
            />
          </Field>

          {/* Primary: publish straight to the site */}
          <div className="pt-1">
            <button
              onClick={publishToSite}
              disabled={publish.status === "publishing"}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-red)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {publish.status === "publishing" ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Publishing…
                </>
              ) : (
                <>
                  <Send size={15} /> Publish to site
                </>
              )}
            </button>

            {publish.status === "success" && (
              <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-sm">
                <p className="text-[var(--color-text-primary)] font-medium mb-1">
                  Published — the workflow is building your post.
                </p>
                <p className="text-[var(--color-text-secondary)]">
                  It goes live in a minute or so.{" "}
                  <Link href="/blog" className="text-[var(--color-accent-red)]">
                    View the journal
                  </Link>
                  {publish.actionsUrl && (
                    <>
                      {" · "}
                      <a
                        href={publish.actionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[var(--color-accent-red)]"
                      >
                        Watch the workflow <ExternalLink size={12} />
                      </a>
                    </>
                  )}
                </p>
              </div>
            )}
            {publish.status === "error" && (
              <p className="mt-3 text-sm text-[var(--color-accent-red)]">{publish.message}</p>
            )}
          </div>

          {/* Secondary: export the file by hand */}
          <div className="pt-3 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
              Or export the file and commit it yourself:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={download}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-highlight)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <Download size={14} /> {filename}
              </button>
              <button
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-highlight)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy markdown"}
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="content-panel p-6 md:p-8 h-fit lg:sticky lg:top-24">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-5">
            Live preview
          </p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border border-[var(--color-accent-red-dim)] text-[var(--color-accent-red)]">
              {category || "Uncategorized"}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">{date}</span>
          </div>
          {title ? (
            <h2 className="text-2xl font-light text-[var(--color-text-primary)] mb-5">{title}</h2>
          ) : (
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-5">
              Note
            </p>
          )}
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>

      {/* Manage entries: everything currently live, with a real delete */}
      <div className="mt-14 pt-8 border-t border-[var(--color-border)]">
        <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-5">
          Manage entries ({existingPosts.length})
        </p>
        {deleteError && (
          <p className="mb-4 text-sm text-[var(--color-accent-red)]">{deleteError}</p>
        )}
        {existingPosts.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No entries yet.</p>
        ) : (
          <div className="space-y-2">
            {existingPosts.map((post) => (
              <div
                key={post.slug}
                className="flex items-center justify-between gap-4 content-panel px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-[var(--color-text-primary)] truncate">
                    {post.title || <span className="italic">{post.excerpt || "Note"}</span>}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {post.category} · {post.date ? formatDate(post.date) : "no date"}
                  </p>
                </div>
                <button
                  onClick={() => deletePost(post)}
                  disabled={deletingSlug === post.slug}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent-red)] transition-colors disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  {deletingSlug === post.slug ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs tracking-[0.15em] uppercase text-[var(--color-text-muted)] mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
