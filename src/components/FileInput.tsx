"use client";

import { Upload } from "lucide-react";
import { useState } from "react";

export function FileInput() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <label className={`mt-4 flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-black/20 bg-[#fbfaf7] px-4 py-5 text-sm font-bold ${fileName ? "text-black" : "text-black/65"} transition hover:border-black/40`}>
      <Upload size={20} className={fileName ? "text-[#d29300]" : ""} />
      <span className="truncate">{fileName ? fileName : "Attach screenshot or image"}</span>
      <input 
        className="sr-only" 
        name="attachment" 
        type="file" 
        accept="image/*" 
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />
    </label>
  );
}
