import * as React from 'react';

export function ProjectManagerShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
      <div className="order-2 md:order-1 relative h-[300px] md:h-[500px] w-full rounded-xl bg-brand-surface border border-brand-border shadow-screenshot overflow-hidden flex items-center justify-center">
        <span className="text-brand-muted-dark text-sm">[Screenshot Placeholder: Project Manager]</span>
      </div>
      
      <div className="order-1 md:order-2">
        <div className="w-[44px] h-[44px] bg-[rgba(245,197,24,0.1)] rounded-[10px] flex items-center justify-center text-brand-yellow mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
        </div>
        <h3 className="font-display font-semibold text-[1.5rem] md:text-[2.25rem] leading-[1.2] text-brand-white tracking-[-0.02em] mb-4">
          Master your projects.
        </h3>
        <p className="text-[1rem] leading-[1.7] text-brand-muted">
          Keep everything organized in one place. DawnDesk's Project Manager lets you break down complex work into manageable tasks, track progress in real-time, and stay ahead of deadlines without ever leaving your workflow.
        </p>
      </div>
    </div>
  );
}
