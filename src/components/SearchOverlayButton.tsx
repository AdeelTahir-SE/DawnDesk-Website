"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export function SearchOverlayButton({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <button
        aria-label="Search DawnDesk"
        className={`transition ${tone === "dark" ? "hover:text-[#ffc400]" : "hover:text-[#c47800]"}`}
        onClick={() => setOpen(true)}
        type="button"
      >
        <Search size={18} />
      </button>
      {open && (
        <div className="fixed inset-x-0 top-5 z-[80] px-4">
          <form
            action="/search"
            className="mx-auto flex max-w-2xl overflow-hidden rounded-md border border-white/15 bg-[#101010] text-white shadow-[0_18px_70px_rgba(0,0,0,0.38)]"
          >
            <input
              ref={inputRef}
              className="min-w-0 flex-1 bg-transparent px-5 py-4 text-base outline-none"
              name="q"
              placeholder="Search DawnDesk..."
              type="search"
            />
            <button className="bg-[#ffc400] px-5 text-sm font-extrabold text-black" type="submit">
              Search
            </button>
            <button
              aria-label="Close search"
              className="border-l border-white/10 px-4 text-white/70 transition hover:text-white"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
