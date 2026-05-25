import * as React from 'react';

export function TodoShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center mt-24 md:mt-32">
      <div className="order-1 md:order-1">
        <div className="w-[44px] h-[44px] bg-[rgba(245,197,24,0.1)] rounded-[10px] flex items-center justify-center text-brand-yellow mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <h3 className="font-display font-semibold text-[1.5rem] md:text-[2.25rem] leading-[1.2] text-brand-white tracking-[-0.02em] mb-4">
          Clear your mind.
        </h3>
        <p className="text-[1rem] leading-[1.7] text-brand-muted">
          Capture tasks as soon as they come to you. The global shortcut (Cmd/Ctrl + Shift + D) summons the quick-add window from anywhere. Organize with tags, set due dates, and experience the satisfaction of checking things off.
        </p>
      </div>
      
      <div className="order-2 md:order-2 relative h-[300px] md:h-[500px] w-full rounded-xl bg-brand-surface border border-brand-border shadow-screenshot overflow-hidden flex items-center justify-center">
        <span className="text-brand-muted-dark text-sm">[Screenshot Placeholder: Todo App]</span>
      </div>
    </div>
  );
}
