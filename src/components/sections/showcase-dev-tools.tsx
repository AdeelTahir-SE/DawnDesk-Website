import * as React from 'react';

export function DevToolsShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center mt-24 md:mt-32">
      <div className="order-2 md:order-1 relative h-[300px] md:h-[500px] w-full rounded-xl bg-brand-surface border border-brand-border shadow-screenshot overflow-hidden flex items-center justify-center">
        <span className="text-brand-muted-dark text-sm">[Screenshot Placeholder: Dev Tools]</span>
      </div>
      
      <div className="order-1 md:order-2">
        <div className="w-[44px] h-[44px] bg-[rgba(245,197,24,0.1)] rounded-[10px] flex items-center justify-center text-brand-yellow mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>
        <h3 className="font-display font-semibold text-[1.5rem] md:text-[2.25rem] leading-[1.2] text-brand-white tracking-[-0.02em] mb-4">
          A complete dev toolkit.
        </h3>
        <p className="text-[1rem] leading-[1.7] text-brand-muted">
          From a built-in terminal and REST client to JSON formatters and regex testers. DawnDesk ships with a comprehensive suite of utilities for developers, eliminating the need to have a dozen browser tabs open for basic tooling.
        </p>
      </div>
    </div>
  );
}
