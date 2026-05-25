export default function FeaturesPage() {
  const features = [
    { title: 'Project Manager', description: 'Break down complex work into manageable tasks, track progress in real-time, and stay ahead of deadlines without ever leaving your workflow.' },
    { title: 'Photo Editor', description: 'A fully capable raster graphics editor with layers, filters, and non-destructive editing tools right at your fingertips.' },
    { title: 'Calendar & Scheduling', description: 'Unify your schedule with seamless integration to major providers. Quickly block time for tasks and review your day.' },
    { title: 'Notes & Markdown', description: 'Jot down ideas, write documentation, and link your thoughts with a blazingly fast markdown editor.' },
    { title: 'Email Client', description: 'Triage your inbox with keyboard shortcuts, snooze emails, and respond faster than ever.' },
    { title: 'Terminal Integration', description: 'Built-in terminal access so developers never have to leave the application to run their scripts.' },
  ];

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 container mx-auto px-6 max-w-[1280px]">
      <div className="text-center mb-16 md:mb-24">
        <h1 className="font-display font-bold text-brand-white text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] mb-4">
          All your tools. <span className="text-brand-yellow">One interface.</span>
        </h1>
        <p className="text-[1.125rem] text-brand-muted max-w-2xl mx-auto">
          DawnDesk replaces your scattered web apps with a single, highly-optimized desktop environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div key={i} className="bg-brand-surface border border-brand-border rounded-[12px] p-[28px] hover:border-brand-yellow/40 transition-colors">
            <div className="w-[44px] h-[44px] bg-[rgba(245,197,24,0.1)] rounded-[10px] flex items-center justify-center text-brand-yellow mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <h3 className="font-display font-semibold text-[1.25rem] leading-[1.3] text-brand-white tracking-tight mb-3">
              {feature.title}
            </h3>
            <p className="text-[1rem] leading-[1.7] text-brand-muted">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
