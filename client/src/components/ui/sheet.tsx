'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type SheetCtx = {
  open: boolean
  setOpen: (v: boolean) => void
}

const SheetContext = React.createContext<SheetCtx | null>(null)

export function useSheet() {
  const ctx = React.useContext(SheetContext)
  if (!ctx) throw new Error('useSheet must be used within <Sheet>')
  return ctx
}

export function Sheet({ open: controlled, onOpenChange, children }: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState(false)
  const open = controlled ?? uncontrolled

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (controlled === undefined) setUncontrolled(v)
      onOpenChange?.(v)
    },
    [controlled, onOpenChange]
  )

  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>
}

export const SheetTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function SheetTrigger({ onClick, ...props }, ref) {
    const { setOpen } = useSheet()
    return (
      <button
        ref={ref}
        onClick={(e) => {
          onClick?.(e)
          setOpen(true)
        }}
        {...props}
      />
    )
  }
)

export const SheetClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function SheetClose({ onClick, ...props }, ref) {
    const { setOpen } = useSheet()
    return (
      <button
        ref={ref}
        onClick={(e) => {
          onClick?.(e)
          setOpen(false)
        }}
        {...props}
      />
    )
  }
)

export const SheetContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { side?: 'left' | 'right' | 'top' | 'bottom' }>(
  function SheetContent({ className, side = 'left', children, ...props }, ref) {
    const { open, setOpen } = useSheet()

    return (
      <>
        {/* Overlay */}
        <div
          aria-hidden
          className={cn(
            'fixed inset-0 z-40 bg-black/40 transition-opacity',
            open ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
          onClick={() => setOpen(false)}
        />
        {/* Panel */}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            'fixed z-50 bg-background shadow-lg transition-transform',
            side === 'left' && 'inset-y-0 left-0 w-72',
            side === 'right' && 'inset-y-0 right-0 w-72',
            side === 'top' && 'inset-x-0 top-0 h-1/2',
            side === 'bottom' && 'inset-x-0 bottom-0 h-1/2',
            open
              ? 'translate-x-0 translate-y-0'
              : side === 'left'
              ? '-translate-x-full'
              : side === 'right'
              ? 'translate-x-full'
              : side === 'top'
              ? '-translate-y-full'
              : 'translate-y-full',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </>
    )
  }
)

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-4 py-3 border-b', className)} {...props} />
}

export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold', className)} {...props} />
}

export function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}
