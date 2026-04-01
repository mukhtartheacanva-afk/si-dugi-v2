import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function UserDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = Number(session.user?.id);

  // Ambil data user & profile (karena ada relasi di schema)
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true }
  });

  // Ambil total materi video
  const totalMateri = await prisma.materi.count() || 0;

  // Ambil total data regulasi
  const totalRegulasi = await prisma.regulation.count() || 0;
  
  // Ambil data Regulation (sesuai nama tabel di schema)
  const regulations = await prisma.regulation.findMany({
    take: 2,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-stone-800">
          Semangat Belajar, {userData?.nama || "Siswa"}! 👋
        </h1>
        <p className="text-stone-500">Unit: {userData?.kelas || "Umum"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Materi */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
          <p className="text-xs uppercase tracking-widest font-bold text-stone-400">Total Materi Tersedia</p>
          <h2 className="text-4xl font-black text-stone-800 mt-2">{totalMateri}</h2>
          <p className="text-sm text-stone-500 mt-2">Video tutorial aktif</p>
        </div>

        {/* Card Peraturan */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
          <p className="text-xs uppercase tracking-widest font-bold text-stone-400">Total Peraturan Tersedia</p>
          <h2 className="text-4xl font-black text-stone-800 mt-2">{totalRegulasi}</h2>
          <p className="text-sm text-stone-500 mt-2">Peraturan aktif</p>
        </div>

        {/* Card Status Akun */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
          <p className="text-xs uppercase tracking-widest font-bold text-stone-400">Status Siswa</p>
          <h2 className="text-4xl font-black text-green-600 mt-2">{userData?.status}</h2>
          <p className="text-sm text-stone-500 mt-2">Terverifikasi sistem</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <span>📢</span> Peraturan Terbaru
          </h3>
          {regulations.map((item) => (
            <div key={item.id} className="bg-white/40 border border-white p-4 rounded-2xl flex gap-4 items-start">
              <div className="bg-amber-100 p-2 rounded-lg text-xl">⚖️</div>
              <div>
                <h5 className="font-bold text-stone-800 text-sm">{item.title}</h5>
                <p className="text-xs text-stone-500">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}