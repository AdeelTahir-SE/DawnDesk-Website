'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

export function HeroSection() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <section className="relative pt-[128px] pb-[64px] md:pt-[192px] md:pb-[96px] overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(245, 197, 24, 0.8)"
      />
      {/* Radial Gradient Halo */}
      <div 
        className="absolute top-0 inset-x-0 h-full w-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 900px 600px at 50% 0%, rgba(245, 197, 24, 0.06) 0%, transparent 70%), #0A0A0A'
        }}
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1280px] relative z-10 text-center">
        <motion.div 
          className="max-w-[900px] mx-auto flex flex-col items-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="mb-8">
            <Badge variant="accent">VERSION {version}</Badge>
          </motion.div>

          <motion.h1 
            variants={item}
            className="font-display font-bold text-brand-white text-[clamp(3rem,6vw,5.5rem)] leading-[1.05] tracking-[-0.02em] mb-6"
          >
            Everything you need, <br className="hidden md:block"/> <span className="text-brand-yellow">built in.</span>
          </motion.h1>

          <motion.div variants={item} className="w-[48px] h-[3px] bg-brand-yellow rounded-[2px] mb-8" />

          <motion.div variants={item} className="max-w-[65ch] mx-auto mb-12">
            <TextGenerateEffect 
              words="DawnDesk is a powerful, feature-rich desktop productivity suite. Combining Todo, Photo Editor, Project Manager, Calendar, and Notes into a single, cohesive, lightning-fast application."
              className="text-[1.125rem] text-brand-muted"
            />
          </motion.div>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/download" tabIndex={-1}>
              <Button size="lg" className="animate-yellow-pulse group">
                <Download className="mr-2 h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
                Download for Free
              </Button>
            </Link>
            <Link href="/features" tabIndex={-1}>
              <Button variant="secondary" size="lg">
                Explore Features
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
