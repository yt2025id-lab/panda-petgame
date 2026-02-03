"use client"
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info' | 'loading';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  removing: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => string;
  dismissToast: (id: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Config per type ─────────────────────────────────────────────────────────

const TOAST_CONFIG: Record<ToastType, { emoji: string; bg: string; border: string; text: string }> = {
  success: {
    emoji: '✅',
    bg: 'bg-green-100',
    border: 'border-green-600',
    text: 'text-green-900',
  },
  error: {
    emoji: '❌',
    bg: 'bg-red-100',
    border: 'border-red-600',
    text: 'text-red-900',
  },
  info: {
    emoji: '💡',
    bg: 'bg-blue-100',
    border: 'border-blue-600',
    text: 'text-blue-900',
  },
  loading: {
    emoji: '⏳',
    bg: 'bg-yellow-100',
    border: 'border-yellow-600',
    text: 'text-yellow-900',
  },
};

const AUTO_DISMISS_MS = 4000;

// ─── Keyframes injected once ─────────────────────────────────────────────────

const STYLE_ID = '__toast-keyframes';

function ensureKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes toast-slide-in {
      0% { transform: translateY(-120%); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes toast-fade-out {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(-40%); opacity: 0; }
    }
    @keyframes toast-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// ─── Provider ────────────────────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    ensureKeyframes();
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    // Start fade-out animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));

    // Clear any existing auto-dismiss timer
    const existing = timersRef.current.get(id);
    if (existing) {
      clearTimeout(existing);
      timersRef.current.delete(id);
    }

    // Remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info'): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const toast: Toast = { id, message, type, removing: false };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss (skip for loading toasts)
      if (type !== 'loading') {
        const timer = setTimeout(() => {
          dismissToast(id);
          timersRef.current.delete(id);
        }, AUTO_DISMISS_MS);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      {/* Toast container */}
      {toasts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            pointerEvents: 'none',
            width: '100%',
            maxWidth: 420,
            padding: '0 16px',
          }}
        >
          {toasts.map((toast) => {
            const config = TOAST_CONFIG[toast.type];
            return (
              <div
                key={toast.id}
                style={{
                  pointerEvents: 'auto',
                  animation: toast.removing
                    ? 'toast-fade-out 0.3s ease-in forwards'
                    : 'toast-slide-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                  width: '100%',
                }}
              >
                <div
                  className={`${config.bg} ${config.text} border-4 ${config.border} rounded-2xl shadow-[4px_4px_0px_#2d2d2d]`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 16px',
                    fontWeight: 800,
                    fontSize: 15,
                  }}
                >
                  {/* Emoji / spinner */}
                  <span style={{ fontSize: 22, flexShrink: 0 }}>
                    {toast.type === 'loading' ? (
                      <span
                        style={{
                          display: 'inline-block',
                          animation: 'toast-spin 1s linear infinite',
                        }}
                      >
                        {config.emoji}
                      </span>
                    ) : (
                      config.emoji
                    )}
                  </span>

                  {/* Message */}
                  <span style={{ flex: 1 }}>{toast.message}</span>

                  {/* Dismiss button */}
                  <button
                    onClick={() => dismissToast(toast.id)}
                    className="bg-white/60 hover:bg-white/90 border-2 border-gray-800 rounded-full transition-transform hover:scale-110 active:scale-95"
                    style={{
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: 14,
                      cursor: 'pointer',
                      flexShrink: 0,
                      lineHeight: 1,
                      color: '#374151',
                    }}
                    aria-label="Dismiss"
                  >
                    x
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}
