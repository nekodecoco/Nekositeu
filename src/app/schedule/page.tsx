"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Activity, Clock, Lock } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface TimeBlock {
  dayIndex: number; // 0: Mon, 1: Tue, 2: Wed, 3: Thu, 4: Fri, 5: Sat, 6: Sun
  title: string;
  subtitle?: string;
  startHour: string;
  endHour: string;
  rowStart: number;
  rowEnd: number;
  colorType: "blue" | "orange" | "peach" | "gray";
  status?: string;
}

const SCHEDULE_ITEMS: TimeBlock[] = [
  {
    dayIndex: 0, // Mon
    title: "Deep Focus: WebGL",
    subtitle: "Render optimization",
    startHour: "09:00",
    endHour: "11:00",
    rowStart: 2,
    rowEnd: 4,
    colorType: "gray",
  },
  {
    dayIndex: 1, // Tue
    title: "Design System Audit",
    subtitle: "Atomic Token review",
    startHour: "11:00",
    endHour: "14:00",
    rowStart: 4,
    rowEnd: 7,
    colorType: "orange",
  },
  {
    dayIndex: 2, // Wed
    title: "UI Implementation",
    subtitle: "Next.js routing",
    startHour: "09:00",
    endHour: "11:00",
    rowStart: 2,
    rowEnd: 4,
    colorType: "blue",
    status: "IN PROGRESS",
  },
  {
    dayIndex: 2, // Wed
    title: "Team Sync",
    subtitle: "Handoff alignment",
    startHour: "13:00",
    endHour: "14:00",
    rowStart: 6,
    rowEnd: 7,
    colorType: "gray",
  },
  {
    dayIndex: 3, // Thu
    title: "Portfolio Research",
    subtitle: "Layout references",
    startHour: "12:00",
    endHour: "14:00",
    rowStart: 5,
    rowEnd: 7,
    colorType: "gray",
  },
  {
    dayIndex: 4, // Fri
    title: "Critical Fixes",
    subtitle: "WASM memory leak",
    startHour: "14:00",
    endHour: "17:00",
    rowStart: 7,
    rowEnd: 10,
    colorType: "peach",
  },
];

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Generate contribution grid colors
const getActivityIntensityColor = (intensity: number) => {
  switch (intensity) {
    case 0:
      return "bg-[#1E1E1E]"; // No activity
    case 1:
      return "bg-accent-blue/15";
    case 2:
      return "bg-accent-blue/40";
    case 3:
      return "bg-accent-blue/70";
    case 4:
      return "bg-accent-blue";
    default:
      return "bg-[#1E1E1E]";
  }
};

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate 52 weeks of mock activity data (364 blocks)
  // To keep it deterministic but look natural, we use modulo hashing.
  const activityCells = Array.from({ length: 364 }).map((_, idx) => {
    // Creating realistic mock activity clusters
    const clusterVal = Math.sin(idx / 15) * 2 + Math.cos(idx / 4) * 2;
    let intensity = 0;
    if (clusterVal > 2.5) intensity = 4;
    else if (clusterVal > 1.2) intensity = 3;
    else if (clusterVal > 0) intensity = 2;
    else if (clusterVal > -1) intensity = 1;
    return intensity;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-12 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
            Availability & Logging
          </span>
          <h1 className="font-hanken font-bold text-4xl md:text-5xl text-white">
            Developer Schedule
          </h1>
          <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed">
            A real-time display of design system builds, WebGL development, and general availability blocks.
          </p>
        </div>
      </div>

      {/* 1. Git-like Activity Heatmap */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between font-mono text-xs tracking-wider uppercase text-[#BFC7D5]">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-blue" />
            Yearly Coding Density (365 Days)
          </span>
          <span className="text-[10px] text-[#6B7280]">
            Last Updated: Today
          </span>
        </div>

        <GlassCard hoverGlow={false} className="p-6 overflow-x-auto bg-[#1B1B1B]/20">
          <div className="flex flex-col gap-4 min-w-[850px]">
            {/* Heatmap cells */}
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {activityCells.map((intensity, idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 hover:scale-125 ${getActivityIntensityColor(
                    intensity
                  )}`}
                  title={`Day ${idx + 1}: Level ${intensity} Activity`}
                />
              ))}
            </div>

            {/* Labels and Legend */}
            <div className="flex items-center justify-between text-[10px] font-mono text-[#A1A1A1] pt-2 border-t border-white/5">
              <div className="flex gap-16">
                <span>JAN - APR</span>
                <span>MAY - AUG</span>
                <span>SEP - DEC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#1E1E1E]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-accent-blue/15" />
                <span className="w-2.5 h-2.5 rounded-sm bg-accent-blue/40" />
                <span className="w-2.5 h-2.5 rounded-sm bg-accent-blue/70" />
                <span className="w-2.5 h-2.5 rounded-sm bg-accent-blue" />
                <span>More</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 2. Weekly Calendar Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
              Time Blocking & Flow
            </span>
            <h2 className="font-hanken font-bold text-2xl text-white">
              Weekly Rhythm
            </h2>
          </div>

          {/* Week Pagination */}
          <div className="flex items-center gap-4 bg-white/3 border border-white/5 p-1.5 rounded-xl w-fit">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="p-1.5 hover:bg-white/5 rounded text-[#BFC7D5] hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs font-semibold px-2 text-[#E2E2E2]">
              {weekOffset === 0 ? "Oct 21 - 27, 2024" : `Week Offset: ${weekOffset}`}
            </span>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-1.5 hover:bg-white/5 rounded text-[#BFC7D5] hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Card */}
        <GlassCard hoverGlow={false} className="bg-[#1B1B1B]/10 overflow-hidden">
          {/* Day Headers (Shared Header Panel) */}
          <div className="grid grid-cols-8 border-b border-white/5 bg-zinc-950/40 text-center font-mono text-xs font-medium text-[#BFC7D5] py-4">
            <div className="flex items-center justify-center gap-1.5 text-[#6B7280]">
              <Clock className="w-4 h-4" />
              TIME
            </div>
            {DAYS.map((day, idx) => {
              const dateVal = 21 + idx;
              const isActiveDay = day === "WED" && weekOffset === 0;
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center justify-center gap-0.5 border-l border-white/5 py-1 ${
                    isActiveDay ? "text-accent-blue" : ""
                  }`}
                >
                  <span className="text-[10px] text-[#A1A1A1]">{day}</span>
                  <span className="font-hanken font-bold text-base text-white">
                    {dateVal}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Hours and Block Grid */}
          <div className="grid grid-cols-8 relative min-h-[500px]">
            {/* Background Grid Lines Overlay */}
            <div className="absolute inset-0 grid grid-rows-10 pointer-events-none z-0">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full border-b border-white/3 last:border-b-0"
                />
              ))}
            </div>

            {/* Left Hand Hour Column */}
            <div className="grid grid-rows-10 text-center font-mono text-[10px] text-[#6B7280] z-10 bg-zinc-950/20">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="flex items-center justify-center border-b border-white/3 last:border-b-0 py-4"
                >
                  {hour}
                </div>
              ))}
            </div>

            {/* 7 Columns for Days */}
            {DAYS.map((day, dayIdx) => {
              const columnBlocks = SCHEDULE_ITEMS.filter(
                (item) => item.dayIndex === dayIdx
              );
              const isWeekend = dayIdx === 5 || dayIdx === 6;

              return (
                <div
                  key={day}
                  className={`relative grid grid-rows-10 border-l border-white/5 z-10 h-full ${
                    isWeekend ? "bg-zinc-950/15" : ""
                  }`}
                >
                  {/* Saturday/Sunday rest indicators */}
                  {isWeekend && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/5 select-none pointer-events-none">
                      <Lock className="w-12 h-12" />
                    </div>
                  )}

                  {/* Render Day-specific Absolute Blocks */}
                  {columnBlocks.map((block, blockIdx) => {
                    // Map block background and text colors
                    let blockColorClass = "bg-white/5 border-white/10 text-white";
                    if (block.colorType === "blue") {
                      blockColorClass =
                        "bg-accent-blue/10 border-accent-blue/30 text-accent-blue shadow-[0_0_15px_rgba(159,202,255,0.05)]";
                    } else if (block.colorType === "orange") {
                      blockColorClass = "bg-accent-orange/10 border-accent-orange/30 text-accent-orange";
                    } else if (block.colorType === "peach") {
                      blockColorClass = "bg-accent-peach/10 border-accent-peach/30 text-accent-peach";
                    }

                    // Compute height in Tailwind grid row-span
                    const startRow = block.rowStart;
                    const endRow = block.rowEnd;

                    return (
                      <div
                        key={blockIdx}
                        style={{
                          gridRowStart: startRow,
                          gridRowEnd: endRow,
                        }}
                        className={`absolute inset-x-1.5 my-1.5 p-3 rounded-lg border flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-[1.02] hover:z-20 transition-all duration-300 ${blockColorClass}`}
                      >
                        {/* Title and subtitle */}
                        <div className="flex flex-col gap-0.5">
                          <h4 className="font-hanken font-bold text-xs leading-snug">
                            {block.title}
                          </h4>
                          {block.subtitle && (
                            <span className="font-inter text-[9px] text-[#A1A1A1] font-medium leading-none">
                              {block.subtitle}
                            </span>
                          )}
                        </div>

                        {/* Status / Time badge */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-1.5 mt-1">
                          <span className="font-mono text-[8px] tracking-wider uppercase font-semibold">
                            {block.startHour} - {block.endHour}
                          </span>
                          {block.status && (
                            <span className="font-mono text-[7px] bg-accent-blue text-[#131313] px-1 rounded animate-pulse font-bold">
                              {block.status}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
