"use client";

import { useState } from "react";
import {
  Plus,
  Code2,
  ExternalLink,
  Globe,
  Sparkles,
  Pencil,
  Trash2,
  AlertTriangle,
  Star,
} from "lucide-react";

import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useAdmin, AdminBadge } from "@/components/ui/AdminGate";
import type { ProjectRow, ProjectStatus } from "@/lib/supabase/types";
import { addProject, updateProject, deleteProject, type ProjectInput } from "./actions";

const FILTERS = ["ALL_SYSTEMS", "REACT", "TYPESCRIPT", "WEBGL", "LIVE"];

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "LIVE" as ProjectStatus,
  techTags: "",
  liveUrl: "",
  featured: false,
  sortOrder: "0",
};

export default function ProjectsClient({ projects }: { projects: ProjectRow[] }) {
  const { isAdmin, requestAccess } = useAdmin();

  const [activeFilter, setActiveFilter] = useState("ALL_SYSTEMS");

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "ALL_SYSTEMS") return true;
    if (activeFilter === "LIVE") return project.status === "LIVE";
    return project.tags.some(
      (tag) => tag.toLowerCase() === activeFilter.toLowerCase()
    );
  });

  // ── Add / edit form ──
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingProject = projects.find((p) => p.id === editingId) ?? null;
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formBusy, setFormBusy] = useState(false);

  const openAdd = () =>
    requestAccess(() => {
      setEditingId(null);
      setForm(EMPTY_FORM);
      setFormError("");
      setFormOpen(true);
    });

  const openEdit = (project: ProjectRow) =>
    requestAccess(() => {
      setEditingId(project.id);
      setForm({
        title: project.title,
        description: project.description,
        status: project.status,
        techTags: project.tech_tags.join(", "),
        liveUrl: project.live_url ?? "",
        featured: project.featured,
        sortOrder: String(project.sort_order),
      });
      setFormError("");
      setFormOpen(true);
    });

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setFormError("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input: ProjectInput = {
      title: form.title,
      description: form.description,
      status: form.status,
      techTags: form.techTags
        .split(",")
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean),
      liveUrl: form.liveUrl,
      featured: form.featured,
      sortOrder: parseInt(form.sortOrder, 10) || 0,
    };

    setFormBusy(true);
    setFormError("");
    const result = editingId
      ? await updateProject(editingId, input)
      : await addProject(input);
    setFormBusy(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }
    closeForm();
  };

  // ── Delete confirmation ──
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteTarget = projects.find((p) => p.id === deleteId) ?? null;
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    setDeleteError("");
    const result = await deleteProject(deleteTarget.id);
    setDeleteBusy(false);
    if (result.error) {
      setDeleteError(result.error);
      return;
    }
    setDeleteId(null);
  };

  const getStatusBadgeVariant = (status: ProjectStatus) => {
    switch (status) {
      case "LIVE":
        return "accent-blue";
      case "PROGRESS":
        return "accent-orange";
      case "ARCHIVED":
        return "default";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-12 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
              Product Portfolio
            </span>
            <AdminBadge />
          </div>
          <h1 className="font-hanken font-bold text-4xl md:text-5xl text-white">
            Crafted Works
          </h1>
          <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed">
            A curated selection of digital experiments and professional projects focusing on performance, aesthetics, and user utility.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-semibold text-sm rounded-lg transition-colors duration-200 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 font-mono text-[11px] tracking-wider rounded-full border transition-all duration-200 cursor-pointer ${
              activeFilter === filter
                ? "bg-accent-blue/10 text-accent-blue border-accent-blue/35 shadow-[0_0_12px_rgba(159,202,255,0.1)]"
                : "bg-transparent text-[#BFC7D5] border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            {filter.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <GlassCard
            key={project.id}
            className="flex flex-col h-full bg-[#1B1B1B]/40 hover:bg-[#1B1B1B]/80 transition-colors group"
          >
            {/* Card Graphic/Cover (CSS-based visual block instead of generic image) */}
            <div className="h-48 relative overflow-hidden bg-zinc-950 flex items-center justify-center border-b border-white/5">
              {/* Pattern Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

              {/* Glowing Ambient light */}
              <div className={`absolute w-32 h-32 rounded-full blur-3xl opacity-20 ${
                project.status === "LIVE" ? "bg-accent-blue" : project.status === "PROGRESS" ? "bg-accent-orange" : "bg-zinc-600"
              }`} />

              {/* Big Icon Visual */}
              <Code2 className="w-12 h-12 text-[#BFC7D5]/40 relative z-10" />

              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-accent-orange/30 font-mono text-[10px] text-accent-orange font-bold">
                  <Star className="w-3 h-3 fill-accent-orange text-accent-orange" />
                  FEATURED
                </div>
              )}

              {/* Admin actions */}
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <button
                    onClick={() => openEdit(project)}
                    className="p-1.5 rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-white/10 text-[#BFC7D5] hover:text-accent-blue hover:border-accent-blue/30 transition-colors cursor-pointer"
                    aria-label={`Edit ${project.title}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setDeleteId(project.id); setDeleteError(""); }}
                    className="p-1.5 rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-white/10 text-[#BFC7D5] hover:text-accent-peach hover:border-accent-peach/30 transition-colors cursor-pointer"
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-grow gap-4 justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-hanken font-bold text-xl text-white">
                    {project.title}
                  </h3>
                  <Badge variant={getStatusBadgeVariant(project.status)}>
                    {project.status}
                  </Badge>
                </div>

                <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tech Badges & Links */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-wrap gap-2">
                  {project.tech_tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  {project.status === "ARCHIVED" || !project.live_url ? (
                    <span className="font-mono text-xs text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      {project.status === "ARCHIVED" ? "Offline" : "No link yet"}
                    </span>
                  ) : (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs font-semibold text-accent-blue hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {project.status === "LIVE" ? "View Live" : "Preview"}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <span className="font-mono text-[10px] text-white/20">
                    ID-{project.id.slice(0, 4).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl">
            <Sparkles className="w-8 h-8 text-accent-blue/40 mx-auto mb-3" />
            <p className="font-inter text-[#A1A1A1]">No works found matching the active filter.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={editingProject ? `Edit — ${editingProject.title}` : "Add New Project"}
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Project Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Neural Nexus"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide a brief summary of this work..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as ProjectStatus })
                }
                className="px-3 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              >
                <option value="LIVE">Live</option>
                <option value="PROGRESS">In Progress</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Tech Stack
              </label>
              <input
                type="text"
                placeholder="Comma separated: Next.js, Rust"
                value={form.techTags}
                onChange={(e) => setForm({ ...form, techTags: e.target.value })}
                className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Live URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <label className="flex items-center gap-2.5 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded accent-[#9FCAFF] cursor-pointer"
              />
              <span className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3 h-3" />
                Featured (pin to top)
              </span>
            </label>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
            </div>
          </div>

          {formError && (
            <p className="font-mono text-[10px] text-accent-peach">{formError}</p>
          )}

          <button
            type="submit"
            disabled={formBusy}
            className="mt-2 w-full py-3 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            {formBusy ? "Saving…" : editingProject ? "Save Changes" : "Create Project Record"}
          </button>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteId(null)}
        title="Delete Project?"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent-peach/5 border border-accent-peach/20">
            <AlertTriangle className="w-4 h-4 text-accent-peach flex-shrink-0 mt-0.5" />
            <p className="font-inter text-sm text-[#BFC7D5] leading-relaxed">
              This permanently deletes <span className="text-white font-medium">{deleteTarget?.title}</span> from the portfolio. This action cannot be undone.
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
              onClick={confirmDelete}
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
