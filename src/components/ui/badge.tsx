import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'accent' | 'neutral';
}

function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-mono text-[0.75rem] font-medium leading-[1.5] tracking-[0.05em] uppercase px-[10px] py-[3px] rounded-full",
        {
          "bg-[rgba(245,197,24,0.12)] text-brand-yellow border border-[rgba(245,197,24,0.3)]": variant === 'accent',
          "bg-brand-surface-2 text-brand-muted border border-brand-border": variant === 'neutral',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
