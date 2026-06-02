import { ArrowUpRight, GitBranch, GitCommit, Sparkles } from "lucide-react";
import Link from "next/link";

export type UpdateTreeItem = {
  version: string;
  date: string;
  title: string;
  summary: string;
  status: string;
  branches: {
    label: string;
    detail: string;
  }[];
};

type UpdateTreeProps = {
  updates: UpdateTreeItem[];
  preview?: boolean;
};

export function UpdateTree({ updates, preview = false }: UpdateTreeProps) {
  const visibleUpdates = preview ? updates.slice(0, 3) : updates;

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-5 top-0 hidden w-px bg-gradient-to-b from-[#ffc400] via-black/18 to-transparent sm:block" />
      <div className="space-y-8">
        {visibleUpdates.map((update, index) => (
          <article className="relative grid gap-4 sm:grid-cols-[2.75rem_1fr]" key={update.version}>
            <div className="relative z-10 hidden sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffc400]/50 bg-black text-[#ffc400] shadow-[0_0_0_8px_rgba(251,250,247,1)]">
                {index === 0 ? <Sparkles size={18} /> : <GitCommit size={18} />}
              </div>
            </div>
            <div className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded bg-black px-3 py-1 text-xs font-extrabold text-[#ffc400]">{update.version}</span>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-black/42">{update.date}</span>
                <span className="rounded bg-[#fff2bf] px-3 py-1 text-xs font-extrabold text-[#9a6b00]">{update.status}</span>
              </div>
              <h3 className="mt-4 text-2xl font-black leading-tight">{update.title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/62">{update.summary}</p>

              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                {update.branches.map((branch) => (
                  <div className="relative rounded-md border border-black/10 bg-[#fbfaf7] p-4" key={branch.label}>
                    <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-black/52">
                      <GitBranch size={15} className="text-[#d29300]" />
                      {branch.label}
                    </div>
                    <p className="text-sm leading-6 text-black/68">{branch.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {preview && updates.length > visibleUpdates.length ? (
        <div className="mt-8 sm:pl-16">
          <Link
            className="btn-animated inline-flex items-center gap-3 rounded-md bg-black px-6 py-4 text-sm font-extrabold text-white transition hover:bg-[#ffc400] hover:text-black"
            href="/updates"
          >
            See complete features history
            <ArrowUpRight size={18} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
