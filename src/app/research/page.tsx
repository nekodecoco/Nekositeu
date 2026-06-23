import { Award, Layers, Cpu, ArrowUpRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

interface ResearchPaper {
  id: string;
  category: "ACCESSIBILITY" | "AI INTERACTION" | "DESIGN SYSTEMS";
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
}

const PAPERS: ResearchPaper[] = [
  {
    id: "r1",
    category: "DESIGN SYSTEMS",
    title: "Atomic Tokens: Scaling Multi-Brand Systems in WebGL Environments",
    excerpt: "An analysis of design token serialization patterns, performance benchmarks in high-drawcall scenes, and auto-mapping pipelines.",
    readTime: "8 min read",
    date: "MARCH 2024",
  },
  {
    id: "r2",
    category: "AI INTERACTION",
    title: "Predictive Layouts: Handoff Paradigms for LLM UI Generation",
    excerpt: "Exploring the UX transitions of real-time schema generation. How skeleton screens and structural locking reduce cognitive load during runtime layout generation.",
    readTime: "12 min read",
    date: "JANUARY 2024",
  },
  {
    id: "r3",
    category: "ACCESSIBILITY",
    title: "A11y Audits: Screen Readers in Interactive Canvas Interfaces",
    excerpt: "A comprehensive guide on implementing aria-live regions and custom keyboard focus rings on complex, raw graphics contexts.",
    readTime: "6 min read",
    date: "NOVEMBER 2023",
  },
];

export default function ResearchPage() {
  const getCategoryIcon = (category: ResearchPaper["category"]) => {
    switch (category) {
      case "DESIGN SYSTEMS":
        return <Layers className="w-5 h-5 text-accent-blue" />;
      case "AI INTERACTION":
        return <Cpu className="w-5 h-5 text-accent-peach" />;
      case "ACCESSIBILITY":
        return <Award className="w-5 h-5 text-accent-orange" />;
    }
  };

  const getCategoryVariant = (category: ResearchPaper["category"]) => {
    switch (category) {
      case "DESIGN SYSTEMS":
        return "accent-blue";
      case "AI INTERACTION":
        return "accent-peach";
      case "ACCESSIBILITY":
        return "accent-orange";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-12 w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-8 max-w-2xl">
        <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
          Academic & UX Writing
        </span>
        <h1 className="font-hanken font-bold text-4xl md:text-5xl text-white">
          Research Logs
        </h1>
        <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed">
          Exploring UX patterns, accessibility standards, and the future of human-AI collaboration. Blending technical engineering audits with visual design philosophy.
        </p>
      </div>

      {/* Main Papers Layout */}
      <div className="flex flex-col gap-6">
        {PAPERS.map((paper) => (
          <GlassCard
            key={paper.id}
            className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:bg-white/2 cursor-pointer group"
          >
            <div className="flex flex-col md:flex-row items-start gap-6 md:max-w-4xl">
              {/* Category Icon Block */}
              <div className="p-4 rounded-xl bg-white/2 border border-white/5 flex-shrink-0">
                {getCategoryIcon(paper.category)}
              </div>

              {/* Text metadata */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Badge variant={getCategoryVariant(paper.category)}>
                    {paper.category}
                  </Badge>
                  <span className="font-mono text-[10px] text-[#A1A1A1] tracking-wider">
                    {paper.date}
                  </span>
                </div>

                <h3 className="font-hanken font-bold text-xl text-white group-hover:text-accent-blue transition-colors">
                  {paper.title}
                </h3>

                <p className="font-inter text-sm text-[#A1A1A1] leading-relaxed">
                  {paper.excerpt}
                </p>
              </div>
            </div>

            {/* Read Time & Action */}
            <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t border-white/5 md:border-t-0 pt-4 md:pt-0">
              <span className="font-mono text-xs text-[#BFC7D5] uppercase tracking-wider">
                {paper.readTime}
              </span>
              <span className="text-accent-blue group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200">
                <ArrowUpRight className="w-5 h-5" />
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
