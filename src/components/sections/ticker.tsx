export function Ticker() {
  const apps = [
    'Todo',
    'Photo Editor',
    'Project Manager',
    'Calendar',
    'Notes',
    'Email Client',
    'Chat',
    'Analytics',
    'Terminal',
  ];

  // Double the list for seamless looping
  const items = [...apps, ...apps];

  return (
    <div className="w-full overflow-hidden bg-brand-surface border-y border-brand-border py-4 relative flex items-center">
      {/* Gradient masks for smooth fade at edges */}
      <div className="absolute left-0 inset-y-0 w-16 md:w-32 bg-gradient-to-r from-brand-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 md:w-32 bg-gradient-to-l from-brand-surface to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
        {items.map((app, index) => (
          <div key={index} className="flex items-center mx-6">
            <span className="text-brand-muted-dark font-display font-medium text-lg whitespace-nowrap">{app}</span>
            <span className="text-brand-yellow ml-12 text-[10px]">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
