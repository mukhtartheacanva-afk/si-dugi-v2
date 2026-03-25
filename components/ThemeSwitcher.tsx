"use client";

import { useState, useEffect } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("normal");

  useEffect(() => {
    // Cek kalau sebelumnya user sudah pilih theme tertentu (opsional)
    const savedTheme = localStorage.getItem("theme") || "normal";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "normal" ? "nature" : "normal";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-gray-200 hover:border-blue-400 bg-gray-50 text-gray-600 shadow-sm"
    >
      {theme === "normal" ? (
        <>
          <span>🌲</span>
          <span>Mode Alam</span>
        </>
      ) : (
        <>
          <span>💻</span>
          <span>Mode Normal</span>
        </>
      )}
    </button>
  );
}