import Image from "next/image";
import Link from "next/link";
import { SearchOverlayButton } from "./SearchOverlayButton";
import { UserMenu } from "./UserMenu";

const navItems = [
  ["Features", "/#features"],
  ["Solutions", "/solutions"],
  ["Sub Apps", "/sub-apps"],
  ["Download", "/#download"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link className="group flex min-w-0 items-center gap-3 text-xl font-extrabold text-[#ffc400]" href="/">
          <Image src="/realistic_logo.png" alt="DawnDesk logo" width={44} height={44} className="h-11 w-11 shrink-0 object-contain" />
          <span className="transition group-hover:text-white">DawnDesk</span>
        </Link>
        <nav className="hidden items-center gap-9 text-sm font-semibold md:flex">
          {navItems.map(([label, href]) => (
            <Link className="relative text-white/82 transition hover:text-[#ffc400] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#ffc400] after:transition-all hover:after:w-full" href={href} key={label}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-white/85">
          <SearchOverlayButton />
          <UserMenu />
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-3 text-xs font-bold text-white/75 md:hidden">
        {navItems.map(([label, href]) => (
          <Link className="btn-animated shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 transition hover:border-[#ffc400]/70 hover:text-[#ffc400]" href={href} key={label}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
