'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import type { Platform } from '@/types';

// In a real implementation, we'd fetch stats from the server in a Server Component wrapper,
// but for the sake of simplicity and immediate UI, we mock them here.
const mockedStats = {
  windows: 42310,
  mac: 28400,
  linux: 12050,
};

const platforms = [
  { id: 'windows' as Platform, name: 'Windows', icon: '⊞', version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0' },
  { id: 'mac' as Platform, name: 'macOS', icon: '', version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0' },
  { id: 'linux' as Platform, name: 'Linux', icon: '🐧', version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0' },
];

export default function DownloadPage() {
  const [detectedOs, setDetectedOs] = React.useState<Platform | null>(null);

  React.useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) setDetectedOs('windows');
    else if (userAgent.includes('mac')) setDetectedOs('mac');
    else if (userAgent.includes('linux')) setDetectedOs('linux');
  }, []);

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 container mx-auto px-6 max-w-[1280px]">
      <div className="text-center mb-16">
        <h1 className="font-display font-bold text-brand-white text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] mb-4">
          Get <span className="text-brand-yellow">DawnDesk</span>
        </h1>
        <p className="text-[1.125rem] text-brand-muted max-w-2xl mx-auto">
          Experience the ultimate desktop productivity suite. Free forever for individuals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {platforms.map((platform) => {
          const isDetected = detectedOs === platform.id;
          return (
            <Card key={platform.id} className={isDetected ? "border-brand-yellow/50 shadow-yellow-glow" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-brand-surface-2 rounded-xl flex items-center justify-center text-2xl mb-4">
                    {platform.icon}
                  </div>
                  {isDetected && <Badge variant="accent">RECOMMENDED</Badge>}
                </div>
                <CardTitle>{platform.name}</CardTitle>
                <CardDescription>
                  For {platform.name} 64-bit systems.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm text-brand-muted mb-2">
                  <span className="font-mono">v{platform.version}</span>
                  <span>•</span>
                  <span>{mockedStats[platform.id].toLocaleString()} downloads</span>
                </div>
              </CardContent>
              <CardFooter>
                <a href={`/api/download?platform=${platform.id}`} className="w-full">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </a>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
