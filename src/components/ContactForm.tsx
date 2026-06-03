"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/contact-us/actions";

const initialState: ContactState = {
  success: false,
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  if (state.success) {
    return (
      <div className="rounded-xl border border-black/10 bg-[#f9fafb] p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-black">Message Sent!</h3>
        <p className="mt-3 text-black/65 leading-7">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 font-medium">
          {state.message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="first-name" className="text-sm font-bold text-black/80">First name</label>
          <input 
            type="text" 
            id="first-name" 
            name="first-name"
            className="w-full rounded-md border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#ffc400]" 
            placeholder="Jane" 
            required 
            disabled={isPending}
          />
          {state.errors?.firstName && (
            <p className="text-xs text-red-500">{state.errors.firstName[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="last-name" className="text-sm font-bold text-black/80">Last name</label>
          <input 
            type="text" 
            id="last-name" 
            name="last-name"
            className="w-full rounded-md border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#ffc400]" 
            placeholder="Doe" 
            required 
            disabled={isPending}
          />
          {state.errors?.lastName && (
            <p className="text-xs text-red-500">{state.errors.lastName[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-bold text-black/80">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email"
          className="w-full rounded-md border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#ffc400]" 
          placeholder="jane@example.com" 
          required 
          disabled={isPending}
        />
        {state.errors?.email && (
          <p className="text-xs text-red-500">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-bold text-black/80">Message</label>
        <textarea 
          id="message" 
          name="message"
          rows={5} 
          className="w-full resize-y rounded-md border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#ffc400]" 
          placeholder="How can we help you?" 
          required
          disabled={isPending}
        ></textarea>
        {state.errors?.message && (
          <p className="text-xs text-red-500">{state.errors.message[0]}</p>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="btn-animated w-full rounded-md bg-[#ffc400] px-7 py-4 text-sm font-extrabold text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
