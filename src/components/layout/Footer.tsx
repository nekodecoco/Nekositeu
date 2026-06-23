import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-white/5 bg-[#131313] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-hanken font-semibold text-lg text-white">
            Portfolio Studio
          </span>
          <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-wider">
            © 2024 Portfolio Studio
          </span>
        </div>

        {/* Right Side - Social Links */}
        <div className="flex items-center gap-8 font-mono text-xs tracking-widest">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#BFC7D5] hover:text-accent-blue transition-colors duration-200"
          >
            GITHUB
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#BFC7D5] hover:text-accent-blue transition-colors duration-200"
          >
            LINKEDIN
          </Link>
          <Link
            href="mailto:contact@alexchen.dev"
            className="text-[#BFC7D5] hover:text-accent-blue transition-colors duration-200"
          >
            EMAIL
          </Link>
        </div>
      </div>
    </footer>
  );
}
