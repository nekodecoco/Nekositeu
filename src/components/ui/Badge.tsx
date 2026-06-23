import React from "react";

type BadgeVariant = "default" | "accent-blue" | "accent-orange" | "accent-peach" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  const baseClasses = "inline-flex items-center px-2.5 py-1 rounded text-[10px] font-mono font-medium uppercase tracking-wider border transition-colors";
  
  const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-white/5 text-[#BFC7D5] border-white/5",
    "accent-blue": "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
    "accent-orange": "bg-accent-orange/10 text-accent-orange border-accent-orange/20",
    "accent-peach": "bg-accent-peach/10 text-accent-peach border-accent-peach/20",
    outline: "bg-transparent text-[#BFC7D5] border-white/10 hover:border-white/20 hover:text-white"
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
