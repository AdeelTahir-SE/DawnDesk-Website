import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { createPageMetadata } from "@/lib/seo";
import { GoogleLoginButton } from "./GoogleLoginButton";

export const metadata = createPageMetadata({
  title: "Login",
  description: "Sign in to DawnDesk with Google.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />
      <section className="relative overflow-hidden bg-black px-5 py-20 text-white lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,196,0,0.26),transparent_34%)]" />
        <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
          <Image src="/realistic_logo.png" alt="DawnDesk logo" width={132} height={132} className="h-36 w-36 object-contain" priority />
          <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">DawnDesk login</p>
          <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">Sign in with Google</h1>
          <p className="mt-5 leading-7 text-white/68">
            DawnDesk uses Google as the only sign-in option for website accounts.
          </p>
          <div className="mt-8 w-full rounded-xl border border-white/12 bg-white/[0.06] p-6 shadow-[0_0_70px_rgba(255,196,0,0.14)]">
            <GoogleLoginButton />
          </div>
          <Link className="mt-7 text-sm font-bold text-white/62 transition hover:text-[#ffc400]" href="/">
            Back to DawnDesk
          </Link>
        </div>
      </section>
    </main>
  );
}
