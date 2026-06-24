import React, { createContext, useContext, useState, ReactNode } from 'react';

type Toast = { id: number; message: string };

const ToastContext = createContext({ show: (msg: string) => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = (message: string, timeout = 3000) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), timeout);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className="bg-slate-800 text-white px-4 py-2 rounded shadow-lg border border-slate-700/60">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext) as { show: (msg: string, timeout?: number) => void };

export default ToastProvider;
