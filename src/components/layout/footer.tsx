import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-black pt-16 pb-8">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-display font-bold text-2xl text-brand-white tracking-tight mb-4 inline-block">
              DawnDesk<span className="text-brand-yellow">.</span>
            </Link>
            <p className="text-brand-muted text-sm max-w-xs">
              The feature-rich all-in-one desktop productivity suite. Built for people who get things done.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-brand-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/features" className="text-brand-muted hover:text-brand-yellow text-sm transition-colors">Features</Link></li>
              <li><Link href="/download" className="text-brand-muted hover:text-brand-yellow text-sm transition-colors">Download</Link></li>
              <li><Link href="/changelog" className="text-brand-muted hover:text-brand-yellow text-sm transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-brand-white mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-brand-muted hover:text-brand-yellow text-sm transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-brand-muted hover:text-brand-yellow text-sm transition-colors">Documentation</a></li>
              <li><a href="#" className="text-brand-muted hover:text-brand-yellow text-sm transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-brand-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-brand-muted hover:text-brand-yellow text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-brand-muted hover:text-brand-yellow text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-brand-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-muted-dark">
          <p>© {new Date().getFullYear()} DawnDesk. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Version {process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
