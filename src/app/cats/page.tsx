import { Heart, Sparkles, Calendar, Tag } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

interface CatResident {
  id: string;
  residentNumber: string;
  name: string;
  breed: string;
  arrivalDate: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

const CATS: CatResident[] = [
  {
    id: "c1",
    residentNumber: "RESIDENT 01",
    name: "Shadow",
    breed: "Russian Blue",
    arrivalDate: "June 12, 2021",
    description: "Obsessive code auditor and desk supervisor. Enjoys heat vents, mechanical keyboard clicks, and swatting at yarn threads during Figma sessions.",
    gradientFrom: "from-zinc-700",
    gradientTo: "to-slate-900",
  },
  {
    id: "c2",
    residentNumber: "RESIDENT 02",
    name: "Marmalade",
    breed: "Ginger Tabby",
    arrivalDate: "October 04, 2019",
    description: "Head of morale and physical comfort. Specializes in sitting directly on layout specs, loud purring during video calls, and cataloging ambient light patches.",
    gradientFrom: "from-orange-500/30",
    gradientTo: "to-amber-950/80",
  },
  {
    id: "c3",
    residentNumber: "RESIDENT 03",
    name: "Pixel",
    breed: "Calico",
    arrivalDate: "March 15, 2022",
    description: "Quality assurance manager. Expert in micro-movement tracking, testing structural integrity of cardboard mockups, and general QA tasks around the studio.",
    gradientFrom: "from-rose-500/20",
    gradientTo: "to-neutral-900",
  },
];

export default function CatsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-16 w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-8 max-w-2xl">
        <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
          Studio Companions
        </span>
        <h1 className="font-hanken font-bold text-4xl md:text-5xl text-white">
          The Feline Archive
        </h1>
        <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed">
          A curated photographic and behavioral journal of the resident assistants. Captured in studio fidelity, documented with obsessive behavioral logs.
        </p>
      </div>

      {/* Cat Cards Scrolling Feed */}
      <div className="flex flex-col gap-12">
        {CATS.map((cat, index) => {
          const isEven = index % 2 === 0;
          return (
            <GlassCard
              key={cat.id}
              hoverGlow={true}
              className={`flex flex-col lg:flex-row overflow-hidden ${
                isEven ? "" : "lg:flex-row-reverse"
              }`}
            >
              {/* Graphic/Avatar Container (Instead of missing images, we render beautiful animated HSL visual block) */}
              <div className={`w-full lg:w-1/2 h-80 lg:h-auto bg-gradient-to-br ${cat.gradientFrom} ${cat.gradientTo} flex items-center justify-center relative`}>
                {/* Visual grid overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                
                {/* Abstract shape rendering */}
                <div className="relative z-10 text-white/40 flex flex-col items-center gap-2">
                  <Heart className="w-16 h-16 animate-pulse" />
                  <span className="font-mono text-[10px] tracking-widest uppercase text-white/50">
                    {cat.name} Portrait Visual
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-between gap-6">
                
                {/* Text Block */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-accent-blue tracking-widest uppercase font-medium">
                      {cat.residentNumber}
                    </span>
                    <Badge variant="outline">Active Assistant</Badge>
                  </div>

                  <h2 className="font-hanken font-bold text-3xl md:text-4xl text-white">
                    {cat.name}
                  </h2>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-4 mt-2 font-mono text-xs text-[#BFC7D5]">
                    <span className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-accent-blue" />
                      {cat.breed}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent-blue" />
                      Arrived {cat.arrivalDate}
                    </span>
                  </div>

                  <p className="font-inter text-base text-[#A1A1A1] leading-relaxed mt-4">
                    {cat.description}
                  </p>
                </div>

                {/* Explore button/footer */}
                <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                  <button className="font-mono text-xs text-accent-blue font-semibold uppercase tracking-wider hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                    Explore behavioral log
                    <Sparkles className="w-4.5 h-4.5" />
                  </button>
                  
                  <span className="font-mono text-[10px] text-white/20">
                    QA-CONFIRMED
                  </span>
                </div>

              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
