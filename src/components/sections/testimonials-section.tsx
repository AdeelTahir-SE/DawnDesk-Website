import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const testimonials = [
  {
    quote:
      "DawnDesk fundamentally changed how my team works. It's like having a terminal, a notebook, and a project manager neatly wrapped into one lightning-fast interface.",
    name: "Sarah Chen",
    title: "Lead Engineer at Vercel",
  },
  {
    quote:
      "I used to have 15 tabs open just to get through my morning triage. Now I boot up DawnDesk, hit the global shortcut, and everything is right there.",
    name: "Alex Rivera",
    title: "Product Designer",
  },
  {
    quote:
      "The performance is unmatched. It doesn't matter how many layers I have in the Photo Editor or how many tasks in the backlog, the app never stutters.",
    name: "Michael Chang",
    title: "Indie Hacker",
  },
  {
    quote:
      "Finally, a suite that respects developers. The built-in dev tools and terminal integration are an absolute game changer.",
    name: "Emily Watson",
    title: "Senior Full Stack Developer",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-brand-black overflow-hidden border-y border-brand-border">
      <div className="container mx-auto px-6 mb-12 text-center">
        <h2 className="font-display font-semibold text-[2rem] text-brand-white tracking-[-0.02em]">
          Loved by builders.
        </h2>
      </div>
      <div className="flex flex-col antialiased items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
    </section>
  );
}
