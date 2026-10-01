'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { className, pressed: controlled, onPressedChange, ...props },
  ref
) {
  const [uncontrolled, setUncontrolled] = React.useState(false)
  const pressed = controlled ?? uncontrolled

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    props.onClick?.(e)
    const next = !pressed
    setUncontrolled(next)
    onPressedChange?.(next)
  }

  return (
    <button
      ref={ref}
      aria-pressed={pressed}
      data-state={pressed ? 'on' : 'off'}
      className={cn(
        'inline-flex items-center justify-center rounded-md border px-2.5 py-1.5 text-sm transition-colors',
        pressed
          ? 'bg-primary text-primary-foreground'
          : 'bg-background text-foreground hover:bg-secondary',
        className
      )}
      onClick={handleClick}
      {...props}
    />
  )
})
