"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const isAdmin = user?.role === "ADMIN";

  // Style untuk menu yang aktif dan tidak aktif
  const activeStyle = { backgroundColor: 'var(--color-sidebar-active)', color: '#ffffff' };
  const normalStyle = { color: 'var(--color-sidebar-text)' };

  return (
    <aside
      className="w-64 min-h-screen p-4 flex flex-col shadow-xl transition-colors duration-300 border-r border-black/5"
      style={{ backgroundColor: 'var(--color-sidebar-bg)' }}
    >
      {/* HEADER: Judul Dinamis */}
      <div
        className="text-white text-xl font-bold p-4 border-b mb-6 uppercase tracking-wider"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {isAdmin ? "Menu Admin" : "Menu Siswa"}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {/* MENU UTAMA (UNTUK SEMUA) */}
        <Link
          href="/"
          style={pathname === "/" ? activeStyle : normalStyle}
          className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
        >
          <span>🏠</span> Dashboard
        </Link>

        {/* PROFIL SAYA: Gue taruh di atas biar Siswa gampang upload berkas */}
        <Link
          href="/profil"
          style={pathname === "/profil" || pathname.startsWith("/profil/edit") ? activeStyle : normalStyle}
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
          <div className="pt-4 space-y-2">
            <div className="pb-1 px-3 text-[10px] font-bold opacity-40 uppercase tracking-widest text-white border-t border-white/5 pt-4">
              Administrator
            </div>
            <Link
              href="/siswa"
              style={pathname === "/siswa" ? activeStyle : normalStyle}
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

        {/* PENGATURAN SELALU DI BAWAH NAVIGASI UTAMA */}
        <div className="pt-4 mt-2 border-t border-white/5">
          <Link
            href="/setting"
            style={pathname === "/setting" ? activeStyle : normalStyle}
            className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
          >
            <span>⚙️</span> Pengaturan
          </Link>
        </div>
      </nav>

      {/* FOOTER: Info User Bawah */}
      <div
        className="mt-auto p-4 rounded-2xl border mb-4"
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <p className="text-[10px] opacity-50 text-white uppercase tracking-tighter">Login sebagai:</p>
        <p className="text-sm font-bold text-white truncate">{user?.nama || user?.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest"
            style={{ borderColor: 'var(--color-sidebar-active)', color: 'var(--color-sidebar-active)' }}
          >
            {user?.role}
          </span>
          <span className="text-[10px] text-white/20 italic font-medium">v2.0.0</span>
        </div>
      </div>

      <div className="px-2 pb-2 text-[10px] opacity-20 text-white text-center italic tracking-widest">
        SI-DUGI MANAGEMENT SYSTEM
      </div>
    </aside>
  );
}