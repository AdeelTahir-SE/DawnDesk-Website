"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NewsletterFormInner({ placeholder, buttonText }: { placeholder: string; buttonText: string }) {
  const searchParams = useSearchParams();
  const subscribed = searchParams?.get("newsletter") === "subscribed";

  if (subscribed) {
    return (
      <div className="mt-7 rounded-md bg-[#fff3bf] px-4 py-3 text-sm font-bold text-black text-center">
        Response submitted! Thanks for subscribing.
      </div>
    );
  }

  return (
    <form action="/api/newsletter" method="post" className="mt-7 flex min-w-0 flex-col overflow-hidden rounded-md border border-white/15 bg-black/30 sm:flex-row">
      <input className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm outline-none" name="email" type="email" placeholder={placeholder} required />
      <button className="btn-animated w-full bg-[#ffc400] px-5 py-4 text-sm font-extrabold text-black sm:w-auto">{buttonText}</button>
    </form>
  );
}

export function NewsletterForm({ placeholder, buttonText }: { placeholder: string; buttonText: string }) {
  return (
    <Suspense fallback={
      <form className="mt-7 flex min-w-0 flex-col overflow-hidden rounded-md border border-white/15 bg-black/30 sm:flex-row">
        <input className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm outline-none" placeholder={placeholder} disabled />
        <button className="btn-animated w-full bg-[#ffc400] px-5 py-4 text-sm font-extrabold text-black sm:w-auto" disabled>{buttonText}</button>
      </form>
    }>
      <NewsletterFormInner placeholder={placeholder} buttonText={buttonText} />
    </Suspense>
  );
}
