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
        <Link className="flex min-w-0 items-center gap-3 text-xl font-extrabold text-[#ffc400]" href="/">
          <Image src="/realistic_logo.png" alt="DawnDesk logo" width={44} height={44} className="h-11 w-11 shrink-0 object-contain" />
          <span>DawnDesk</span>
        </Link>
        <nav className="hidden items-center gap-9 text-sm font-semibold md:flex">
          {navItems.map(([label, href]) => (
            <Link className="text-white/82 transition hover:text-[#ffc400]" href={href} key={label}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-white/85">
          <SearchOverlayButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
