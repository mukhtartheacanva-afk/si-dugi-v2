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
      <div 
        className="text-white text-xl font-bold p-4 border-b mb-6 uppercase tracking-wider"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {isAdmin ? "Menu Admin" : "Menu User"}
      </div>
      
      <nav className="flex-1 space-y-2">
        <Link 
          href="/" 
          style={pathname === "/" ? activeStyle : normalStyle}
          className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
        >
          <span>🏠</span> Dashboard
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

        {isAdmin && (
          <>
            <div className="pt-4 pb-1 px-3 text-[10px] font-bold opacity-40 uppercase tracking-widest text-white">
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
          </>
        )}

        <Link 
          href="/setting" 
          style={pathname === "/setting" ? activeStyle : normalStyle}
          className="flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/5"
        >
          <span>⚙️</span> Pengaturan
        </Link>
      </nav>

      {/* Info User Bawah */}
      <div 
        className="mt-auto p-3 rounded-lg border mb-4"
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <p className="text-[10px] opacity-50 text-white uppercase">Login sebagai:</p>
        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
        <span 
          className="text-[10px] px-2 py-0.5 rounded border mt-1 inline-block"
          style={{ borderColor: 'var(--color-sidebar-active)', color: 'var(--color-sidebar-active)' }}
        >
          {user?.role}
        </span>
      </div>

      <div className="p-2 border-t text-[10px] opacity-20 text-white flex justify-between" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <span>v2.0.0</span>
        <span>SI-DUGI</span>
      </div>
    </aside>
  );
}