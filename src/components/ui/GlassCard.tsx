import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hoverGlow = true,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`glass-panel rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
        hoverGlow 
          ? "hover:border-white/15 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:-translate-y-[2px] glow-on-hover" 
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
