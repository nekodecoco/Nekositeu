"use client";

import { useState } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import GlassCard from "@/components/ui/GlassCard";
import Modal from "@/components/ui/Modal";
import { AdminBadge } from "@/components/ui/AdminGate";
import type { ScheduleBlockRow, BlockColor } from "@/lib/supabase/types";
import { addTimeBlock, updateTimeBlock, deleteTimeBlock, type TimeBlockInput } from "./actions";

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
const COLORS: { value: BlockColor; label: string }[] = [
  { value: "gray", label: "Gray (Default)" },
  { value: "blue", label: "Blue (Focus)" },
  { value: "orange", label: "Orange (Review)" },
  { value: "peach", label: "Peach (Critical)" },
];

// Rows on the calendar grid map 1:1 to HOURS: 08:00 = row 1.
const hourToRow = (hour: string) => HOURS.indexOf(hour) + 1;

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

const EMPTY_FORM = {
  dayIndex: "0",
  title: "",
  subtitle: "",
  startHour: "09:00",
  endHour: "11:00",
  colorType: "gray" as BlockColor,
  status: "",
};

export default function ScheduleClient({ blocks }: { blocks: ScheduleBlockRow[] }) {
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

  // ── Add / edit form ──
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingBlock = blocks.find((b) => b.id === editingId) ?? null;
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formBusy, setFormBusy] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (block: ScheduleBlockRow) => {
    setEditingId(block.id);
    setForm({
      dayIndex: String(block.day_index),
      title: block.title,
      subtitle: block.subtitle ?? "",
      startHour: block.start_hour,
      endHour: block.end_hour,
      colorType: block.color_type,
      status: block.status ?? "",
    });
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setFormError("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rowStart = hourToRow(form.startHour);
    const rowEnd = hourToRow(form.endHour);
    if (rowEnd <= rowStart) {
      setFormError("End time must be after start time.");
      return;
    }

    const input: TimeBlockInput = {
      dayIndex: parseInt(form.dayIndex, 10),
      title: form.title,
      subtitle: form.subtitle,
      startHour: form.startHour,
      endHour: form.endHour,
      rowStart,
      rowEnd,
      colorType: form.colorType,
      status: form.status,
    };

    setFormBusy(true);
    setFormError("");
    const result = editingId
      ? await updateTimeBlock(editingId, input)
      : await addTimeBlock(input);
    setFormBusy(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }
    closeForm();
  };

  // ── Delete ──
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleDelete = async () => {
    if (!editingId) return;
    setDeleteBusy(true);
    const result = await deleteTimeBlock(editingId);
    setDeleteBusy(false);
    if (result.error) {
      setFormError(result.error);
      setConfirmingDelete(false);
      return;
    }
    setConfirmingDelete(false);
    closeForm();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-12 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
              Availability &amp; Logging
            </span>
            <AdminBadge />
          </div>
          <h1 className="font-hanken font-bold text-4xl md:text-5xl text-white">
            Developer Schedule
          </h1>
          <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed">
            A real-time display of design system builds, WebGL development, and general availability blocks. Visible only to you.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-semibold text-sm rounded-lg transition-colors duration-200 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Time Block
        </button>
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
              Time Blocking &amp; Flow
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
              const columnBlocks = blocks.filter(
                (item) => item.day_index === dayIdx
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
                  {isWeekend && columnBlocks.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/5 select-none pointer-events-none">
                      <Lock className="w-12 h-12" />
                    </div>
                  )}

                  {/* Render Day-specific Absolute Blocks */}
                  {columnBlocks.map((block) => {
                    // Map block background and text colors
                    let blockColorClass = "bg-white/5 border-white/10 text-white";
                    if (block.color_type === "blue") {
                      blockColorClass =
                        "bg-accent-blue/10 border-accent-blue/30 text-accent-blue shadow-[0_0_15px_rgba(159,202,255,0.05)]";
                    } else if (block.color_type === "orange") {
                      blockColorClass = "bg-accent-orange/10 border-accent-orange/30 text-accent-orange";
                    } else if (block.color_type === "peach") {
                      blockColorClass = "bg-accent-peach/10 border-accent-peach/30 text-accent-peach";
                    }

                    return (
                      <button
                        key={block.id}
                        onClick={() => openEdit(block)}
                        style={{
                          gridRowStart: block.row_start,
                          gridRowEnd: block.row_end,
                        }}
                        className={`absolute inset-x-1.5 my-1.5 p-3 rounded-lg border flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-[1.02] hover:z-20 transition-all duration-300 text-left ${blockColorClass}`}
                        aria-label={`Edit block: ${block.title}`}
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
                            {block.start_hour} - {block.end_hour}
                          </span>
                          {block.status && (
                            <span className="font-mono text-[7px] bg-accent-blue text-[#131313] px-1 rounded animate-pulse font-bold">
                              {block.status}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* ─────── Add / Edit block modal ─────── */}
      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={editingBlock ? `Edit — ${editingBlock.title}` : "Add Time Block"}
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Deep Focus: WebGL"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Render optimization"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Day
              </label>
              <select
                value={form.dayIndex}
                onChange={(e) => setForm({ ...form, dayIndex: e.target.value })}
                className="px-3 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              >
                {DAYS.map((day, idx) => (
                  <option key={day} value={idx}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Start
              </label>
              <select
                value={form.startHour}
                onChange={(e) => setForm({ ...form, startHour: e.target.value })}
                className="px-3 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              >
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                End
              </label>
              <select
                value={form.endHour}
                onChange={(e) => setForm({ ...form, endHour: e.target.value })}
                className="px-3 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              >
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Color
              </label>
              <select
                value={form.colorType}
                onChange={(e) =>
                  setForm({ ...form, colorType: e.target.value as BlockColor })
                }
                className="px-3 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              >
                {COLORS.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Status Label (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. IN PROGRESS"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
            </div>
          </div>

          {formError && (
            <p className="font-mono text-[10px] text-accent-peach">{formError}</p>
          )}

          <div className="flex gap-3 mt-2">
            {editingBlock && !confirmingDelete && (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="px-4 py-3 bg-accent-peach/10 hover:bg-accent-peach/20 border border-accent-peach/30 text-accent-peach font-hanken font-semibold text-sm rounded-lg transition-colors cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {editingBlock && confirmingDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteBusy}
                className="px-4 py-3 bg-accent-peach/20 hover:bg-accent-peach/30 border border-accent-peach/40 text-accent-peach font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                <AlertTriangle className="w-4 h-4" />
                {deleteBusy ? "Deleting…" : "Confirm delete"}
              </button>
            )}
            <button
              type="submit"
              disabled={formBusy}
              className="flex-1 py-3 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              {formBusy ? "Saving…" : editingBlock ? "Save Changes" : "Add Block"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
