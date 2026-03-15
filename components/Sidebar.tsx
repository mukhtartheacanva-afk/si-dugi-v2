"use client"; // <--- Tambahkan ini di baris pertama
import { usePathname } from "next/navigation"; // Import ini buat cek posisi
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname(); // Ini bakal dapet alamat URL sekarang
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col shadow-xl">
      <div className="text-white text-xl font-bold p-4 border-b border-slate-700 mb-6">
        MENU ADMIN
      </div>
      
      <nav className="flex-1 space-y-2">
        <Link 
          href="/" 
          className={`flex items-center gap-3 p-3 rounded-lg transition ${
            pathname === "/" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800"
          }`}
        >
          <span>🏠</span> Dashboard
        </Link>
        <Link href="/siswa" className={`flex items-center gap-3 p-3 rounded-lg transition ${
            pathname === "/siswa" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800"
          }`}>
          <span>👥</span> Data Siswa
        </Link>
        <Link href="/laporan" className={`flex items-center gap-3 p-3 rounded-lg transition ${
            pathname === "/laporan" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800"
          }`}>
          <span>📝</span> Laporan
        </Link>
        <Link href="/setting" className={`flex items-center gap-3 p-3 rounded-lg transition ${
            pathname === "/setting" ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800"
          }`}>
          <span>⚙️</span> Pengaturan
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-700 text-sm text-slate-500">
        v2.0.0-beta
      </div>
    </aside>
  );
}