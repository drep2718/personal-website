# One-click blog publishing — setup

The "Publish to site" button on `/secret/blogentry` posts to the server route
`/api/publish`, which verifies your passphrase and fires a `repository_dispatch`
event. The `publish-blog.yml` workflow catches it, writes a markdown file into
`content/blog/`, and commits it — which triggers a Vercel redeploy.

Everything is already coded. You just need to give the server two secrets. This
is a one-time, ~5 minute setup.

## 1. Create a GitHub token

Create a **fine-grained personal access token**
(GitHub → Settings → Developer settings → Fine-grained tokens → Generate new):

- **Resource owner:** your account (`drep2718`)
- **Repository access:** Only select repositories → `personal-website`
- **Permissions → Repository → Contents:** **Read and write**
- Generate and copy the token (starts with `github_pat_…`).

(A classic token with the `repo` scope also works, but fine-grained is safer.)

## 2. Add two environment variables in Vercel

Vercel → your project → **Settings → Environment Variables** (Production):

| Name | Value |
| --- | --- |
| `GITHUB_DISPATCH_TOKEN` | the token from step 1 |
| `BLOG_PUBLISH_PASSWORD` | your passphrase (e.g. `DREP`) |

Optional: `BLOG_REPO` (defaults to `drep2718/personal-website`).

> The passphrase you type in the composer must match `BLOG_PUBLISH_PASSWORD`.
> If you change it to something stronger than `DREP` (recommended — see below),
> also update the UI gate hash: set `NEXT_PUBLIC_BLOGENTRY_SHA256` to the
> SHA-256 of the new passphrase (`printf '%s' 'YOURPHRASE' | shasum -a 256`).

## 3. Allow the workflow to push

GitHub → repo → **Settings → Actions → General → Workflow permissions** →
select **Read and write permissions** → Save. (The workflow also declares
`permissions: contents: write`, but this repo setting must not forbid it.)

## 4. Redeploy

Push these changes (or hit **Redeploy** in Vercel) so the new `/api/publish`
route ships. Then open `/secret/blogentry`, write a post, and click
**Publish to site**. Watch it under the repo's **Actions** tab; the post
appears on `/secret/blog` right after the redeploy finishes.

---

## Security notes — please read

- The passphrase is checked **server-side** in `/api/publish`, so it's a real
  gate, not just a client-side hide. The GitHub token lives only in Vercel's
  server env — it is never sent to the browser.
- **`DREP` is weak.** Because the publish endpoint is public, a short passphrase
  can be brute-forced. Use a long, random `BLOG_PUBLISH_PASSWORD` in Vercel and
  update `NEXT_PUBLIC_BLOGENTRY_SHA256` to match. Worst case even if guessed:
  someone can only create blog posts, and every post is a visible git commit you
  can revert.
- Until the two env vars are set, the button reports "not configured" and the
  Download / Copy fallback still works.
