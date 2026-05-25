import * as React from 'react';

export function VideoEditorShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center mt-24 md:mt-32">
      <div className="order-2 md:order-1 relative h-[300px] md:h-[500px] w-full rounded-xl bg-brand-surface border border-brand-border shadow-screenshot overflow-hidden flex items-center justify-center">
        <span className="text-brand-muted-dark text-sm">[Screenshot Placeholder: Video Editor]</span>
      </div>
      
      <div className="order-1 md:order-2">
        <div className="w-[44px] h-[44px] bg-[rgba(245,197,24,0.1)] rounded-[10px] flex items-center justify-center text-brand-yellow mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>
        </div>
        <h3 className="font-display font-semibold text-[1.5rem] md:text-[2.25rem] leading-[1.2] text-brand-white tracking-[-0.02em] mb-4">
          Cut, sequence, and render.
        </h3>
        <p className="text-[1rem] leading-[1.7] text-brand-muted">
          Our lightweight video editor allows you to quickly trim clips, assemble sequences, and add basic transitions. Perfect for rapid social media content creation or quickly cutting down a meeting recording.
        </p>
      </div>
    </div>
  );
}
