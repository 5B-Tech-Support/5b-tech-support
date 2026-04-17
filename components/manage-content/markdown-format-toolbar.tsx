"use client";

import type { RefObject } from "react";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (next: string) => void;
};

function focusSelect(
  textarea: HTMLTextAreaElement,
  start: number,
  end: number
) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, end);
    });
  });
}

function wrapSelection(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (next: string) => void,
  open: string,
  close: string,
  emptyDefault = ""
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const sel = value.slice(start, end) || emptyDefault;
  const next = value.slice(0, start) + open + sel + close + value.slice(end);
  onChange(next);
  const innerStart = start + open.length;
  const innerEnd = innerStart + sel.length;
  focusSelect(textarea, innerStart, innerEnd);
}

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (next: string) => void,
  insert: string,
  selectInserted = false
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const next = value.slice(0, start) + insert + value.slice(end);
  onChange(next);
  const pos = start + insert.length;
  focusSelect(textarea, selectInserted ? start : pos, selectInserted ? pos : pos);
}

function eachLineInRange(
  value: string,
  start: number,
  end: number,
  fn: (line: string) => string
): { next: string } {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEndIdx = value.indexOf("\n", end);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n");
  const out = lines.map((line) => fn(line)).join("\n");
  const next = value.slice(0, lineStart) + out + value.slice(lineEnd);
  return { next };
}

function indentLines(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (next: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEndIdx = value.indexOf("\n", end);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  const block = value.slice(lineStart, lineEnd);
  const first = block.split("\n")[0] ?? "";
  const addStart = first.length > 0 ? 2 : 0;
  const { next } = eachLineInRange(value, start, end, (line) =>
    line.length ? `  ${line}` : line
  );
  const delta = next.length - value.length;
  onChange(next);
  focusSelect(textarea, start + addStart, end + delta);
}

function outdentLines(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (next: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEndIdx = value.indexOf("\n", end);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n");
  const first = lines[0] ?? "";
  let subStart = 0;
  if (first.startsWith("  ")) subStart = 2;
  else if (first.startsWith("\t")) subStart = 1;
  const { next } = eachLineInRange(value, start, end, (line) => {
    if (line.startsWith("  ")) return line.slice(2);
    if (line.startsWith("\t")) return line.slice(1);
    return line;
  });
  const delta = next.length - value.length;
  onChange(next);
  focusSelect(textarea, Math.max(lineStart, start - subStart), end + delta);
}

function prefixLines(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (next: string) => void,
  prefix: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEndIdx = value.indexOf("\n", end);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n");
  const first = lines[0] ?? "";
  const addStart = first.trim() ? prefix.length : 0;
  const { next } = eachLineInRange(value, start, end, (line) =>
    line.trim() ? `${prefix}${line}` : line
  );
  const delta = next.length - value.length;
  onChange(next);
  focusSelect(textarea, start + addStart, end + delta);
}

function insertExtraSpacing(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (next: string) => void
) {
  insertAtCursor(textarea, value, onChange, "\n\n", false);
}

function insertLink(textarea: HTMLTextAreaElement, value: string, onChange: (next: string) => void) {
  const url = window.prompt("Link URL (https://, mailto:, or path starting with /)", "https://");
  if (url === null) return;
  const label =
    window.prompt("Link text (leave empty to use URL)", "")?.trim() ||
    url.replace(/^https?:\/\//i, "");
  const md = `[${label}](${url})`;
  insertAtCursor(textarea, value, onChange, md, false);
}

const btn =
  "rounded-lg border border-border bg-surface/80 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-surface hover:border-primary/40";

const group = "flex flex-wrap items-center gap-1";

export function MarkdownFormatToolbar({ textareaRef, value, onChange }: Props) {
  function run(fn: (t: HTMLTextAreaElement, v: string, o: (n: string) => void) => void) {
    const el = textareaRef.current;
    if (!el) return;
    fn(el, value, onChange);
  }

  return (
    <div className="mt-2 space-y-2 rounded-xl border border-border bg-surface/40 p-2">
      <p className="px-1 text-xs text-muted">
        Formatting inserts markers that match the live guide. Use blank lines between paragraphs.
      </p>
      <div className={group}>
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
          Text
        </span>
        <button type="button" className={btn} onClick={() => run((t, v, o) => wrapSelection(t, v, o, "**", "**", "bold"))}>
          Bold
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => wrapSelection(t, v, o, "_", "_", "italic"))}>
          Italic
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => wrapSelection(t, v, o, "~~", "~~", "strikethrough"))}>
          Strike
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => wrapSelection(t, v, o, "++", "++", "underline"))}>
          Underline
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => insertLink(t, v, o))}>
          Link
        </button>
      </div>
      <div className={group}>
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
          Font
        </span>
        <button
          type="button"
          className={btn}
          title="Serif"
          onClick={() =>
            run((t, v, o) => wrapSelection(t, v, o, "((font:serif))", "((/font))", "serif text"))
          }
        >
          Serif
        </button>
        <button
          type="button"
          className={btn}
          title="Monospace"
          onClick={() =>
            run((t, v, o) => wrapSelection(t, v, o, "((font:mono))", "((/font))", "code style"))
          }
        >
          Mono
        </button>
        <button
          type="button"
          className={btn}
          title="Wide tracking"
          onClick={() =>
            run((t, v, o) => wrapSelection(t, v, o, "((font:wide))", "((/font))", "spaced"))
          }
        >
          Wide
        </button>
      </div>
      <div className={group}>
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
          Structure
        </span>
        <button type="button" className={btn} onClick={() => run((t, v, o) => insertAtCursor(t, v, o, "## ", false))}>
          H2
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => insertAtCursor(t, v, o, "### ", false))}>
          H3
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => prefixLines(t, v, o, "- "))}>
          • List −
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => prefixLines(t, v, o, "* "))}>
          • List ○
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => prefixLines(t, v, o, "+ "))}>
          • List ▪
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => prefixLines(t, v, o, "1. "))}>
          1. List
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => indentLines(t, v, o))}>
          Indent
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => outdentLines(t, v, o))}>
          Outdent
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => insertExtraSpacing(t, v, o))}>
          Extra gap
        </button>
        <button type="button" className={btn} onClick={() => run((t, v, o) => insertAtCursor(t, v, o, "\n\n---\n\n", false))}>
          Divider
        </button>
      </div>
    </div>
  );
}
