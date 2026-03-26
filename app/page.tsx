// 1. Import auth, redirect, prisma, dan link
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // Pastikan path prisma client benar
import Link from "next/link";
// import StatCard from "@/components/StatCard/StatCard"; // Kita ganti StatCard lama dengan desain baru di bawah

export default async function DashboardPage() {
  // 2. Cek siapa yang lagi buka halaman ini via NextAuth v5
  const session = await auth();

  // 3. Jika belum login sama sekali, tendang ke login
  if (!session) {
    redirect("/login");
  }

  // 4. Jika yang login adalah USER (Siswa), arahkan langsung ke Materi Video
  if ((session.user as any)?.role === "USER") {
    redirect("/materi");
  }

  // 5. Jika lolos (berarti ADMIN), ambil data statistik real-time dari Prisma
  const countSiswa = await prisma.user.count({ where: { role: "USER" } });
  const countMateri = await prisma.materi.count();
  const countPeraturan = await prisma.regulation.count(); // Sesuaikan nama tabel peraturan lo

  // 6. Tampilkan Dashboard Admin nuansa Alam & Kayu
  return (
    <div className="min-h-screen bg-[#F5F5F4] p-6 lg:p-10">
      
      {/* HEADER: Welcome Aksen Alam */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-100 pb-8">
        <div>
          <h1 className="text-4xl font-black text-[#4E342E] tracking-tight">
            Ringkasan Data Panel
          </h1>
          <p className="text-stone-500 mt-1.5 text-lg font-medium">
            Selamat datang kembali, <span className="text-[#8D6E63] font-bold">{session.user?.name}</span>. 👋
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm px-6 py-4 rounded-3xl shadow-sm border border-stone-100 flex items-center gap-4">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
          <div>
            <span className="text-sm font-bold text-stone-700 block">Sistem Terhubung</span>
            <span className="text-[10px] text-green-700 font-black uppercase tracking-widest">Database Aktif</span>
          </div>
        </div>
      </div>

      {/* SECTION: Grid Statistik Utama (Kartu Bulat Premium) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        
        {/* KARTU 1: TOTAL SISWA (Nuansa Kayu Tua - Menonjol) */}
        <div className="bg-[#5D4037] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-stone-300 font-bold uppercase text-xs tracking-widest">Siswa Terdaftar</h3>
            <p className="text-7xl font-black mt-3 drop-shadow-md">{countSiswa}</p>
            <p className="text-stone-400 text-sm mt-5 italic">Update real-time dari database User (Siswa)</p>
          </div>
          {/* Aksen visual lingkaran di pojok */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
          <span className="absolute left-10 bottom-6 text-9xl opacity-5 pointer-events-none z-0">🎓</span>
        </div>

        {/* KARTU 2: MATERI VIDEO (Nuansa Alam Cerah) */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 hover:shadow-md transition-shadow group">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
            <span className="text-3xl">📹</span>
          </div>
          <h3 className="text-2xl font-bold text-stone-800 tracking-tight">Materi Video</h3>
          <p className="text-stone-500 mt-2.5 leading-relaxed">
            Jumlah video tutorial yang sudah diunggah untuk siswa belajar mandiri.
          </p>
          <div className="mt-8 flex items-end justify-between">
            <p className="text-6xl font-black text-green-600">{countMateri}</p>
            <span className="text-xs text-stone-400 font-medium">Video Aktif</span>
          </div>
        </div>

        {/* KARTU 3: DOKUMEN PERATURAN (Nuansa Netral Premium) */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 hover:shadow-md transition-shadow group">
          <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-8 group-hover:-rotate-12 transition-transform">
            <span className="text-3xl">📜</span>
          </div>
          <h3 className="text-2xl font-bold text-stone-800 tracking-tight">Dokumen PDF</h3>
          <p className="text-stone-500 mt-2.5 leading-relaxed">
            Jumlah berkas peraturan daerah dan panduan sekolah yang tersedia.
          </p>
          <div className="mt-8 flex items-end justify-between">
            <p className="text-6xl font-black text-[#8D6E63]">{countPeraturan}</p>
            <span className="text-xs text-stone-400 font-medium">Berkas PDF</span>
          </div>
        </div>

      </div>

      {/* SECTION: Akses Cepat Admin (Konten Tambahan) */}
      <section className="bg-white rounded-[2.5rem] border border-stone-100 p-10 shadow-sm relative overflow-hidden">
        {/* Aksen visual tanaman di background */}
        <span className="absolute -right-10 -bottom-10 text-[18rem] opacity-10 text-green-800 pointer-events-none">🌳</span>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#4E342E] tracking-tight">Aksi Cepat Administrator</h2>
              <p className="text-stone-500 mt-1">Menu pintasan untuk manajemen data SI-DUGI v2.</p>
            </div>
            <Link href="/bantuan" className="text-sm text-[#8D6E63] font-semibold hover:underline">
              Butuh Bantuan?
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link href="/siswa" className="px-6 py-4 bg-[#8D6E63] text-white rounded-2xl font-bold hover:bg-[#6D4C41] transition shadow-lg shadow-brown-200 text-center">
              Kelola Siswa
            </Link>
            <Link href="/materi" className="px-6 py-4 bg-green-100 text-green-800 rounded-2xl font-bold hover:bg-green-200 transition text-center">
              Unggah Materi
            </Link>
            <Link href="/peraturan" className="px-6 py-4 bg-stone-100 text-stone-700 rounded-2xl font-bold hover:bg-stone-200 transition text-center">
              Manajemen PDF
            </Link>
            <button className="px-6 py-4 bg-red-100 text-red-700 rounded-2xl font-bold hover:bg-red-200 transition text-center">
              Pengaturan Sistem
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER Kecil */}
      <footer className="mt-16 text-center text-stone-400 text-xs font-medium uppercase tracking-widest border-t border-stone-100 pt-6">
        Administrator Dashboard SI-DUGI v2 © 2026 Developer Surabaya
      </footer>
    </div>
  );
}