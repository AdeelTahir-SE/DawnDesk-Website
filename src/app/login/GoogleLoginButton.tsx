"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export function GoogleLoginButton() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setLoading(false);
      setError("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  return (
    <div>
      <button
        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-6 py-4 text-sm font-extrabold text-black shadow-sm transition hover:bg-[#ffc400]"
        disabled={loading}
        onClick={signInWithGoogle}
        type="button"
      >
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.3-4.8 3.3-8Z" />
          <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.8l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.8 0-5.2-1.9-6.1-4.5H2.2v2.8A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.9 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.2a11 11 0 0 0 0 9.8l3.7-2.8Z" />
          <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.2 7.1l3.7 2.8C6.8 7.3 9.2 5.4 12 5.4Z" />
        </svg>
        {loading ? "Opening Google..." : "Continue with Google"}
      </button>
      {error && <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
    </div>
  );
}
