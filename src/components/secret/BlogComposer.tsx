"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Lock, Copy, Download, Check, ArrowLeft } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";

// SHA-256 of the passphrase — the plaintext is never stored in the repo.
// Override at deploy time with NEXT_PUBLIC_BLOGENTRY_SHA256 if you rotate it.
const EXPECTED_HASH =
  process.env.NEXT_PUBLIC_BLOGENTRY_SHA256 ||
  "489bbc0d333cc0fcd2353cc392df98440f0adcb4e51adbb10a4d422a50eeac92";

const CATEGORIES = ["Coffee", "Life", "Tech", "Climbing", "Books", "Photography"];
const STORAGE_KEY = "blogentry-unlocked";

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

export function BlogComposer() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  // Restore an unlocked session (survives refresh, not a new tab/session).
  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(false);
    const hash = await sha256Hex(password);
    if (hash === EXPECTED_HASH) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
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
          <h1 className="text-xl font-light text-[var(--color-text-primary)] mb-2">
            Author access
          </h1>
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
          {error && (
            <p className="mt-3 text-sm text-[var(--color-accent-red)]">Nope — try again.</p>
          )}
          <button
            type="submit"
            disabled={checking || !password}
            className="mt-6 w-full rounded-full bg-[var(--color-accent-red)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {checking ? "Checking…" : "Unlock"}
          </button>
          <Link
            href="/secret/blog"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            <ArrowLeft size={12} /> Back to the journal
          </Link>
        </form>
      </div>
    );
  }

  return <Composer />;
}

function Composer() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Coffee");
  const [date, setDate] = useState(today());
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);

  const slug = slugify(title) || "untitled";
  const filename = `${date}-${slug}.md`;

  const fileContent = useMemo(() => {
    const fm = [
      "---",
      `title: ${title || "Untitled"}`,
      `date: ${date}`,
      `category: ${category}`,
      ...(excerpt ? [`excerpt: ${excerpt}`] : []),
      "---",
      "",
      body,
      "",
    ].join("\n");
    return fm;
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
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dialing in the perfect shot"
              className="composer-input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <input
                list="blog-categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

          <Field label="Body (markdown)">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={14}
              placeholder={"## A heading\n\nWrite in **markdown**. Lists, *italics*, `code`, and [links](https://example.com) all work."}
              className="composer-input font-mono text-sm leading-relaxed resize-y"
            />
          </Field>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={download}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-red)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <Download size={14} /> Download {filename}
            </button>
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-highlight)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy markdown"}
            </button>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed pt-1">
            Save this file into <code className="text-[var(--color-text-secondary)]">content/blog/</code>,
            commit, and push. It appears on{" "}
            <Link href="/secret/blog" className="text-[var(--color-accent-red)]">/secret/blog</Link>{" "}
            once deployed.
          </p>
        </div>

        {/* Preview */}
        <div className="content-panel p-6 md:p-8 h-fit lg:sticky lg:top-24">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-5">
            Live preview
          </p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border border-[var(--color-accent-red-dim)] text-[var(--color-accent-red)]">
              {category || "Category"}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">{date}</span>
          </div>
          <h2 className="text-2xl font-light text-[var(--color-text-primary)] mb-5">
            {title || "Untitled"}
          </h2>
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
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
