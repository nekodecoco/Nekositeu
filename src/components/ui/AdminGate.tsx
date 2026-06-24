"use client";

import { useState, createContext, useContext, useCallback, ReactNode } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Modal from "@/components/ui/Modal";

// ─── Simple client-side password — change to your own value ─────────────────
const ADMIN_PASSWORD = "neko2024";

// ─── Context ─────────────────────────────────────────────────────────────────

interface AdminContextValue {
  isAdmin: boolean;
  requestAccess: (onSuccess: () => void) => void;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  requestAccess: () => {},
});

export function useAdmin() {
  return useContext(AdminContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);
  const [input, setInput] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const requestAccess = useCallback(
    (onSuccess: () => void) => {
      if (isAdmin) {
        onSuccess();
        return;
      }
      setPendingCallback(() => onSuccess);
      setIsModalOpen(true);
    },
    [isAdmin]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsModalOpen(false);
      setInput("");
      setError("");
      pendingCallback?.();
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, requestAccess }}>
      {children}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setInput(""); setError(""); }} title="Admin Access Required">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent-blue/5 border border-accent-blue/15">
            <Lock className="w-4 h-4 text-accent-blue flex-shrink-0" />
            <p className="font-inter text-xs text-[#BFC7D5] leading-relaxed">
              CRUD operations are gated. Enter the admin password to continue.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoFocus
                required
                placeholder="••••••••"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(""); }}
                className="w-full px-3.5 py-2 pr-10 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2.5 top-2 text-[#6B7280] hover:text-white transition-colors cursor-pointer"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="font-mono text-[10px] text-accent-peach">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-1 w-full py-2.5 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Authenticate
          </button>
        </form>
      </Modal>
    </AdminContext.Provider>
  );
}

// ─── Inline badge shown when admin mode is active ────────────────────────────

export function AdminBadge() {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return null;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 font-mono text-[10px] text-accent-blue">
      <ShieldCheck className="w-3 h-3" />
      ADMIN MODE
    </div>
  );
}
