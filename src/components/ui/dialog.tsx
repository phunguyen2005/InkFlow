"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

export function Dialog({
  title,
  trigger,
  children,
  className = "",
  triggerVariant = "icon",
}: {
  title: string;
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  triggerVariant?: "icon" | "raw";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    if (open) dialog?.showModal();
    else dialog?.close();
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <>
      <button
        className={
          triggerVariant === "raw" ? className : `icon-button ${className}`
        }
        title={title}
        aria-label={title}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {trigger}
      </button>
      <dialog
        ref={ref}
        className="app-dialog"
        aria-label={title}
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="dialog-inner">
          <div className="dialog-heading">
            <h2>{title}</h2>
            <button
              className="icon-button"
              aria-label={`Close ${title}`}
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>
          </div>
          <div
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a, [data-dialog-close]"))
                setOpen(false);
            }}
          >
            {children}
          </div>
        </div>
      </dialog>
    </>
  );
}
