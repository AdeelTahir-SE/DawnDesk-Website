import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { MessageCircleQuestion, HelpCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { createPageMetadata } from "@/lib/seo";
import siteFallback from "@/content/site.json";

export const metadata = createPageMetadata({
  title: "FAQ",
  description: "Find answers to frequently asked questions about DawnDesk, your all-in-one desktop productivity suite.",
  path: "/faq",
});

const faqs = [
  {
    question: "What is DawnDesk?",
    answer: "DawnDesk is an all-in-one desktop productivity suite that combines project management, note-taking, creative editing (photo and video), and AI prompt management into a single, focused workspace."
  },
  {
    question: "Which platforms does DawnDesk support?",
    answer: "DawnDesk is currently available for Windows (64-bit). macOS and Linux versions are in active development and will be released soon."
  },
  {
    question: "Is DawnDesk free to use?",
    answer: "DawnDesk offers a free core version with essential tools. Premium features and advanced integrations may require a subscription in the future, but our current public release is free to download and try."
  },
  {
    question: "How do I update to the latest version?",
    answer: "DawnDesk will automatically notify you when a new update is available. You can also manually check for updates in the Settings menu or download the latest installer from our Releases page."
  },
  {
    question: "Can I use DawnDesk offline?",
    answer: "Yes! Many of DawnDesk's core tools, such as the Photo Editor, Video Editor, and Notes, work completely offline. Some features, like Cloud Sync and AI generation, require an internet connection."
  },
  {
    question: "Are my files and data secure?",
    answer: "We prioritize your privacy. All your local projects and files remain on your device. Any synced data is encrypted in transit and at rest."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-black text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,196,0,0.24),transparent_32%)]" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center lg:px-8">
          <MessageCircleQuestion className="mx-auto mb-6 text-[#ffc400]" size={48} />
          <p className="eyebrow text-[#ffc400]">Support & Help</p>
          <h1 className="mt-5 text-5xl font-black leading-[1.05] md:text-7xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-white/70">
            Have a question about DawnDesk? Find answers to our most common inquiries below.
          </p>
        </div>
      </section>

      <main className="section pb-32">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl border border-black/10 bg-white p-7 shadow-sm transition hover:border-[#ffc400] hover:shadow-md">
                <h3 className="flex items-start gap-4 text-xl font-black text-black">
                  <HelpCircle className="mt-1 shrink-0 text-[#d29300]" size={24} />
                  {faq.question}
                </h3>
                <p className="ml-10 mt-3 text-base leading-7 text-black/65">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-xl border border-black/10 bg-[#fffdf5] p-8 text-center shadow-inner">
            <h3 className="text-2xl font-black">Still have questions?</h3>
            <p className="mt-4 text-black/65">If you couldn&apos;t find what you were looking for, our support team is ready to help.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Link className="btn-animated rounded-md bg-[#ffc400] px-7 py-4 text-sm font-extrabold text-black" href="/report-a-bug">Report a Bug</Link>
              <Link className="btn-animated rounded-md border border-black/15 bg-white px-7 py-4 text-sm font-bold text-black" href="/request-a-feature">Request Feature</Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Including Footer since it's only in page.tsx right now
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
