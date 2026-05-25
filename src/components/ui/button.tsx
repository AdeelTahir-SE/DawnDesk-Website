import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[6px] font-body transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-yellow/20",
          {
            "bg-brand-yellow text-brand-black font-semibold text-[0.9375rem] leading-none tracking-[0.01em] border-none hover:bg-brand-yellow-dim hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(245,197,24,0.3)] active:translate-y-0 active:shadow-none": variant === 'primary',
            "bg-transparent text-brand-white border border-brand-border hover:border-brand-yellow hover:text-brand-yellow hover:bg-[rgba(245,197,24,0.06)]": variant === 'secondary',
            "bg-transparent text-brand-muted hover:text-brand-white hover:bg-brand-surface-2": variant === 'ghost',
            "py-[14px] px-[28px]": size === 'default',
            "py-[10px] px-[20px] text-sm": size === 'sm',
            "py-[18px] px-[36px] text-lg": size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
