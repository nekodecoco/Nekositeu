"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Star,
  Coffee,
  Calendar,
  Sparkles,
  Pencil,
  Trash2,
  AlertTriangle,
  BookOpen,
  Camera,
  X,
} from "lucide-react";

import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useAdmin, AdminBadge } from "@/components/ui/AdminGate";
import { uploadPublicImage } from "@/lib/supabase/upload";
import type { CafeRow, CafePhotoRow } from "@/lib/supabase/types";
import {
  addCafe,
  updateCafe,
  deleteCafe,
  addCafePhoto,
  deleteCafePhoto,
  type CafeInput,
} from "./actions";

export type CafeWithPhotos = CafeRow & { cafe_photos: CafePhotoRow[] };

const POPULAR_TAGS = ["cozy", "good wifi", "matcha", "minimalist", "brutalist"];

function formatVisitDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_FORM = {
  name: "",
  rating: "5.0",
  tags: "",
  visitDate: todayIso(),
  journal: "",
};

export default function CafeHunterClient({ cafes }: { cafes: CafeWithPhotos[] }) {
  const { isAdmin, requestAccess } = useAdmin();

  // ── Filters ──
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredCafes = cafes.filter((cafe) => {
    const rating = Number(cafe.rating);
    const matchesSearch = cafe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "5.0" && rating === 5.0) ||
      (ratingFilter === "4.5+" && rating >= 4.5) ||
      (ratingFilter === "4.0+" && rating >= 4.0);
    const matchesTag =
      !activeTag ||
      cafe.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase());
    return matchesSearch && matchesRating && matchesTag;
  });

  // ── Detail modal (public) — track by id so revalidated data flows in ──
  const [detailId, setDetailId] = useState<string | null>(null);
  const detailCafe = cafes.find((c) => c.id === detailId) ?? null;

  // ── Add / edit form modal (admin) ──
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingCafe = cafes.find((c) => c.id === editingId) ?? null;
  const [form, setForm] = useState(EMPTY_FORM);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [formBusy, setFormBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAdd = () =>
    requestAccess(() => {
      setEditingId(null);
      setForm({ ...EMPTY_FORM, visitDate: todayIso() });
      setNewFiles([]);
      setNewPreviews([]);
      setFormError("");
      setFormOpen(true);
    });

  const openEdit = (cafe: CafeWithPhotos) =>
    requestAccess(() => {
      setEditingId(cafe.id);
      setForm({
        name: cafe.name,
        rating: Number(cafe.rating).toFixed(1),
        tags: cafe.tags.join(", "),
        visitDate: cafe.visit_date,
        journal: cafe.journal,
      });
      setNewFiles([]);
      setNewPreviews([]);
      setFormError("");
      setFormOpen(true);
    });

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setNewFiles([]);
    setNewPreviews([]);
    setFormError("");
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rating = Math.min(5, Math.max(0, parseFloat(form.rating) || 0));
    const input: CafeInput = {
      name: form.name,
      rating,
      tags: form.tags
        .split(",")
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean),
      visitDate: form.visitDate,
      journal: form.journal,
    };

    setFormBusy(true);
    setFormError("");
    try {
      let cafeId = editingId;
      if (editingId) {
        const result = await updateCafe(editingId, input);
        if (result.error) throw new Error(result.error);
      } else {
        const result = await addCafe(input);
        if (result.error || !result.id) throw new Error(result.error ?? "Failed to add cafe.");
        cafeId = result.id;
      }

      for (const file of newFiles) {
        const url = await uploadPublicImage("cafe-photos", cafeId!, file);
        const result = await addCafePhoto(cafeId!, url);
        if (result.error) throw new Error(result.error);
      }

      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setFormBusy(false);
    }
  };

  const handleDeleteExistingPhoto = async (photo: CafePhotoRow) => {
    const result = await deleteCafePhoto(photo.id, photo.image_url);
    if (result.error) setFormError(result.error);
  };

  // ── Delete cafe confirmation ──
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteCafeTarget = cafes.find((c) => c.id === deleteId) ?? null;
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const confirmDeleteCafe = async () => {
    if (!deleteCafeTarget) return;
    setDeleteBusy(true);
    setDeleteError("");
    const result = await deleteCafe(
      deleteCafeTarget.id,
      deleteCafeTarget.cafe_photos.map((p) => p.image_url)
    );
    setDeleteBusy(false);
    if (result.error) {
      setDeleteError(result.error);
      return;
    }
    setDeleteId(null);
    setDetailId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-12 w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
              Personal Curation
            </span>
            <AdminBadge />
          </div>
          <h1 className="font-hanken font-bold text-4xl md:text-5xl text-white">
            Cafe Hunter
          </h1>
          <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed">
            A meticulous archive of third-wave coffee spaces, aesthetic interiors, and optimal remote work environments. Documenting geometry, natural lighting, and network speeds.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-semibold text-sm rounded-lg transition-colors duration-200 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          Add New Cafe
        </button>
      </div>

      {/* Filter Toolbar */}
      <GlassCard hoverGlow={false} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#1B1B1B]/30">
        {/* Left Side Filter Options */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Rating Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#A1A1A1] uppercase tracking-wider">
              Rating
            </span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-1.5 rounded bg-zinc-900 border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-accent-blue"
            >
              <option value="all">All Ratings</option>
              <option value="5.0">5.0 Star Only</option>
              <option value="4.5+">4.5+ Stars</option>
              <option value="4.0+">4.0+ Stars</option>
            </select>
          </div>

          {/* Vertical Divider */}
          <span className="hidden md:inline h-6 w-[1px] bg-white/10" />

          {/* Tags Filter Chips */}
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase border transition-all duration-200 cursor-pointer ${
                !activeTag
                  ? "bg-accent-blue/15 text-accent-blue border-accent-blue/30"
                  : "bg-transparent text-[#BFC7D5] border-white/10 hover:border-white/20"
              }`}
            >
              all
            </button>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase border transition-all duration-200 cursor-pointer ${
                  activeTag === tag
                    ? "bg-accent-blue/15 text-accent-blue border-accent-blue/30"
                    : "bg-transparent text-[#BFC7D5] border-white/10 hover:border-white/20"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#A1A1A1]" />
          <input
            type="text"
            placeholder="Search cafes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-xs focus:outline-none focus:border-accent-blue placeholder-[#6B7280] transition-colors"
          />
        </div>
      </GlassCard>

      {/* Grid of Cafes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCafes.map((cafe) => {
          const cover = cafe.cafe_photos[0];
          return (
            <GlassCard
              key={cafe.id}
              className="flex flex-col bg-[#1B1B1B]/40 hover:bg-[#1B1B1B]/80 transition-colors cursor-pointer"
            >
              <button
                onClick={() => setDetailId(cafe.id)}
                className="text-left flex flex-col flex-grow cursor-pointer"
                aria-label={`Open ${cafe.name} journal`}
              >
                {/* Visual Cover Header */}
                <div className="h-44 relative bg-zinc-950 flex items-center justify-center border-b border-white/5 overflow-hidden">
                  {cover ? (
                    <Image
                      src={cover.image_url}
                      alt={cafe.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                      <Coffee className="w-10 h-10 text-accent-blue/30 relative z-10" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                  {/* Top Left rating badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[11px] text-accent-blue font-bold">
                    <Star className="w-3 h-3 fill-accent-blue text-accent-blue" />
                    {Number(cafe.rating).toFixed(1)}
                  </div>

                  {/* Journal indicator */}
                  {cafe.journal && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white/60">
                      <BookOpen className="w-3 h-3" />
                      JOURNAL
                    </div>
                  )}
                </div>

                {/* Cafe Details */}
                <div className="p-6 flex flex-col justify-between flex-grow gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-hanken font-bold text-xl text-white">
                      {cafe.name}
                    </h3>

                    {/* Category tags */}
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {cafe.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Visit Date footer */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 font-mono text-[10px] text-[#A1A1A1] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Visited
                    </span>
                    <span className="text-white font-medium">
                      {formatVisitDate(cafe.visit_date)}
                    </span>
                  </div>
                </div>
              </button>
            </GlassCard>
          );
        })}

        {filteredCafes.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl">
            <Sparkles className="w-8 h-8 text-accent-blue/40 mx-auto mb-3" />
            <p className="font-inter text-[#A1A1A1]">No cafes match your current search parameters.</p>
          </div>
        )}
      </div>

      {/* ─────── Detail modal (journal + photos) ─────── */}
      <Modal
        isOpen={!!detailCafe}
        onClose={() => setDetailId(null)}
        title={detailCafe?.name ?? ""}
      >
        {detailCafe && (
          <div className="flex flex-col gap-5">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-black/40 border border-white/10 font-mono text-[11px] text-accent-blue font-bold">
                <Star className="w-3 h-3 fill-accent-blue text-accent-blue" />
                {Number(detailCafe.rating).toFixed(1)}
              </span>
              <span className="font-mono text-[10px] text-[#A1A1A1] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Visited {formatVisitDate(detailCafe.visit_date)}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {detailCafe.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Journal */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" />
                Visit Journal
              </span>
              {detailCafe.journal ? (
                <p className="font-inter text-sm text-[#D0D0D0] leading-relaxed whitespace-pre-wrap">
                  {detailCafe.journal}
                </p>
              ) : (
                <p className="font-inter text-sm text-[#6B7280] italic">
                  No journal entry for this visit yet.
                </p>
              )}
            </div>

            {/* Photos */}
            {detailCafe.cafe_photos.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3 h-3" />
                  Photos
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {detailCafe.cafe_photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-lg overflow-hidden border border-white/5"
                    >
                      <Image
                        src={photo.image_url}
                        alt={detailCafe.name}
                        fill
                        sizes="150px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin actions */}
            {isAdmin && (
              <div className="flex gap-3 border-t border-white/5 pt-4">
                <button
                  onClick={() => { setDetailId(null); openEdit(detailCafe); }}
                  className="flex-1 py-2.5 border border-white/10 hover:border-accent-blue/40 text-[#BFC7D5] hover:text-accent-blue font-hanken font-semibold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => { setDeleteId(detailCafe.id); setDeleteError(""); }}
                  className="flex-1 py-2.5 bg-accent-peach/10 hover:bg-accent-peach/20 border border-accent-peach/30 text-accent-peach font-hanken font-semibold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ─────── Add / Edit modal ─────── */}
      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={editingCafe ? `Edit — ${editingCafe.name}` : "Add New Cafe Spot"}
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Cafe Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kuro Studio"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Rating (0–5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                required
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Visit Date
              </label>
              <input
                type="date"
                required
                value={form.visitDate}
                onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="cozy, silent, minimalist"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              Visit Journal
            </label>
            <textarea
              rows={4}
              placeholder="Notes about the visit — coffee, light, seats, sounds..."
              value={form.journal}
              onChange={(e) => setForm({ ...form, journal: e.target.value })}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors resize-y"
            />
          </div>

          {/* Existing photos (edit mode) */}
          {editingCafe && editingCafe.cafe_photos.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Photos
              </span>
              <div className="grid grid-cols-4 gap-2">
                {editingCafe.cafe_photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-lg overflow-hidden border border-white/5 group"
                  >
                    <Image
                      src={photo.image_url}
                      alt=""
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingPhoto(photo)}
                      aria-label="Remove photo"
                      className="absolute top-1 right-1 p-1 rounded bg-black/70 text-white/70 hover:text-accent-peach opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New photo previews + picker */}
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3 h-3" />
              Add Photos
            </span>
            <div className="grid grid-cols-4 gap-2">
              {newPreviews.map((preview, i) => (
                <div
                  key={preview}
                  className="relative aspect-square rounded-lg overflow-hidden border border-accent-blue/30 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    aria-label="Remove selected photo"
                    className="absolute top-1 right-1 p-1 rounded bg-black/70 text-white/70 hover:text-accent-peach cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-white/10 hover:border-white/25 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                aria-label="Choose photos"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFilesChange}
            />
          </div>

          {formError && (
            <p className="font-mono text-[10px] text-accent-peach">{formError}</p>
          )}

          <button
            type="submit"
            disabled={formBusy}
            className="mt-2 w-full py-3 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            {formBusy ? "Saving…" : editingCafe ? "Save Changes" : "Archive Spot"}
          </button>
        </form>
      </Modal>

      {/* ─────── Delete confirmation ─────── */}
      <Modal
        isOpen={!!deleteCafeTarget}
        onClose={() => setDeleteId(null)}
        title="Delete Cafe?"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent-peach/5 border border-accent-peach/20">
            <AlertTriangle className="w-4 h-4 text-accent-peach flex-shrink-0 mt-0.5" />
            <p className="font-inter text-sm text-[#BFC7D5] leading-relaxed">
              This permanently deletes <span className="text-white font-medium">{deleteCafeTarget?.name}</span>, its journal entry, and all its photos. This action cannot be undone.
            </p>
          </div>
          {deleteError && (
            <p className="font-mono text-[10px] text-accent-peach">{deleteError}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 border border-white/10 hover:border-white/20 text-[#BFC7D5] hover:text-white font-hanken font-semibold text-sm rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteCafe}
              disabled={deleteBusy}
              className="flex-1 py-2.5 bg-accent-peach/15 hover:bg-accent-peach/25 border border-accent-peach/30 text-accent-peach font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
            >
              <Trash2 className="w-4 h-4" />
              {deleteBusy ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
