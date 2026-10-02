"use client";

import React, { createContext, useContext, useState, ReactNode, cloneElement, isValidElement } from "react";

type DialogContextType = { open: boolean; setOpen: (v: boolean) => void } | undefined;
const DialogContext = createContext<DialogContextType>(undefined);

export function Dialog({ open: controlledOpen, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: ReactNode; }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof controlledOpen === "boolean";
  const open = isControlled ? controlledOpen! : internalOpen;
  const setOpen = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children, asChild }: { children: ReactNode; asChild?: boolean; }) {
  const ctx = useContext(DialogContext);
  if (!ctx) return <>{children}</>;
  const { setOpen } = ctx;
  if (asChild && isValidElement(children)) {
    return cloneElement(children as any, { onClick: () => setOpen(true) });
  }
  return <button onClick={() => setOpen(true)}>{children}</button>;
}

export function DialogContent({ children }: { children: ReactNode; }) {
  const ctx = useContext(DialogContext);
  if (!ctx) return null;
  if (!ctx.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => ctx.setOpen(false)} />
      <div className="bg-background rounded p-4 z-10 w-full max-w-md">{children}</div>
    </div>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-2">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-medium">{children}</h3>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex gap-2 justify-end">{children}</div>;
}
