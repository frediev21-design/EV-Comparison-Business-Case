"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { subscribeToasts, type ToastMessage } from "@/lib/toast";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const STYLES = {
  success: "border-success/30 bg-success/10 text-success",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-accent/30 bg-accent/10 text-accent",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return subscribeToasts((toast) => {
      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3200);
    });
  }, []);

  return (
    <>
      {children}
      <div
        className="pointer-events-none fixed bottom-20 right-4 z-[100] flex flex-col gap-2 lg:bottom-6"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "pointer-events-auto flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur",
                  STYLES[toast.type]
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {toast.message}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}
