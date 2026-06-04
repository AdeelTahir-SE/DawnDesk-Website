"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

type AdminSubmitButtonProps = {
  children: ReactNode;
  className: string;
  pendingText?: string;
};

export function AdminSubmitButton({
  children,
  className,
  pendingText = "Working...",
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-busy={pending}
      className={`${className} disabled:pointer-events-none disabled:opacity-70`}
      disabled={pending}
      type="submit"
    >
      {pending ? pendingText : children}
    </button>
  );
}
