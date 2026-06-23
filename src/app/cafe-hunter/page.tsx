"use client";

import { useState } from "react";
import { Coffee, Search, Star, Calendar, Plus, Sparkles, Loader } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

interface Cafe {
  id: string;
  name: string;
  rating: number;
  tags: string[];
  visitDate: string;
}

const INITIAL_CAFES: Cafe[] = [
  {
    id: "1",
    name: "Kuro Studio",
    rating: 5.0,
    tags: ["MINIMALIST", "SILENT", "BRUTALIST"],
    visitDate: "OCT 12, 2023",
  },
  {
    id: "2",
    name: "Draft House",
    rating: 4.8,
    tags: ["GOOD WIFI", "URBAN"],
    visitDate: "SEP 28, 2023",
  },
  {
    id: "3",
    name: "The Archive",
    rating: 4.5,
    tags: ["LIBRARY", "COZY"],
    visitDate: "AUG 15, 2023",
  },
  {
    id: "4",
    name: "Orbit Coffee",
    rating: 4.9,
    tags: ["MODERN", "SKYLINE"],
    visitDate: "JUL 04, 2023",
  },
  {
    id: "5",
    name: "Mono Lab",
    rating: 5.0,
    tags: ["MATCHA", "PRECISION"],
    visitDate: "JUN 22, 2023",
  },
  {
    id: "6",
    name: "Canvas Brews",
    rating: 4.7,
    tags: ["CREATIVE", "ART", "GOOD WIFI"],
    visitDate: "MAY 10, 2023",
  },
];

const POPULAR_TAGS = ["cozy", "good wifi", "matcha", "minimalist", "brutalist"];

export default function CafeHunterPage() {
  const [cafes, setCafes] = useState<Cafe[]>(INITIAL_CAFES);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    rating: "5.0",
    tags: "",
  });

  const filteredCafes = cafes.filter((cafe) => {
    // Search query match
    const matchesSearch = cafe.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Rating match
    const matchesRating = 
      ratingFilter === "all" || 
      (ratingFilter === "5.0" && cafe.rating === 5.0) ||
      (ratingFilter === "4.5+" && cafe.rating >= 4.5) ||
      (ratingFilter === "4.0+" && cafe.rating >= 4.0);

    // Tag match
    const matchesTag = 
      !activeTag || 
      cafe.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase());

    return matchesSearch && matchesRating && matchesTag;
  });

  const handleAddCafe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const parsedTags = formData.tags
      .split(",")
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);

    const newCafe: Cafe = {
      id: Date.now().toString(),
      name: formData.name,
      rating: parseFloat(formData.rating) || 5.0,
      tags: parsedTags.length > 0 ? parsedTags : ["MINIMALIST"],
      visitDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).toUpperCase(),
    };

    setCafes([newCafe, ...cafes]);
    setIsModalOpen(false);
    setFormData({ name: "", rating: "5.0", tags: "" });
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const additionalCafes: Cafe[] = [
        {
          id: "add-1",
          name: "Concrete Brews",
          rating: 4.6,
          tags: ["BRUTALIST", "SILENT"],
          visitDate: "APR 02, 2023",
        },
        {
          id: "add-2",
          name: "Grid Coffee",
          rating: 4.9,
          tags: ["MINIMALIST", "GOOD WIFI"],
          visitDate: "MAR 18, 2023",
        },
      ];
      setCafes((prev) => [...prev, ...additionalCafes]);
      setLoadingMore(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-12 w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
            Personal Curation
          </span>
          <h1 className="font-hanken font-bold text-4xl md:text-5xl text-white">
            Cafe Hunter
          </h1>
          <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed">
            A meticulous archive of third-wave coffee spaces, aesthetic interiors, and optimal remote work environments. Documenting geometry, natural lighting, and network speeds.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
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
        {filteredCafes.map((cafe) => (
          <GlassCard
            key={cafe.id}
            className="flex flex-col bg-[#1B1B1B]/40 hover:bg-[#1B1B1B]/80 transition-colors"
          >
            {/* Visual Cover Header */}
            <div className="h-44 relative bg-zinc-950 flex items-center justify-center border-b border-white/5 overflow-hidden">
              {/* Pattern Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              
              <Coffee className="w-10 h-10 text-accent-blue/30 relative z-10" />

              {/* Top Left rating badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[11px] text-accent-blue font-bold">
                <Star className="w-3 h-3 fill-accent-blue text-accent-blue" />
                {cafe.rating.toFixed(1)}
              </div>
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
                <span className="text-white font-medium">{cafe.visitDate}</span>
              </div>
            </div>
          </GlassCard>
        ))}

        {filteredCafes.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl">
            <Sparkles className="w-8 h-8 text-accent-blue/40 mx-auto mb-3" />
            <p className="font-inter text-[#A1A1A1]">No cafes match your current search parameters.</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {cafes.length <= 6 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-[#BFC7D5] hover:text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer min-w-[240px]"
          >
            {loadingMore ? (
              <>
                <Loader className="w-4 h-4 animate-spin text-accent-blue" />
                Scanning for more spots...
              </>
            ) : (
              "Load More Spots"
            )}
          </button>
        </div>
      )}

      {/* Add Cafe Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Cafe Spot"
      >
        <form onSubmit={handleAddCafe} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
              Cafe Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kuro Studio"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Rating
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="px-3 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              >
                <option value="5.0">5.0 Stars (Perfect)</option>
                <option value="4.8">4.8 Stars</option>
                <option value="4.5">4.5 Stars</option>
                <option value="4.0">4.0 Stars</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-[#BFC7D5] uppercase tracking-wider">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="cozy, silent, minimalist"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-white font-inter text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-bold text-sm rounded-lg transition-colors cursor-pointer"
          >
            Archive Spot
          </button>
        </form>
      </Modal>
    </div>
  );
}
