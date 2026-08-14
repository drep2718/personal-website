// Turns a submitted blog entry (passed in via env vars from the workflow) into
// a markdown file under content/blog/. Reading from env vars — never the shell —
// keeps arbitrary text (quotes, $, newlines) safe.
//
// Only the body is required. Title, category, and excerpt are all optional —
// a one-line entry with no title is a valid post.

const fs = require("fs");
const path = require("path");

const {
  TITLE = "",
  CATEGORY = "",
  DATE = "",
  EXCERPT = "",
  BODY = "",
} = process.env;

const oneLine = (s) => s.replace(/\r?\n/g, " ").trim();

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const date = /^\d{4}-\d{2}-\d{2}$/.test(DATE) ? DATE : new Date().toISOString().slice(0, 10);

// No title? Base the filename on the first line of the body instead of a
// generic placeholder, so a one-liner still gets a readable slug.
const firstLineOfBody = BODY.split(/\r?\n/).find((l) => l.trim()) || "";
const baseSlug = slugify(oneLine(TITLE)) || slugify(firstLineOfBody) || "note";

const dir = path.join(process.cwd(), "content", "blog");
fs.mkdirSync(dir, { recursive: true });

// Never clobber an earlier post that landed on the same date with the same
// (possibly blank) title — walk to the next free filename instead.
let slug = baseSlug;
let file = path.join(dir, `${date}-${slug}.md`);
for (let n = 2; fs.existsSync(file); n++) {
  slug = `${baseSlug}-${n}`;
  file = path.join(dir, `${date}-${slug}.md`);
}

const frontmatter = [
  "---",
  ...(oneLine(TITLE) ? [`title: ${oneLine(TITLE)}`] : []),
  `date: ${date}`,
  `category: ${oneLine(CATEGORY) || "Uncategorized"}`,
  ...(oneLine(EXCERPT) ? [`excerpt: ${oneLine(EXCERPT)}`] : []),
  "---",
  "",
  BODY.replace(/\r\n/g, "\n").trim(),
  "",
].join("\n");

fs.writeFileSync(file, frontmatter, "utf8");
console.log(`Wrote ${path.relative(process.cwd(), file)}`);
