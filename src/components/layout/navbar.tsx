'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-colors duration-200 border-b',
        scrolled ? 'bg-[rgba(10,10,10,0.85)] backdrop-blur-[12px] border-brand-border' : 'bg-transparent border-transparent'
      )}
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="font-display font-bold text-2xl text-brand-white tracking-tight">
            DawnDesk<span className="text-brand-yellow">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[0.875rem] font-medium transition-colors',
                  pathname === link.href ? 'text-brand-yellow' : 'text-brand-muted hover:text-brand-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="/download" tabIndex={-1}>
              <Button size="sm">Download</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-brand-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-brand-surface border-b border-brand-border absolute top-full inset-x-0"
        >
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-lg font-medium',
                  pathname === link.href ? 'text-brand-yellow' : 'text-brand-muted hover:text-brand-white'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-brand-border">
              <Link href="/download" tabIndex={-1} onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Download Now</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
