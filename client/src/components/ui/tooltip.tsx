'use client'

import * as React from 'react'

type TooltipContextValue = {
  open: boolean
  setOpen: (v: boolean) => void
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const value = React.useMemo(() => ({ open, setOpen }), [open])
  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export const TooltipTrigger = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { asChild?: boolean }>(
  function TooltipTrigger({ asChild, children, ...props }, ref) {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as any, { ref, ...props })
    }
    return (
      <span ref={ref as any} {...props}>
        {children}
      </span>
    )
  }
)

export const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { side?: string }>(
  function TooltipContent({ children, ...props }, ref) {
    // Simple shim: render invisible content for API compatibility (we rely on native title attributes)
    return (
      <div ref={ref} {...props} style={{ display: 'none' }}>
        {children}
      </div>
    )
  }
)
