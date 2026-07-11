"use client";

import { Lock, ShieldCheck } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAdmin } from "@/components/ui/AdminGate";

export default function ScheduleLocked() {
  const { requestAccess } = useAdmin();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-12 w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-8 max-w-2xl">
        <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
          Availability &amp; Logging
        </span>
        <h1 className="font-hanken font-bold text-4xl md:text-5xl text-white">
          Developer Schedule
        </h1>
      </div>

      {/* Locked state */}
      <GlassCard hoverGlow={false} className="py-24 px-8 flex flex-col items-center justify-center gap-5 text-center bg-[#1B1B1B]/20">
        <div className="p-5 rounded-full bg-accent-blue/5 border border-accent-blue/15 text-accent-blue">
          <Lock className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2 max-w-md">
          <h2 className="font-hanken font-bold text-2xl text-white">
            This schedule is private
          </h2>
          <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed">
            Time blocks and planning data are only visible to the studio owner.
          </p>
        </div>
        <button
          onClick={() => requestAccess(() => {})}
          className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-semibold text-sm rounded-lg transition-colors duration-200 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          Sign in as admin
        </button>
      </GlassCard>
    </div>
  );
}
