/**
 * Renders admin-authored guide body text to HTML for display.
 * Escapes raw HTML in user text; supports markdown-like markers and safe links.
 */

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function attrEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function safeHref(url: string): string | null {
  const u = url.trim();
  if (!u) return null;
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  if (/^https?:\/\//i.test(u)) return u;
  if (/^mailto:/i.test(u)) return u;
  return null;
}

const LINK_PH = "\uE000";
const LINK_END = "\uE001";

function extractLinks(raw: string): { text: string; inserts: string[] } {
  const inserts: string[] = [];
  const text = raw.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (full, label: string, urlRaw: string) => {
    const href = safeHref(urlRaw);
    if (!href) return full;
    const idx = inserts.length;
    inserts.push(
      `<a href="${attrEscape(href)}" class="text-primary underline-offset-2 hover:underline" rel="noopener noreferrer">${escapeHtml(label)}</a>`
    );
    return `${LINK_PH}${idx}${LINK_END}`;
  });
  return { text, inserts };
}

function restoreLinks(escaped: string, inserts: string[]): string {
  return escaped.replace(
    new RegExp(`${LINK_PH}(\\d+)${LINK_END}`, "g"),
    (_, i: string) => inserts[Number(i)] ?? ""
  );
}

function formatInline(raw: string): string {
  const { text: withPh, inserts } = extractLinks(raw);
  let s = escapeHtml(withPh);
  s = restoreLinks(s, inserts);

  s = s.replace(/\(\(font:(serif|mono|wide)\)\)([\s\S]*?)\(\(\/font\)\)/g, (_, kind: string, inner: string) => {
    const cls =
      kind === "serif"
        ? "guide-ff guide-ff-serif font-serif"
        : kind === "mono"
          ? "guide-ff guide-ff-mono font-mono text-[0.95em]"
          : "guide-ff guide-ff-wide tracking-wide";
    return `<span class="${cls}">${formatInline(inner)}</span>`;
  });

  s = s.replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>");

  s = s.replace(/_([\s\S]+?)_/g, "<em>$1</em>");

  s = s.replace(/~~([\s\S]+?)~~/g, '<del class="opacity-80">$1</del>');

  s = s.replace(/\+\+([\s\S]+?)\+\+/g, '<u class="decoration-primary/60 underline">$1</u>');

  return s;
}

type ListLine = { level: number; marker: string; text: string };

function parseBulletLines(block: string): ListLine[] | null {
  const lines = block.split("\n");
  const out: ListLine[] = [];
  for (const line of lines) {
    const m = line.match(/^(\s*)([-*+])\s+(.*)$/);
    if (!m) return null;
    const indent = m[1].replace(/\t/g, "  ").length;
    const level = Math.floor(indent / 2);
    out.push({ level, marker: m[2], text: m[3] });
  }
  return out.length ? out : null;
}

function parseOrderedLines(block: string): ListLine[] | null {
  const lines = block.split("\n");
  const out: ListLine[] = [];
  for (const line of lines) {
    const m = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (!m) return null;
    const indent = m[1].replace(/\t/g, "  ").length;
    const level = Math.floor(indent / 2);
    out.push({ level, marker: m[2], text: m[3] });
  }
  return out.length ? out : null;
}

function listClassForBulletMarker(marker: string): string {
  switch (marker) {
    case "*":
      return "guide-ul list-[circle] pl-6 space-y-1 marker:text-foreground";
    case "+":
      return "guide-ul list-[square] pl-6 space-y-1 marker:text-muted";
    default:
      return "guide-ul list-disc pl-6 space-y-1";
  }
}

function renderListTree(
  lines: ListLine[],
  pos: number,
  minLevel: number,
  ordered: boolean
): [string, number] {
  const marker = lines[pos]?.marker ?? "-";
  const listClass = ordered
    ? "guide-ol list-decimal pl-6 space-y-1 marker:text-foreground"
    : listClassForBulletMarker(marker);
  const tag = ordered ? "ol" : "ul";
  let html = `<${tag} class="${listClass}">`;
  while (pos < lines.length && lines[pos].level === minLevel) {
    html += "<li>";
    html += formatInline(lines[pos].text);
    pos++;
    if (pos < lines.length && lines[pos].level > minLevel) {
      const [inner, nextPos] = renderListTree(lines, pos, minLevel + 1, ordered);
      html += inner;
      pos = nextPos;
    }
    html += "</li>";
  }
  html += `</${tag}>`;
  return [html, pos];
}

function renderBlock(rawBlock: string): string {
  const t = rawBlock.trim();
  if (!t) {
    return '<div class="guide-spacer h-4" aria-hidden="true"></div>';
  }
  if (/^(---|\*\*\*|___)\s*$/.test(t)) {
    return '<hr class="my-6 border-border" />';
  }
  if (t.startsWith("## ") && !t.startsWith("### ")) {
    return `<h2 class="mt-8 mb-3 text-lg font-semibold">${formatInline(t.slice(3).trim())}</h2>`;
  }
  if (t.startsWith("### ")) {
    return `<h3 class="mt-6 mb-2 font-semibold">${formatInline(t.slice(4).trim())}</h3>`;
  }

  const bullets = parseBulletLines(t);
  if (bullets) {
    const [tree] = renderListTree(bullets, 0, bullets[0].level, false);
    return `<div class="mt-3">${tree}</div>`;
  }

  const ordered = parseOrderedLines(t);
  if (ordered) {
    const [tree] = renderListTree(ordered, 0, ordered[0].level, true);
    return `<div class="mt-3">${tree}</div>`;
  }

  const body = formatInline(t).replace(/\n/g, "<br/>");
  return `<p class="mt-3 first:mt-0 leading-relaxed">${body}</p>`;
}

export function renderGuideContent(raw: string): string {
  const blocks = raw.split(/\n{2,}/);
  return blocks.map(renderBlock).join("");
}
