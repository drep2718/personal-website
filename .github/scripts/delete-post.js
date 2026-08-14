// Permanently removes a previously published blog post, given its slug.
// Reading the slug from an env var (not the shell) avoids injection; the
// charset is re-validated here too as defense in depth, since it's what
// stands between an untrusted payload and a filesystem path.

const fs = require("fs");
const path = require("path");

const { SLUG = "" } = process.env;

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(SLUG) || SLUG.length > 120) {
  console.log(`Refusing to delete: invalid slug "${SLUG}"`);
  process.exit(0);
}

const file = path.join(process.cwd(), "content", "blog", `${SLUG}.md`);

if (fs.existsSync(file)) {
  fs.unlinkSync(file);
  console.log(`Deleted ${path.relative(process.cwd(), file)}`);
} else {
  console.log(`Nothing to delete: ${path.relative(process.cwd(), file)} does not exist`);
}
