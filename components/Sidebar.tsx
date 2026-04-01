"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeBtn from "./ThemeBtn"; // Import tombol baru

export default function Sidebar({ user, role }: { user: any, role?: string }) {
  const pathname = usePathname();
  
  // Gunakan prop role jika ada, jika tidak gunakan dari session user
  const isAdmin = role === "ADMIN" || user?.role === "ADMIN";

  const activeStyle = { backgroundColor: 'var(--color-sidebar-active)', color: '#ffffff' };
  const normalStyle = { color: 'var(--color-sidebar-text)' };

  return (
    <aside
      className="w-64 min-h-screen p-4 flex flex-col shadow-xl transition-colors duration-300 border-r border-black/5"
      style={{ backgroundColor: 'var(--color-sidebar-bg)' }}
    >
      <div
        className="text-white text-xl font-bold p-4 border-b mb-6 uppercase tracking-wider"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {isAdmin ? "Menu Admin" : "Menu Siswa"}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {/* DASHBOARD DINAMIS */}
        <Link
          href={isAdmin ? "/admin/dashboard" : "/dashboard"}
          style={(pathname === "/dashboard" || pathname === "/admin/dashboard") ? activeStyle : normalStyle}
          className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
        >
          <span>🏠</span> Dashboard
        </Link>

        {/* MENU UMUM (Bisa diakses Admin & Siswa) */}
        <Link
          href="/profil"
          style={pathname.startsWith("/profil") ? activeStyle : normalStyle}
          className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
        >
          <span>👤</span> Profil Saya
        </Link>

        <Link
          href="/materi"
          style={pathname === "/materi" ? activeStyle : normalStyle}
          className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
        >
          <span>📚</span> Materi Video
        </Link>

        <Link
          href="/peraturan"
          style={pathname === "/peraturan" ? activeStyle : normalStyle}
          className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
        >
          <span>⚖️</span> Kumpulan Peraturan
        </Link>

        {/* SECTION KHUSUS ADMINISTRATOR */}
        {isAdmin && (
          <div className="pt-2 space-y-2">
            <div className="pb-1 px-3 text-[10px] font-bold opacity-40 uppercase tracking-widest text-white border-t border-white/5 pt-4">
              Administrator
            </div>
            <Link
              href="/admin/siswa"
              style={pathname === "/admin/siswa" ? activeStyle : normalStyle}
              className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
            >
              <span>👥</span> Data Siswa
            </Link>

            <Link
              href="/admin/materi"
              style={pathname === "/admin/materi" ? activeStyle : normalStyle}
              className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
            >
              <span>📺</span> Kelola Materi
            </Link>

            <Link
              href="/admin/peraturan"
              style={pathname === "/admin/peraturan" ? activeStyle : normalStyle}
              className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
            >
              <span>📝</span> Kelola Peraturan
            </Link>
          </div>
        )}

        <div className="pt-4 mt-2 border-t border-white/5">
          <Link
            href=""
            style={pathname === "/setting" ? activeStyle : normalStyle}
            className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
          >
            <span>⚙️</span> <ThemeBtn />
          </Link>
        </div>
      </nav>

      {/* FOOTER: Info User */}
      <div
        className="mt-auto p-4 rounded-2xl border mb-4"
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <p className="text-[10px] opacity-50 text-white uppercase tracking-tighter">Login sebagai:</p>
        <p className="text-sm font-bold text-white truncate">{user?.nama || user?.name || "User"}</p>
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest"
            style={{ borderColor: 'var(--color-sidebar-active)', color: 'var(--color-sidebar-active)' }}
          >
            {user?.role || "GUEST"}
          </span>
          <span className="text-[10px] text-white/20 italic font-medium">v2.0.0</span>
        </div>
      </div>
    </aside>
  );
}