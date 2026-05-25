import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[6px] border border-brand-border bg-brand-surface px-[16px] py-[12px] text-[1rem] font-body text-brand-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-brand-muted-dark focus:border-brand-yellow focus:outline-none focus:ring-[3px] focus:ring-[rgba(245,197,24,0.12)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-[6px] border border-brand-border bg-brand-surface px-[16px] py-[12px] text-[1rem] font-body text-brand-white placeholder:text-brand-muted-dark focus:border-brand-yellow focus:outline-none focus:ring-[3px] focus:ring-[rgba(245,197,24,0.12)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Input, Textarea }
