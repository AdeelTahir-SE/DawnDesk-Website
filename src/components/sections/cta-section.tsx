import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden flex items-center justify-center">
      {/* Glow behind CTA */}
      <div className="absolute w-[600px] h-[600px] bg-brand-yellow/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container relative z-10 mx-auto px-6 max-w-[800px] text-center">
        <h2 className="font-display font-bold text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-brand-white mb-6">
          Ready to take back your <span className="text-brand-yellow">focus?</span>
        </h2>
        <p className="text-[1.125rem] text-brand-muted mb-10 max-w-2xl mx-auto">
          Join thousands of developers and creators who have made DawnDesk their daily driver. Free for individual use, forever.
        </p>
        <Link href="/download" tabIndex={-1}>
          <Button size="lg" className="animate-yellow-pulse text-lg py-4 px-8">
            Download DawnDesk Now
          </Button>
        </Link>
      </div>
    </section>
  );
}
