export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

type ToastListener = (toast: ToastMessage) => void;

const listeners = new Set<ToastListener>();

export function showToast(message: string, type: ToastType = "success") {
  if (typeof window === "undefined") return;
  const toast: ToastMessage = {
    id: crypto.randomUUID(),
    message,
    type,
  };
  listeners.forEach((listener) => listener(toast));
}

export function subscribeToasts(listener: ToastListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
