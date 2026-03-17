"use client";

import { useEffect } from "react";

interface ModalVideoProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalVideo({ url, isOpen, onClose }: ModalVideoProps) {
  // Tutup pakai tombol Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
        >
          ✕
        </button>

        {/* Iframe YouTube */}
        <iframe
          src={url}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      {/* Overlay klik luar buat close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
}