import * as React from 'react';

export function PhotoEditorShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center mt-24 md:mt-32">
      <div className="order-1 md:order-1">
        <div className="w-[44px] h-[44px] bg-[rgba(245,197,24,0.1)] rounded-[10px] flex items-center justify-center text-brand-yellow mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </div>
        <h3 className="font-display font-semibold text-[1.5rem] md:text-[2.25rem] leading-[1.2] text-brand-white tracking-[-0.02em] mb-4">
          Pixel-perfect edits.
        </h3>
        <p className="text-[1rem] leading-[1.7] text-brand-muted">
          A fully capable raster graphics editor built right in. Manage layers, apply non-destructive filters, and export your assets without needing to launch a heavy external suite. Fast, fluid, and powerful.
        </p>
      </div>
      
      <div className="order-2 md:order-2 relative h-[300px] md:h-[500px] w-full rounded-xl bg-brand-surface border border-brand-border shadow-screenshot overflow-hidden flex items-center justify-center">
        <span className="text-brand-muted-dark text-sm">[Screenshot Placeholder: Photo Editor]</span>
      </div>
    </div>
  );
}
