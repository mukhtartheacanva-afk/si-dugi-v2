"use client"; 

import { usePathname } from "next/navigation"; 
import Link from "next/link";

// Kita terima props 'user' dari layout.tsx tadi
export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  // Cek apakah dia Admin atau User Biasa
  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col shadow-xl">
      <div className="text-white text-xl font-bold p-4 border-b border-slate-700 mb-6 uppercase tracking-wider">
        {isAdmin ? "Menu Admin" : "Menu User"}
      </div>
      
      <nav className="flex-1 space-y-2">
        {/* SEMUA BISA AKSES: Dashboard & Materi */}
        <Link 
          href="/" 
          className={`flex items-center gap-3 p-3 rounded-lg transition ${
            pathname === "/" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800"
          }`}
        >
          <span>🏠</span> Dashboard
        </Link>

        <Link 
          href="/materi" 
          className={`flex items-center gap-3 p-3 rounded-lg transition ${
            pathname === "/materi" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800"
          }`}
        >
          <span>📚</span> Materi Video
        </Link>

        {/* HANYA ADMIN: Data Siswa & Laporan */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-1 px-3 text-xs font-bold text-slate-500 uppercase">
              Administrator
            </div>
            <Link 
              href="/siswa" 
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                pathname === "/siswa" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800"
              }`}
            >
              <span>👥</span> Data Siswa
            </Link>

                {isAdmin && (
            <Link href="/admin/materi" className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === "/admin/materi" ? "bg-blue-600 text-white" : "hover:bg-slate-800"
            }`}>
              <span>📺</span> Kelola Materi
            </Link>
            )}

            <Link 
              href="/laporan" 
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                pathname === "/laporan" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800"
              }`}
            >
              <span>📝</span> Laporan
            </Link>
          </>
        )}

        {/* SEMUA BISA AKSES: Pengaturan */}
        <Link 
          href="/setting" 
          className={`flex items-center gap-3 p-3 rounded-lg transition ${
            pathname === "/setting" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800"
          }`}
        >
          <span>⚙️</span> Pengaturan
        </Link>
      </nav>

      {/* Info User di bagian bawah Sidebar (Opsional) */}
      <div className="mt-auto p-3 bg-slate-800/50 rounded-lg border border-slate-700 mb-4">
        <p className="text-xs text-slate-400">Login sebagai:</p>
        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
        <span className="text-[10px] bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded border border-blue-800">
          {user?.role}
        </span>
      </div>

      <div className="p-2 border-t border-slate-700 text-[10px] text-slate-600 flex justify-between">
        <span>v2.0.0-beta</span>
        <span>SI-DUGI</span>
      </div>
    </aside>
  );
}