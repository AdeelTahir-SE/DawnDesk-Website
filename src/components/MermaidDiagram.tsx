"use client";

import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void;
      run: (options?: { nodes?: Element[] }) => Promise<void>;
    };
  }
}

let mermaidPromise: Promise<void> | null = null;

function loadMermaid() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.mermaid) {
    return Promise.resolve();
  }

  mermaidPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Mermaid."));
    document.head.appendChild(script);
  });

  return mermaidPromise;
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    loadMermaid()
      .then(async () => {
        if (!active || !window.mermaid || !ref.current) {
          return;
        }

        window.mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            primaryColor: "#fff7cf",
            primaryTextColor: "#171717",
            primaryBorderColor: "#ffc400",
            lineColor: "#8b6f00",
            secondaryColor: "#f7f3ea",
            tertiaryColor: "#ffffff",
            fontFamily: "Plus Jakarta Sans, Segoe UI, Arial, sans-serif",
          },
        });
        await window.mermaid.run({ nodes: [ref.current] });
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      });

    return () => {
      active = false;
    };
  }, [chart]);

  if (failed) {
    return (
      <pre className="overflow-x-auto rounded-md border border-black/10 bg-[#101012] p-5 text-sm leading-7 text-white">
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <div className="my-8 max-w-full overflow-x-auto rounded-md border border-[#ffc400]/35 bg-[#fff9df] p-4 sm:p-5">
      <div ref={ref} id={`mermaid-${id}`} className="mermaid min-w-full text-center [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full sm:min-w-[520px]">
        {chart}
      </div>
    </div>
  );
}
