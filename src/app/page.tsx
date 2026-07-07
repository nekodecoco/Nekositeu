import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code, Calendar, Eye, Compass, Heart } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-24 md:gap-32 w-full">

      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="flex flex-col items-start gap-6 max-w-2xl">
          {/* Availability Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/3 border border-white/5 font-mono text-xs font-medium text-accent-blue tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent-blue animate-blink" />
            AVAILABLE FOR PROJECTS
          </div>

          {/* Heading */}
          <h1 className="font-hanken font-bold text-5xl md:text-7xl leading-tight text-white tracking-tight">
            I&apos;m Nikko Alferez.
            <span className="block text-accent-blue mt-1">
              Designer, Coder & Educator.
            </span>
          </h1>

          {/* Subtext */}
          <p className="font-inter text-lg md:text-xl text-[#A1A1A1] leading-relaxed">
            Crafting immersive digital experiences through minimalist aesthetics and high-performance engineering. Focused on the intersection of human-centric design and creative technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-4 w-full sm:w-auto">
            <Link
              href="/projects"
              className="px-8 py-3.5 bg-[#E2E2E2] hover:bg-white text-[#131313] font-hanken font-semibold text-sm rounded-lg transition-colors duration-200 flex items-center gap-2 group cursor-pointer"
            >
              View Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="mailto:contact@nikko.alferez@gmail.com"
              className="px-8 py-3.5 bg-transparent border border-white/10 hover:border-white/20 text-white font-hanken font-semibold text-sm rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Contact Me
            </Link>
          </div>
        </div>

        {/* Right Content - Profile Avatar with Glow */}
        <div className="relative flex-shrink-0">
          {/* Blurred Accent Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/40 to-transparent rounded-full blur-2xl opacity-40 scale-110 pointer-events-none" />

          {/* Avatar border wrapper */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 p-2 bg-[#1F1F1F] border-2 border-white/8 rounded-full shadow-2xl overflow-hidden">
            <Image
              src="/formal.jpg"
              alt="Nikko Alferez Avatar"
              fill
              className="object-cover rounded-full filter grayscale hover:grayscale-0 transition-all duration-500"
              priority
            />
          </div>
        </div>
      </section>

      {/* Bio / Philosophy Section */}
      <section className="max-w-3xl border-l-2 border-accent-blue/30 pl-8 md:pl-12">
        <h2 className="font-hanken font-semibold text-xl text-accent-blue mb-4 tracking-wide uppercase">
          Philosophy
        </h2>
        <p className="font-inter text-xl md:text-2xl text-[#E2E2E2] leading-relaxed font-light">
          I believe that great design is invisible—it simply works. By bridging the gap between artistic vision and technical implementation, I build interfaces that feel as good as they look. My approach is rooted in obsessive attention to detail, performance optimization, and the relentless pursuit of simplicity.
        </p>
      </section>

      {/* Bento Grid Navigation */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-accent-blue uppercase tracking-widest">
            Bento Grid
          </span>
          <h2 className="font-hanken font-bold text-3xl text-white">
            Explore the Studio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Projects Card - Span 8 */}
          <GlassCard className="md:col-span-8 group relative min-h-[300px] flex flex-col justify-end p-8 overflow-hidden cursor-pointer">
            {/* Background Graphic Grid/Particles */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-0" />

            {/* Top Right Hover Icon */}
            <div className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/5 text-accent-blue opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all z-10">
              <Eye className="w-5 h-5" />
            </div>

            <div className="relative z-10 flex flex-col gap-2">
              <Badge variant="accent-blue" className="w-fit">CURATED WORK</Badge>
              <h3 className="font-hanken font-semibold text-3xl text-white group-hover:text-accent-blue transition-colors">
                Projects
              </h3>
              <p className="font-inter text-sm text-[#A1A1A1] max-w-md">
                A collection of digital products, branding systems, and experimental interfaces built for the modern web.
              </p>
              <Link href="/projects" className="absolute inset-0" aria-label="Go to Projects" />
            </div>
          </GlassCard>

          {/* Research Card - Span 4 */}
          <GlassCard className="md:col-span-4 group relative min-h-[300px] flex flex-col justify-between p-8 cursor-pointer">
            <div className="p-4 rounded-full bg-accent-blue/5 border border-accent-blue/10 text-accent-blue w-fit group-hover:scale-110 transition-transform">
              <Code className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-hanken font-semibold text-2xl text-white group-hover:text-accent-blue transition-colors">
                Research
              </h3>
              <p className="font-inter text-sm text-[#A1A1A1]">
                Exploring UX patterns, accessibility standards, and the future of creative AI.
              </p>
              <Link href="/research" className="absolute inset-0" aria-label="Go to Research" />
            </div>
          </GlassCard>

          {/* Cafe Hunter Card - Span 4 */}
          <GlassCard className="md:col-span-4 group relative min-h-[300px] flex flex-col justify-between p-8 cursor-pointer">
            <div className="p-4 rounded-full bg-accent-blue/5 border border-accent-blue/10 text-accent-blue w-fit group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-hanken font-semibold text-2xl text-white group-hover:text-accent-blue transition-colors">
                Cafe Hunter
              </h3>
              <p className="font-inter text-sm text-[#A1A1A1]">
                Side project: A curated directory of the best brutalist architecture cafes worldwide.
              </p>
              <Link href="/cafe-hunter" className="absolute inset-0" aria-label="Go to Cafe Hunter" />
            </div>
          </GlassCard>

          {/* Cats Card - Span 4 */}
          <GlassCard className="md:col-span-4 group relative min-h-[300px] flex flex-col justify-between p-8 cursor-pointer">
            <div className="p-4 rounded-full bg-accent-blue/5 border border-accent-blue/10 text-accent-blue w-fit group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-hanken font-semibold text-2xl text-white group-hover:text-accent-blue transition-colors">
                Cats
              </h3>
              <p className="font-inter text-sm text-[#A1A1A1]">
                Personal logs and photography of my feline companions and studio assistants.
              </p>
              <Link href="/cats" className="absolute inset-0" aria-label="Go to Cats" />
            </div>
          </GlassCard>

          {/* Schedule Card - Span 4 */}
          <GlassCard className="md:col-span-4 group relative min-h-[300px] flex flex-col justify-between p-8 cursor-pointer">
            <div className="p-4 rounded-full bg-accent-blue/5 border border-accent-blue/10 text-accent-blue w-fit group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-hanken font-semibold text-2xl text-white group-hover:text-accent-blue transition-colors">
                Schedule
              </h3>
              <p className="font-inter text-sm text-[#A1A1A1]">
                View my current availability for freelance commissions or consultations.
              </p>
              <Link href="/schedule" className="absolute inset-0" aria-label="Go to Schedule" />
            </div>
          </GlassCard>

        </div>
      </section>

    </div>
  );
}
