import { ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { MarkdownContent } from "@/components/MarkdownContent";
import { createPageMetadata } from "@/lib/seo";
import siteFallback from "@/content/site.json";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Read DawnDesk's Privacy Policy to understand how we handle your data and protect your privacy.",
  path: "/privacy-policy",
});

const policyContent = `
## 1. Information We Collect

DawnDesk is designed with privacy in mind. By default, most of your data (projects, notes, photos, videos) remains locally on your device. We only collect data necessary to provide our services, which includes:

*   **Account Information:** If you create an account, we collect your email address and basic profile information.
*   **Usage Data:** We collect anonymous analytics about how you use DawnDesk to help us improve the product.
*   **Synced Data:** If you enable Cloud Sync, your synced content is securely uploaded to our servers.

## 2. How We Use Your Data

We use the information we collect for the following purposes:

*   To provide and maintain the DawnDesk service.
*   To notify you about changes, updates, and security alerts.
*   To provide customer support and troubleshoot issues.
*   To analyze usage patterns and improve our applications.

## 3. Data Storage and Security

Your local files remain entirely on your computer and are never accessed by DawnDesk. For data you choose to sync using our Cloud Sync feature, we use industry-standard encryption protocols both in transit and at rest. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.

## 4. Third-Party Services

DawnDesk may use third-party services for analytics, crash reporting, and cloud infrastructure. These providers only have access to the data necessary to perform their specific tasks and are obligated to protect your information. 

## 5. Your Rights

Depending on your location, you may have the right to access, update, or delete your personal data. You can manage your account information directly within DawnDesk's settings or contact our support team for assistance.

## 6. Changes to This Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.

**Last updated:** June 2026
`;

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-black text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,196,0,0.24),transparent_32%)]" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center lg:px-8">
          <ShieldCheck className="mx-auto mb-6 text-[#ffc400]" size={48} />
          <p className="eyebrow text-[#ffc400]">Legal & Privacy</p>
          <h1 className="mt-5 text-5xl font-black leading-[1.05] md:text-7xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-white/70">
            We believe in protecting your privacy. Here is how we handle your data when you use DawnDesk.
          </p>
        </div>
      </section>

      <main className="section pb-32">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm md:p-12">
            <MarkdownContent content={policyContent} />
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
              <a
                aria-label={`DawnDesk ${item}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-bold transition hover:bg-[#ffc400] hover:text-black"
                href={socialHref(item)}
                key={item}
              >
                <SocialIcon name={item} />
              </a>
            ))}
          </div>
          <p className="mt-16 text-sm text-white/45">{footer.copyright}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerGroups.map(({ title, items }) => (
            <div key={title}>
              <h3 className="mb-5 font-black">{title}</h3>
              <ul className="space-y-4 text-white/62">
                {items.map((item) => <li key={item}><a className="hover:text-[#ffc400]" href={footerHref(item)}>{item}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <div className="rounded-md border border-white/15 bg-white/[0.06] p-7">
            <h3 className="text-xl font-black">{footer.newsletter.title}</h3>
            <p className="mt-4 leading-7 text-white/62">{footer.newsletter.copy}</p>
            <NewsletterForm placeholder={footer.newsletter.placeholder} buttonText={footer.newsletter.button} />
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
