"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Content Panel */}
      <div className="relative w-full max-w-lg glass-panel bg-zinc-950/90 rounded-2xl shadow-2xl border border-white/10 z-10 overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/2">
          <h2 className="font-hanken font-bold text-lg text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#BFC7D5] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
