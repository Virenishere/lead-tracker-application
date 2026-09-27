import { Toast as ToastPrimitive } from "@base-ui/react/toast";

const toastManager = ToastPrimitive.createToastManager();

const originalAdd = toastManager.add.bind(toastManager);
const originalClose = toastManager.close.bind(toastManager);

let lastToastKey = "";
let lastToastTime = 0;

type ToastOptions = Parameters<typeof toastManager.add>[0];

const safeAdd = (options: ToastOptions) => {
  const key = `${options.type || ""}:${options.title || ""}:${options.description || ""}`;
  const now = Date.now();

  if (key === lastToastKey && now - lastToastTime < 1000) {
    return;
  }

  lastToastKey = key;
  lastToastTime = now;

  return originalAdd(options);
};

const toast = Object.assign(toastManager, {
  add: (options: ToastOptions) => safeAdd(options),

  success: (title: string, description?: string) =>
    safeAdd({
      title,
      description,
      type: "success",
    }),

  error: (title: string, description?: string) =>
    safeAdd({
      title,
      description,
      type: "error",
    }),

  info: (title: string, description?: string) =>
    safeAdd({
      title,
      description,
      type: "info",
    }),

  close: (id: string) => originalClose(id),
});

const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;

export {
  createToastManager,
  toast,
  useToastManager,
};