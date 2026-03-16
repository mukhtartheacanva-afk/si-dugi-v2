// 1. Import auth dan redirect
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StatCard from "@/components/StatCard/StatCard";

export default async function DashboardPage() {
  // 2. Cek siapa yang lagi buka halaman ini
  const session = await auth();

  // 3. Jika belum login sama sekali, tendang ke login
  if (!session) {
    redirect("/login");
  }

  // 4. Jika yang login adalah USER (Siswa), arahkan langsung ke Materi Video
  // Tambahkan "as any" setelah session.user
if ((session.user as any)?.role === "USER") {
  redirect("/materi");
}

  // 5. Jika lolos (berarti ADMIN), tampilkan dashboard di bawah ini
  return (
    <div className="p-8">
      {/* Bagian Judul */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Ringkasan Data</h1>
        <p className="text-gray-500">Selamat datang kembali, {session.user?.name}.</p>
      </header>

      {/* Bagian Grid untuk StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard judul="Total Siswa" jumlah={120} warna="bg-blue-100" />
        <StatCard judul="Guru Aktif" jumlah={15} warna="bg-green-100" />
        <StatCard judul="Laporan Baru" jumlah={4} warna="bg-orange-100" />
      </div>

      {/* Bagian Konten Tambahan */}
      <section className="mt-12 p-6 border rounded-xl bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
        <p className="text-gray-600 italic">Halaman ini hanya bisa diakses oleh Administrator.</p>
      </section>
    </div>
  );
}