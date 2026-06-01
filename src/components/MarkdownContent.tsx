import type { ReactNode } from "react";
import { MermaidDiagram } from "./MermaidDiagram";

type MarkdownBlock =
  | { type: "code"; language: string; value: string }
  | { type: "heading"; depth: 2 | 3; id: string; value: string }
  | { type: "image"; alt: string; src: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "paragraph"; value: string };

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim().toLowerCase();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      blocks.push({ type: "code", language, value: code.join("\n") });
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      const value = line.slice(4).trim();
      blocks.push({ type: "heading", depth: 3, id: slugifyHeading(value), value });
      index += 1;
      continue;
    }

    const imageMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line.trim());
    if (imageMatch) {
      blocks.push({ type: "image", alt: imageMatch[1], src: imageMatch[2].trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      const value = line.slice(3).trim();
      blocks.push({ type: "heading", depth: 2, id: slugifyHeading(value), value });
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^[-*]\s+/, "").trim());
        index += 1;
      }
      blocks.push({ type: "list", ordered: false, items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, "").trim());
        index += 1;
      }
      blocks.push({ type: "list", ordered: true, items });
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith("```") &&
      !lines[index].startsWith("## ") &&
      !lines[index].startsWith("### ") &&
      !/^!\[[^\]]*\]\([^)]+\)$/.test(lines[index].trim()) &&
      !/^[-*]\s+/.test(lines[index]) &&
      !/^\d+\.\s+/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", value: paragraph.join(" ") });
  }

  return blocks;
}

export function getMarkdownHeadings(markdown: string) {
  return parseMarkdown(markdown)
    .filter((block): block is Extract<MarkdownBlock, { type: "heading" }> => block.type === "heading")
    .map((heading) => ({ id: heading.id, title: heading.value, depth: heading.depth }));
}

function slugifyHeading(value: string) {
  return value
    .replace(/[`*_]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const value = match[0];
    if (value.startsWith("`")) {
      nodes.push(<code className="rounded bg-black/5 px-1.5 py-0.5 text-[0.92em] font-bold text-[#9a6500]" key={`${value}-${match.index}`}>{value.slice(1, -1)}</code>);
    } else if (value.startsWith("**")) {
      nodes.push(<strong className="font-black text-black" key={`${value}-${match.index}`}>{value.slice(2, -2)}</strong>);
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(value);
      if (linkMatch) {
        nodes.push(
          <a className="font-extrabold text-[#9a6500] underline decoration-[#ffc400]/60 underline-offset-4 hover:text-black" href={linkMatch[2]} key={`${value}-${match.index}`}>
            {linkMatch[1]}
          </a>,
        );
      }
    }
    lastIndex = match.index + value.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function MarkdownContent({ content }: { content: string }) {
  const blocks = parseMarkdown(content);

  return (
    <div className="markdown-content">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Heading = block.depth === 2 ? "h2" : "h3";
          return <Heading id={block.id} className={block.depth === 2 ? "scroll-mt-28 mt-10 text-3xl font-black tracking-normal text-black first:mt-0" : "scroll-mt-28 mt-8 text-2xl font-black tracking-normal text-black"} key={index}>{renderInline(block.value)}</Heading>;
        }

        if (block.type === "paragraph") {
          return <p className="mt-5 text-lg leading-9 text-black/72" key={index}>{renderInline(block.value)}</p>;
        }

        if (block.type === "image") {
          return (
            <figure className="mt-8 overflow-hidden rounded-xl border border-black/10 bg-[#fbfaf7] shadow-sm" key={index}>
              <img className="h-auto w-full object-cover" src={block.src} alt={block.alt} loading="lazy" decoding="async" />
              {block.alt && <figcaption className="border-t border-black/10 px-5 py-3 text-sm font-bold text-black/52">{block.alt}</figcaption>}
            </figure>
          );
        }

        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List className={`mt-5 space-y-3 text-base leading-8 text-black/72 ${block.ordered ? "list-decimal pl-6" : "list-disc pl-6"}`} key={index}>
              {block.items.map((item) => <li key={item}>{renderInline(item)}</li>)}
            </List>
          );
        }

        if (block.language === "mermaid") {
          return <MermaidDiagram chart={block.value} key={index} />;
        }

        return (
          <pre className="mt-6 overflow-x-auto rounded-md border border-black/10 bg-[#101012] p-5 text-sm leading-7 text-white" key={index}>
            <code>{block.value}</code>
          </pre>
        );
      })}
    </div>
  );
}
