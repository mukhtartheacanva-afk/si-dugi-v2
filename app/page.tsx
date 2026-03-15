// 1. Import komponen dari folder sebelah
import StatCard from "@/components/StatCard/StatCard";

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Bagian Judul */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Ringkasan Data</h1>
        <p className="text-gray-500">Selamat datang kembali di sistem Si-Dugi.</p>
      </header>

      {/* Bagian Grid untuk StatCard (Lego-lego kecil) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard judul="Total Siswa" jumlah={120} warna="bg-blue-100" />
        <StatCard judul="Guru Aktif" jumlah={15} warna="bg-green-100" />
        <StatCard judul="Laporan Baru" jumlah={4} warna="bg-orange-100" />
      </div>

      {/* Bagian Konten Tambahan */}
      <section className="mt-12 p-6 border rounded-xl bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
        <p className="text-gray-600 italic">Belum ada aktivitas laporan hari ini.</p>
      </section>
    </div>
  );
}