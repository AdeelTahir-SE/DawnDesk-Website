"use client";

import { useEffect, useRef, useState } from "react";

type JsonTextareaProps = {
  className?: string;
  defaultValue: string;
  minHeight?: string;
  name?: string;
  readOnly?: boolean;
  required?: boolean;
  rows?: number;
};

function highlightJson(value: string) {
  const tokenPattern = /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(?=\s*:))|("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  let lastIndex = 0;
  const nodes = [];

  for (const match of value.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(value.slice(lastIndex, index));
    }

    const tokenClass = match[1]
      ? "text-[#f7c948]"
      : match[2]
        ? "text-[#7dd3fc]"
        : match[3]
          ? "text-[#fca5a5]"
          : "text-[#c4b5fd]";

    nodes.push(
      <span className={tokenClass} key={`${index}-${token}`}>
        {token}
      </span>,
    );
    lastIndex = index + token.length;
  }

  if (lastIndex < value.length) {
    nodes.push(value.slice(lastIndex));
  }

  return nodes;
}

export function JsonTextarea({
  className = "",
  defaultValue,
  minHeight = "min-h-[420px]",
  name,
  readOnly,
  required,
  rows,
}: JsonTextareaProps) {
  const [value, setValue] = useState(defaultValue);
  const previewRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className={`relative overflow-hidden rounded-md border border-black/15 bg-[#101012] shadow-inner ${minHeight} ${className}`}>
      <pre
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words p-4 font-mono text-xs leading-6 text-[#e8e8ea]"
        ref={previewRef}
      >
        <code>{highlightJson(value)}</code>
      </pre>
      <textarea
        className="absolute inset-0 z-10 block h-full w-full resize-y overflow-auto bg-transparent p-4 font-mono text-xs leading-6 text-transparent caret-white outline-none selection:bg-[#ffc400]/35"
        name={name}
        rows={rows}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onScroll={(event) => {
          if (!previewRef.current) return;
          previewRef.current.scrollTop = event.currentTarget.scrollTop;
          previewRef.current.scrollLeft = event.currentTarget.scrollLeft;
        }}
        readOnly={readOnly}
        spellCheck={false}
        required={required}
      />
    </div>
  );
}
