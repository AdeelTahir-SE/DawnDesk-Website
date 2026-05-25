'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Meteors } from '@/components/ui/meteors';

export default function ContactPage() {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API call to Supabase or email provider
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  };

  return (
    <div className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 min-h-screen">
      <Meteors number={20} className="pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-[1280px] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          
          <div>
            <h1 className="font-display font-bold text-brand-white text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] mb-4">
              Get in touch.
            </h1>
            <p className="text-[1.125rem] text-brand-muted mb-8">
              Have a question, feedback, or need support? Send us a message and our team will get back to you as soon as possible.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-xl text-brand-white mb-2">Support Hours</h3>
                <p className="text-brand-muted">Monday - Friday<br/>9:00 AM - 5:00 PM (EST)</p>
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl text-brand-white mb-2">General Inquiries</h3>
                <p className="text-brand-muted">hello@dawndesk.app</p>
              </div>
            </div>
          </div>

          <div>
            <Card className="backdrop-blur-sm bg-brand-surface/80 border-brand-border shadow-2xl relative overflow-hidden">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>We typically reply within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                {status === 'success' ? (
                  <div className="bg-brand-surface-2 border border-brand-yellow/30 text-brand-white p-6 rounded-lg text-center">
                    <div className="text-brand-yellow mb-2 flex justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-2">Message Sent!</h3>
                    <p className="text-brand-muted">Thank you for reaching out. We will get back to you shortly.</p>
                    <Button variant="ghost" className="mt-4" onClick={() => setStatus('idle')}>Send another message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-brand-white mb-1.5">Name</label>
                      <Input id="name" required placeholder="Jane Doe" disabled={status === 'submitting'} />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-brand-white mb-1.5">Email</label>
                      <Input id="email" type="email" required placeholder="jane@example.com" disabled={status === 'submitting'} />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-brand-white mb-1.5">Message</label>
                      <Textarea id="message" required placeholder="How can we help you?" rows={5} disabled={status === 'submitting'} />
                    </div>
                    <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                      {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
