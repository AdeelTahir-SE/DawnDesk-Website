"use client";

import { useState } from "react";
import Image from "next/image";

export function PromptManagerMockup() {
  const [activeTab, setActiveTab] = useState<"local" | "hub">("local");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("local")}
          className={`btn-animated px-5 py-2.5 text-sm font-bold rounded-md transition ${activeTab === "local" ? "bg-[#ffc400] text-black shadow-sm" : "bg-black/5 text-black/60 hover:bg-black/10 border border-transparent"}`}
        >
          Local Prompts
        </button>
        <button
          onClick={() => setActiveTab("hub")}
          className={`btn-animated px-5 py-2.5 text-sm font-bold rounded-md transition ${activeTab === "hub" ? "bg-[#ffc400] text-black shadow-sm" : "bg-black/5 text-black/60 hover:bg-black/10 border border-transparent"}`}
        >
          Prompts Hub
        </button>
      </div>
      
      <div className="relative overflow-hidden rounded-xl border border-white/12 bg-[#090909] p-3 shadow-[0_0_70px_rgba(255,196,0,0.16)]">
        <Image
          alt={activeTab === "local" ? "DawnDesk prompt manager local workspace" : "DawnDesk prompt manager hub"}
          className="h-auto w-full rounded-lg border border-white/10 object-cover"
          height={667}
          src={activeTab === "local" ? "/screenshots/dawndesk-prompt-manager-local.png" : "/screenshots/dawndesk-prompt-manager-hub.png"}
          width={1186}
        />
      </div>
    </div>
  );
}
