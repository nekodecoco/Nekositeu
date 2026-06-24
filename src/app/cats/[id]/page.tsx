"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Heart,
  Calendar,
  Tag,
  MessageSquare,
  Camera,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { use } from "react";

import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useAdmin, AdminBadge } from "@/components/ui/AdminGate";
import { CATS, SEED_PHOTOS, type CatPhoto } from "@/lib/cats-data";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Gradient visual placeholder for cat avatar ──────────────────────────────

function CatAvatar({
  cat,
  size = "lg",
}: {
  cat: { gradientFrom: string; gradientTo: string; name: string };
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? "w-40 h-40 md:w-52 md:h-52" : "w-16 h-16";
  return (
    <div
      className={`${dim} rounded-2xl bg-gradient-to-br ${cat.gradientFrom} ${cat.gradientTo} flex items-center justify-center flex-shrink-0 relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-10" />
      <Heart className="w-10 h-10 text-white/30 relative z-10" />
    </div>
  );
}

// ─── Photo tile with hover controls ──────────────────────────────────────────

function PhotoTile({
  photo,
  isAdmin,
  onEdit,
  onDelete,
}: {
  photo: CatPhoto;
  isAdmin: boolean;
  onEdit: (photo: CatPhoto) => void;
  onDelete: (photo: CatPhoto) => void;
}) {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-white/5 bg-zinc-900 aspect-square">
      {/* Visual placeholder (gradient) since we're working with mock data */}
      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
        <Camera className="w-8 h-8 text-white/15" />
      </div>

      {/* Caption overlay at bottom */}
      {photo.caption && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-3">
          <p className="font-inter text-xs text-white/90 leading-snug line-clamp-2">
            {photo.caption}
          </p>
        </div>
      )}

      {/* Date badge */}
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm font-mono text-[9px] text-white/60">
        {formatDate(photo.created_at)}
      </div>

      {/* Admin action buttons — visible on hover */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(photo)}
            className="p-1.5 rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-white/10 text-[#BFC7D5] hover:text-accent-blue hover:border-accent-blue/30 transition-colors cursor-pointer"
            aria-label="Edit caption"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(photo)}
            className="p-1.5 rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-white/10 text-[#BFC7D5] hover:text-accent-peach hover:border-accent-peach/30 transition-colors cursor-pointer"
            aria-label="Delete photo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CatProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const cat = CATS.find((c) => c.id === id);
  if (!cat) notFound();

  const { isAdmin, requestAccess } = useAdmin();

  // Photo state — initialised from seed data filtered to this cat
  const [photos, setPhotos] = useState<CatPhoto[]>(
    SEED_PHOTOS.filter((p) => p.cat_id === id).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  );

  // ── Add modal ──
  const [addOpen, setAddOpen] = useState(false);
  const [addCaption, setAddCaption] = useState("");
  const [addPreview, setAddPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddPreview(URL.createObjectURL(file));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPhoto: CatPhoto = {
      id: `p-${Date.now()}`,
      cat_id: id,
      image_url: addPreview || "",
      caption: addCaption.trim() || undefined,
      created_at: new Date().toISOString(),
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    setAddOpen(false);
    setAddCaption("");
    setAddPreview("");
  };

  // ── Edit modal ──
  const [editTarget, setEditTarget] = useState<CatPhoto | null>(null);
  const [editCaption, setEditCaption] = useState("");

  const openEdit = (photo: CatPhoto) => {
    setEditTarget(photo);
    setEditCaption(photo.caption ?? "");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === editTarget.id
          ? { ...p, caption: editCaption.trim() || undefined }
          : p
      )
    );
    setEditTarget(null);
  };

  // ── Delete confirmation ──
  const [deleteTarget, setDeleteTarget] = useState<CatPhoto | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setPhotos((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // ── Guard: wrap admin actions with requestAccess ──
  const guardedAdd = () => requestAccess(() => setAddOpen(true));
  const guardedEdit = (photo: CatPhoto) =>
    requestAccess(() => openEdit(photo));
  const guardedDelete = (photo: CatPhoto) =>
    requestAccess(() => setDeleteTarget(photo));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12 w-full">
      {/* ── Back navigation ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/cats"
          className="flex items-center gap-2 font-mono text-xs text-[#BFC7D5] hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to The Feline Archive
        </Link>
        <AdminBadge />
      </div>

      {/* ── Profile header ── */}
      <GlassCard hoverGlow={false} className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <CatAvatar cat={cat} size="lg" />

          <div className="flex flex-col gap-5 flex-grow">
            {/* Resident tag + name */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
                {cat.residentNumber}
              </span>
              <h1 className="font-hanken font-bold text-4xl md:text-5xl text-white">
                {cat.name}
              </h1>
            </div>

            {/* Metadata row */}
            <div className="flex flex-wrap gap-4 font-mono text-xs text-[#BFC7D5]">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-accent-blue" />
                {cat.breed}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent-blue" />
                Arrived {cat.arrivalDate}
              </span>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-accent-blue" />
                Birthday {formatDate(cat.birthday)}
              </span>
            </div>

            {/* Personality pill */}
            <div className="flex gap-2 flex-wrap">
              {cat.personality.split("·").map((trait) => (
                <Badge key={trait} variant="accent-blue">
                  {trait.trim()}
                </Badge>
              ))}
            </div>

            {/* Bio */}
            <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed max-w-2xl">
              {cat.description}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ── Photo feed header ── */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
            Photo Archive
          </span>
          <h2 className="font-hanken font-bold text-2xl text-white">
            {cat.name}&apos;s Gallery
            <span className="ml-3 font-mono text-sm font-normal text-[#6B7280]">
              {photos.length} photo{photos.length !== 1 ? "s" : ""}
            </span>
          </h2>
        </div>

        {/* Admin hint when not authenticated */}
        {!isAdmin && (
          <button
            onClick={() => requestAccess(() => { })}
            className="flex items-center gap-1.5 font-mono text-[10px] text-[#6B7280] hover:text-accent-blue transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin login to edit
          </button>
        )}
      </div>

      {/* ── Photo grid ── */}
      {photos.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-3">
          <Camera className="w-10 h-10 text-accent-blue/30" />
          <p className="font-inter text-[#A1A1A1]">No photos yet.</p>
          <button
            onClick={guardedAdd}
            className="font-mono text-xs text-accent-blue hover:text-white transition-colors cursor-pointer"
          >
            + Add the first photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <PhotoTile
              key={photo.id}
              photo={photo}
              isAdmin={isAdmin}
              onEdit={guardedEdit}
              onDelete={guardedDelete}
            />
          ))}
        </div>
      )}

      {/* ── Floating + button (always visible; triggers admin gate) ── */}
      <button
        onClick={guardedAdd}
        aria-label="Add photo"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#E2E2E2] hover:bg-white text-[#131313] flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-200 cursor-pointer z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ─────── Modals ─────── */}

      {/* Add photo */}
      <Modal
        isOpen={addOpen}
        onClose={() => { setAddOpen(false); setAddCaption(""); setAddFile(null); setAddPreview(""); }}
        title={`Add Photo — ${cat.name}`}
      >
        <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
          {/* File picker */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${addPreview
                ? "border-accent-blue/40"
                : "border-white/10 hover:border-white/20"
              } overflow-hidden`}
          >
            {addPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={addPreview}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <>
                <Camera className="w-8 h-8 text-white/20" />
                <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
                  Click to choose a photo
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Caption */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3" />
              Caption (optional)
            </label>
            <input
              type="text"
              placeholder="Add a note about this moment..."
              value={addCaption}
              onChange={(e) => setAddCaption(e.target.value)}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="mt-1 w-full py-2.5 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer"
          >
            Save to Collection
          </button>
        </form>
      </Modal>

      {/* Edit caption */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Caption"
      >
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Caption
            </label>
            <input
              type="text"
              autoFocus
              placeholder="Write a caption..."
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="mt-1 w-full py-2.5 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer"
          >
            Update Caption
          </button>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Photo?"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent-peach/5 border border-accent-peach/20">
            <AlertTriangle className="w-4 h-4 text-accent-peach flex-shrink-0 mt-0.5" />
            <p className="font-inter text-sm text-[#BFC7D5] leading-relaxed">
              This will permanently delete the photo and its caption. This
              action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-2.5 border border-white/10 hover:border-white/20 text-[#BFC7D5] hover:text-white font-hanken font-semibold text-sm rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-2.5 bg-accent-peach/15 hover:bg-accent-peach/25 border border-accent-peach/30 text-accent-peach font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
