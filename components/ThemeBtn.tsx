"use client";

import { useState, useEffect } from "react";

export default function ThemeBtn() {
  const [theme, setTheme] = useState("normal");

  // Load theme saat pertama kali buka web
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "normal";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // Fungsi ganti theme
  const toggleTheme = () => {
    const newTheme = theme === "normal" ? "nature" : "normal";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm bg-white"
      style={{ 
        borderColor: 'var(--accent-custom)', 
        color: 'var(--accent-custom)' 
      }}
    >
      {theme === "normal" ? (
        <><span>🌲</span> Mode Alam</>
      ) : (
        <><span>💻</span> Mode Normal</>
      )}
    </button>
  );
}