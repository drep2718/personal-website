# Blog entries

Each `.md` file in this folder becomes a post on `/blog`.

## How to add a post

1. Easiest: go to `/secret/blogentry`, enter the passphrase, write your entry,
   and hit **Download** — it saves a correctly-formatted file. Drop it in here.
2. By hand: create a file named `YYYY-MM-DD-some-slug.md` with this shape:

```md
---
title: Your title here
date: 2026-07-26
category: Coffee
excerpt: One line that teases the post (optional).
---

Write the body in **markdown**. Headings (`##`), lists (`-`), *italics*,
`code`, and [links](https://example.com) all work.
```

3. Commit and push. The post appears automatically after deploy.

Notes:
- `category` groups posts on the listing page. Reuse the same spelling to group.
- The filename (minus `.md`) is the post's URL slug.
- This `README.md` is ignored by the blog and never rendered as a post.
