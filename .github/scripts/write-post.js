// Turns a submitted blog entry (passed in via env vars from the workflow) into
// a markdown file under content/blog/. Reading from env vars — never the shell —
// keeps arbitrary text (quotes, $, newlines) safe.

const fs = require("fs");
const path = require("path");

const {
  TITLE = "Untitled",
  CATEGORY = "Uncategorized",
  DATE = "",
  EXCERPT = "",
  BODY = "",
} = process.env;

const oneLine = (s) => s.replace(/\r?\n/g, " ").trim();

const date = /^\d{4}-\d{2}-\d{2}$/.test(DATE) ? DATE : new Date().toISOString().slice(0, 10);

const slug =
  oneLine(TITLE)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "untitled";

const dir = path.join(process.cwd(), "content", "blog");
fs.mkdirSync(dir, { recursive: true });

const frontmatter = [
  "---",
  `title: ${oneLine(TITLE) || "Untitled"}`,
  `date: ${date}`,
  `category: ${oneLine(CATEGORY) || "Uncategorized"}`,
  ...(oneLine(EXCERPT) ? [`excerpt: ${oneLine(EXCERPT)}`] : []),
  "---",
  "",
  BODY.replace(/\r\n/g, "\n").trim(),
  "",
].join("\n");

const file = path.join(dir, `${date}-${slug}.md`);
fs.writeFileSync(file, frontmatter, "utf8");
console.log(`Wrote ${path.relative(process.cwd(), file)}`);
