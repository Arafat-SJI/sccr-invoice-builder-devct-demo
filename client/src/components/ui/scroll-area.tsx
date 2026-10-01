'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string
}

export function ScrollArea({ className, viewportClassName, children, ...props }: ScrollAreaProps) {
  return (
    <div className={cn('relative', className)} {...props}>
      <div className={cn('max-h-full w-full overflow-auto', viewportClassName)}>{children}</div>
    </div>
  )
}

export function ScrollBar() {
  // No-op shim to satisfy shadcn API usage without adding external deps
  return null
}
