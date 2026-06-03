import { Mail, MessageSquare, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { createPageMetadata } from "@/lib/seo";
import siteFallback from "@/content/site.json";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Contact Us",
  description: "Get in touch with the DawnDesk team for support, sales, or general inquiries.",
  path: "/contact-us",
});

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-black text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,196,0,0.24),transparent_32%)]" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center lg:px-8">
          <Mail className="mx-auto mb-6 text-[#ffc400]" size={48} />
          <p className="eyebrow text-[#ffc400]">Get in Touch</p>
          <h1 className="mt-5 text-5xl font-black leading-[1.05] md:text-7xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-white/70">
            Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      <main className="section pb-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.5fr] lg:px-8">
          
          <div className="space-y-8">
            <h2 className="text-3xl font-black">How can we help?</h2>
            <p className="text-black/65 leading-7">
              We&apos;re here to help and answer any question you might have. We look forward to hearing from you.
            </p>


          </div>

          <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm sm:p-10">
            <form action="#" className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-bold text-black/80">First name</label>
                  <input type="text" id="first-name" className="w-full rounded-md border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#ffc400]" placeholder="Jane" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-bold text-black/80">Last name</label>
                  <input type="text" id="last-name" className="w-full rounded-md border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#ffc400]" placeholder="Doe" required />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-black/80">Email</label>
                <input type="email" id="email" className="w-full rounded-md border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#ffc400]" placeholder="jane@example.com" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-black/80">Message</label>
                <textarea id="message" rows={5} className="w-full resize-y rounded-md border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#ffc400]" placeholder="How can we help you?" required></textarea>
              </div>

              <button type="submit" className="btn-animated w-full rounded-md bg-[#ffc400] px-7 py-4 text-sm font-extrabold text-black">
                Send Message
              </button>
            </form>
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
              <Link
                aria-label={`DawnDesk ${item} social media`}
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
