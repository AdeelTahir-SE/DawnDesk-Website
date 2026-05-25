import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function FeaturesPage() {
  const features = [
    { title: 'Project Manager', description: 'Break down complex work into manageable tasks, track progress in real-time, and stay ahead of deadlines without ever leaving your workflow.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg> },
    { title: 'Photo Editor', description: 'A fully capable raster graphics editor with layers, filters, and non-destructive editing tools right at your fingertips.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> },
    { title: 'Calendar & Scheduling', description: 'Unify your schedule with seamless integration to major providers. Quickly block time for tasks and review your day.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    { title: 'Notes & Markdown', description: 'Jot down ideas, write documentation, and link your thoughts with a blazingly fast markdown editor.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    { title: 'Email Client', description: 'Triage your inbox with keyboard shortcuts, snooze emails, and respond faster than ever.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> },
    { title: 'Terminal Integration', description: 'Built-in terminal access so developers never have to leave the application to run their scripts.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg> },
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

      <HoverEffect items={features} />
    </div>
  );
}
