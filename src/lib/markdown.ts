// Tiny, dependency-free markdown renderer for blog bodies.
// The content is author-written and committed to the repo, but we still escape
// HTML first so a stray "<" never renders as markup. Supports a pragmatic
// subset: #/##/### headings, - lists, **bold**, *italic*, `code`, [links](url).

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  let t = escapeHtml(s);
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, txt, url) => {
    const safe = /^(https?:\/\/|\/)/.test(url) ? url : "#";
    const external = /^https?:\/\//.test(safe);
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${safe}"${attrs}>${txt}</a>`;
  });
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  return t;
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let para: string[] = [];
  let inList = false;

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushPara();
      flushList();
      const level = heading[1].length + 1; // # -> h2, ## -> h3, ### -> h4
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }
    const listItem = line.match(/^[-*]\s+(.*)$/);
    if (listItem) {
      flushPara();
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(listItem[1])}</li>`);
      continue;
    }
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return out.join("\n");
}
