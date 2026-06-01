"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <Link aria-label="Login with Google" className="transition hover:text-[#ffc400]" href="/login">
        <CircleUserRound size={18} />
      </Link>
    );
  }

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Account";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <Link
      aria-label={`Signed in as ${displayName}`}
      className="btn-animated flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-xs font-bold text-white/85 transition hover:border-[#ffc400] hover:text-[#ffc400]"
      href="/login"
      title={`Signed in as ${displayName}`}
    >
      {avatarUrl ? (
        <Image className="h-6 w-6 rounded-full object-cover" src={avatarUrl} alt="" width={24} height={24} unoptimized />
      ) : (
        <CircleUserRound size={18} />
      )}
      <span className="hidden max-w-28 truncate lg:inline">{displayName}</span>
    </Link>
  );
}
