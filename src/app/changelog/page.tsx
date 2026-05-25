import { Badge } from "@/components/ui/badge";

export default function ChangelogPage() {
  const releases = [
    {
      version: '1.0.0',
      date: 'June 1, 2025',
      title: 'The Foundation',
      notes: [
        'Initial release of DawnDesk Desktop Client.',
        'Integrated Project Manager, Todo, and Notes applications.',
        'Added native OS notifications for macOS and Windows.',
        'Implemented global quick-add shortcut (Cmd/Ctrl + Shift + D).',
      ],
    },
    {
      version: '0.9.5',
      date: 'May 15, 2025',
      title: 'Beta Polish',
      notes: [
        'Massive performance improvements to the rendering engine.',
        'Fixed an issue where the calendar would not sync with Google Calendar.',
        'Added "Darker" and "High Contrast" themes.',
      ],
    },
  ];

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 container mx-auto px-6 max-w-[800px]">
      <div className="mb-16">
        <h1 className="font-display font-bold text-brand-white text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] mb-4">
          Changelog
        </h1>
        <p className="text-[1.125rem] text-brand-muted">
          Track updates, improvements, and fixes to DawnDesk.
        </p>
      </div>

      <div className="space-y-16">
        {releases.map((release, i) => (
          <div key={i} className="relative pl-8 md:pl-0">
            {/* Timeline line for mobile */}
            <div className="absolute left-0 top-2 bottom-0 w-px bg-brand-border md:hidden" />
            
            <div className="flex flex-col md:flex-row md:items-baseline mb-4 md:space-x-4">
              <div className="md:w-32 flex-shrink-0 mb-2 md:mb-0">
                <Badge variant={i === 0 ? "accent" : "neutral"}>v{release.version}</Badge>
              </div>
              <div className="flex-1">
                <h2 className="font-display font-semibold text-2xl text-brand-white">
                  {release.title}
                </h2>
                <div className="text-sm text-brand-muted mt-1">{release.date}</div>
              </div>
            </div>

            <div className="md:pl-[144px]">
              <ul className="list-disc space-y-2 text-brand-muted pl-5 marker:text-brand-yellow">
                {release.notes.map((note, j) => (
                  <li key={j}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
