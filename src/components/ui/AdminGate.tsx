"use client";

import {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ShieldCheck, LogOut } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const ADMIN_EMAIL = "nikko.alferez@gmail.com";

// ─── Context ─────────────────────────────────────────────────────────────────

interface AdminContextValue {
  isAdmin: boolean;
  requestAccess: (onSuccess: () => void) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  requestAccess: () => {},
  logout: () => {},
});

export function useAdmin() {
  return useContext(AdminContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AdminProvider({
  children,
  initialIsAdmin = false,
}: {
  children: ReactNode;
  initialIsAdmin?: boolean;
}) {
  const router = useRouter();
  const supabase = useMemo(
    () => (isSupabaseConfigured ? createClient() : null),
    []
  );

  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Keep isAdmin in sync with the Supabase session (sign-in, sign-out, expiry).
  useEffect(() => {
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

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

  const logout = useCallback(() => {
    if (!supabase) return;
    supabase.auth.signOut().then(() => {
      setIsAdmin(false);
      router.refresh();
    });
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError("Supabase is not configured. Add the env keys first.");
      return;
    }
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (signInError) {
      setError("Incorrect email or password. Try again.");
      return;
    }

    setIsAdmin(true);
    setIsModalOpen(false);
    setPassword("");
    setError("");
    pendingCallback?.();
    // Re-render server components with the new session cookie.
    router.refresh();
  };

  return (
    <AdminContext.Provider value={{ isAdmin, requestAccess, logout }}>
      {children}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setPassword(""); setError(""); }}
        title="Admin Access Required"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent-blue/5 border border-accent-blue/15">
            <Lock className="w-4 h-4 text-accent-blue flex-shrink-0" />
            <p className="font-inter text-xs text-[#BFC7D5] leading-relaxed">
              CRUD operations are gated. Sign in with the admin account to continue.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="w-full px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoFocus
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
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
            disabled={submitting}
            className="mt-1 w-full py-2.5 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
          >
            <ShieldCheck className="w-4 h-4" />
            {submitting ? "Signing in…" : "Authenticate"}
          </button>
        </form>
      </Modal>
    </AdminContext.Provider>
  );
}

// ─── Inline badge shown when admin mode is active ────────────────────────────

export function AdminBadge() {
  const { isAdmin, logout } = useAdmin();
  if (!isAdmin) return null;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 font-mono text-[10px] text-accent-blue">
      <ShieldCheck className="w-3 h-3" />
      ADMIN MODE
      <button
        type="button"
        onClick={logout}
        title="Sign out"
        aria-label="Sign out of admin mode"
        className="ml-1 pl-1.5 border-l border-accent-blue/20 text-accent-blue/70 hover:text-accent-blue transition-colors cursor-pointer"
      >
        <LogOut className="w-3 h-3" />
      </button>
    </div>
  );
}
