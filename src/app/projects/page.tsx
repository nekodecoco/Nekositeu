"use client";

import { useState } from "react";
import { Plus, ExternalLink, Code2, Globe, Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "LIVE" | "PROGRESS" | "ARCHIVED";
  tags: string[];
  liveUrl?: string;
  techTags: string[];
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Neural Nexus",
    description: "An advanced AI-driven visualization tool mapping complex neural networks in real-time.",
    status: "LIVE",
    tags: ["NEXT.JS", "THREE.JS", "TAILWIND", "REACT", "TYPESCRIPT", "WEBGL"],
    liveUrl: "https://neural-nexus.alexchen.dev",
    techTags: ["NEXT.JS", "THREE.JS", "TAILWIND"],
  },
  {
    id: "2",
    title: "Ethereal Task",
    description: "A minimalist productivity suite focusing on deep work, focus tracking, and flow-state analytics.",
    status: "PROGRESS",
    tags: ["REACT NATIVE", "EXPO", "SUPABASE", "TYPESCRIPT", "REACT"],
    liveUrl: "https://ethereal.alexchen.dev",
    techTags: ["REACT NATIVE", "EXPO", "SUPABASE"],
  },
  {
    id: "3",
    title: "Void Ledger",
    description: "A legacy experimental blockchain explorer for sidechain assets. Optimized for cryptographic audits.",
    status: "ARCHIVED",
    tags: ["RUST", "WASM", "D3.JS", "TYPESCRIPT"],
    techTags: ["RUST", "WASM", "D3.JS"],
  },
];

const FILTERS = ["ALL_SYSTEMS", "REACT", "TYPESCRIPT", "WEBGL", "LIVE"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeFilter, setActiveFilter] = useState("ALL_SYSTEMS");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "LIVE" as "LIVE" | "PROGRESS" | "ARCHIVED",
    techTags: "",
    liveUrl: "",
  });

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "ALL_SYSTEMS") return true;
    if (activeFilter === "LIVE") return project.status === "LIVE";
    // Check if any tag matches the filter (case insensitive comparison)
    return project.tags.some(
      (tag) => tag.toLowerCase() === activeFilter.toLowerCase()
    );
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const parsedTech = formData.techTags
      .split(",")
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);

    const newProject: Project = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      techTags: parsedTech.length > 0 ? parsedTech.slice(0, 3) : ["NEXT.JS"],
      tags: [formData.status, ...parsedTech, "TYPESCRIPT", "REACT"], // broad tags for filtering
      liveUrl: formData.liveUrl || undefined,
    };

    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
    setFormData({
      title: "",
      description: "",
      status: "LIVE",
      techTags: "",
      liveUrl: "",
    });
  };

  const getStatusBadgeVariant = (status: Project["status"]) => {
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
          <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
            Product Portfolio
          </span>
          <h1 className="font-hanken font-bold text-4xl md:text-5xl text-white">
            Crafted Works
          </h1>
          <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed">
            A curated selection of digital experiments and professional projects focusing on performance, aesthetics, and user utility.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
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
            className="flex flex-col h-full bg-[#1B1B1B]/40 hover:bg-[#1B1B1B]/80 transition-colors"
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
                  {project.techTags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  {project.status === "ARCHIVED" ? (
                    <span className="font-mono text-xs text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      Offline
                    </span>
                  ) : (
                    <a
                      href={project.liveUrl || "#"}
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
                    ID-{project.id.slice(0, 4)}
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

      {/* Add Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Project"
      >
        <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Project Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Neural Nexus"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Project["status"],
                  })
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
                value={formData.techTags}
                onChange={(e) => setFormData({ ...formData, techTags: e.target.value })}
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
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer"
          >
            Create Project Record
          </button>
        </form>
      </Modal>
    </div>
  );
}
