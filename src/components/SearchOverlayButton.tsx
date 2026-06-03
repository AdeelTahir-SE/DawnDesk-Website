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
        <div className="fixed inset-x-0 top-20 z-[80] px-4">
          <button
            aria-label="Close search backdrop"
            className="fixed inset-0 -z-10 cursor-default bg-black/35 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            type="button"
          />
          <form
            action="/search"
            className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-2xl border border-white/15 bg-[#101010]/95 p-3 text-white shadow-[0_24px_90px_rgba(0,0,0,0.55)] ring-1 ring-[#ffc400]/10"
          >
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/45 px-4 py-3">
              <Search className="shrink-0 text-[#ffc400]" size={19} />
              <input
                ref={inputRef}
                className="min-w-0 flex-1 bg-transparent text-base text-white !outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-white/38"
                name="q"
                placeholder="Search pages, docs, blogs, downloads..."
                style={{ outline: "none", boxShadow: "none" }}
                type="text"
              />
            </label>
            <button className="btn-animated rounded-xl bg-[#ffc400] px-6 py-3 text-sm font-extrabold text-black" type="submit">
              Search
            </button>
            <button
              aria-label="Close search"
              className="btn-animated flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/70 transition hover:border-[#ffc400]/60 hover:text-white"
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
