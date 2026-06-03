import { Scale } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { MarkdownContent } from "@/components/MarkdownContent";
import { createPageMetadata } from "@/lib/seo";
import siteFallback from "@/content/site.json";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Read DawnDesk's Terms of Service for using our desktop productivity suite.",
  path: "/terms-of-service",
});

const termsContent = `
## 1. Acceptance of Terms

By downloading, installing, or using DawnDesk, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our software.

## 2. Description of Service

DawnDesk is a desktop productivity suite providing tools for project management, notes, photo and video editing, and AI prompt management. The software is provided "as is" and we reserve the right to modify, update, or discontinue features at any time without prior notice.

## 3. User Accounts

While many features of DawnDesk can be used offline without an account, certain cloud-based features require registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

## 4. Acceptable Use

You agree not to use DawnDesk to:
*   Violate any local, state, national, or international laws.
*   Infringe upon the intellectual property rights of others.
*   Distribute malicious software or engage in unauthorized data scraping.
*   Interfere with or disrupt the integrity or performance of the software.

## 5. Intellectual Property

DawnDesk and its original content, features, and functionality are owned by the DawnDesk team and are protected by international copyright, trademark, and other intellectual property laws.

## 6. Limitation of Liability

In no event shall DawnDesk, nor its developers or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.

## 7. Changes to Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of significant changes by updating the date at the bottom of this page. By continuing to access or use DawnDesk after those revisions become effective, you agree to be bound by the revised terms.

**Last updated:** June 2026
`;

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-black text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,196,0,0.24),transparent_32%)]" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center lg:px-8">
          <Scale className="mx-auto mb-6 text-[#ffc400]" size={48} />
          <p className="eyebrow text-[#ffc400]">Legal & Terms</p>
          <h1 className="mt-5 text-5xl font-black leading-[1.05] md:text-7xl">
            Terms of Service
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-white/70">
            Please read these terms carefully before using DawnDesk. They establish the rules and guidelines for our services.
          </p>
        </div>
      </section>

      <main className="section pb-32">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm md:p-12">
            <MarkdownContent content={termsContent} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function Footer() {
  const footer = siteFallback.footer;
  const allowedSocials = new Set(["x", "yt"]);
  const hiddenFooterItems = new Set(["Careers", "Changelog", "Roadmap"]);
  const footerGroups = footer.groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !hiddenFooterItems.has(item)),
    }))
    .filter((group) => group.items.length > 0);
  const footerSocials = footer.socials.filter((item) => allowedSocials.has(item));
  const footerHref = (item: string) => {
    const map: Record<string, string> = {
      'Workspaces': '/workspaces',
      'Documentation': '/documentation',
      'Blog': '/blog',
      'Report a Bug': '/report-a-bug',
      'Request a Feature': '/request-a-feature',
      'Download': '/#download',
      'Features': '/#features',
      'Contact Us': '/contact-us',
      'Privacy Policy': '/privacy-policy',
      'Terms of Service': '/terms-of-service',
      'FAQ': '/faq'
    };
    return map[item] || '#';
  };
  const socialHref = (item: string) => {
    if (item === "x") return "https://x.com/DawnDesk";
    if (item === "yt") return "https://www.youtube.com/@DawnDeskOfficial";
    return "#";
  };

  return (
    <footer className="bg-black px-5 py-16 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_2.6fr_1.6fr]">
        <div>
          <h2 className="text-3xl font-black text-[#ffc400]">DawnDesk</h2>
          <p className="mt-5 max-w-xs leading-8 text-white/68">{footer.copy}</p>
          <div className="mt-8 flex gap-4 text-white/70">
            {footerSocials.map((item) => (
              <Link
                aria-label={`DawnDesk \${item} social media`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-bold transition hover:bg-[#ffc400] hover:text-black"
                href={socialHref(item)}
                key={item}
              >
                <SocialIcon name={item} />
              </Link>
            ))}
          </div>
          <p className="mt-16 text-sm text-white/45">{footer.copyright}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerGroups.map(({ title, items }) => (
            <div key={title}>
              <h3 className="mb-5 font-black">{title}</h3>
              <ul className="space-y-4 text-white/62">
                {items.map((item) => <li key={item}><Link className="hover:text-[#ffc400]" href={footerHref(item)}>{item}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <div className="rounded-md border border-white/15 bg-white/[0.06] p-7">
            <h3 className="text-xl font-black">{footer.newsletter.title}</h3>
            <p className="mt-4 leading-7 text-white/62">{footer.newsletter.copy}</p>
            <form action="/api/newsletter" method="post" className="mt-7 flex overflow-hidden rounded-md border border-white/15 bg-black/30">
              <input className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm outline-none" name="email" type="email" placeholder={footer.newsletter.placeholder} required />
              <button className="btn-animated bg-[#ffc400] px-5 text-sm font-extrabold text-black">{footer.newsletter.button}</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const common = {
    "aria-hidden": true,
    className: "h-4 w-4",
    fill: "currentColor",
    viewBox: "0 0 24 24",
  };

  if (name === "f") {
    return (
      <svg {...common}>
        <path d="M14.5 8.2V6.9c0-.7.5-.9.9-.9h2.1V2.4L14.6 2c-3.3 0-5 2-5 5.5v.7H6.5V12h3.1v10h4.1V12h3.1l.5-3.8h-3.8Z" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg {...common}>
        <path d="M17.7 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.4L1.7 3h6.5l4.4 5.8L17.7 3Zm-1.1 16.2h1.7L7.3 4.7H5.4l11.2 14.5Z" />
      </svg>
    );
  }

  if (name === "yt") {
    return (
      <svg {...common}>
        <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.4V8.6l5.9 3.4-5.9 3.4Z" />
      </svg>
    );
  }

  return <span>{name}</span>;
}
