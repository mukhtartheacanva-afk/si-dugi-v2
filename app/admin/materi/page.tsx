import { prisma } from "@/lib/prisma";
import { hapusMateri } from "@/lib/materiActions";
import ModalEditMateri from "@/components/ModalEditMateri";
import ModalTambahMateri from "@/components/ModalTambahMateri";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMateriPage({
  searchParams,
}: {
  // Gunakan Promise untuk searchParams di versi Next.js terbaru
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}) {
  // Await parameter-nya
  const params = await searchParams;
  
  const query = params.q || "";
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 5;
  const skip = (page - 1) * limit;

  // 2. Logika Deteksi Database (Biar aman pas Deploy)
  // SQLite nggak support "insensitive", jadi kita kondisikan
  const isPostgres = process.env.DATABASE_URL?.includes("postgres");
  const searchMode = isPostgres ? { mode: "insensitive" as const } : {};

  // 3. Query Data
  const [materi, total] = await Promise.all([
    prisma.materi.findMany({
      where: {
        OR: [
          { judul: { contains: query, ...searchMode } },
          { kategori: { contains: query, ...searchMode } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
    }),
    prisma.materi.count({
      where: {
        OR: [
          { judul: { contains: query, ...searchMode } },
          { kategori: { contains: query, ...searchMode } },
        ],
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kelola Materi</h1>
          <p className="text-gray-500 mt-1">Total: <span className="font-bold text-blue-600">{total}</span> materi video tersedia.</p>
        </div>
        <ModalTambahMateri />
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center justify-between">
        <form className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
            <input 
              name="q" 
              defaultValue={query}
              placeholder="Cari judul materi..." 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-black transition">Cari</button>
          {query && (
            <Link href="/admin/materi" className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition">Reset</Link>
          )}
        </form>

        <div className="flex gap-3 items-center">
            <p className="text-sm text-gray-400 hidden md:block font-medium">Tampilkan:</p>
            <select 
                className="p-2.5 border border-gray-200 rounded-xl outline-none bg-white font-medium text-gray-700 focus:ring-2 focus:ring-blue-500"
                defaultValue={limit}
                // Note: Untuk ganti limit via URL butuh client logic, sementara kita biarkan default
            >
                <option value="5">5 baris</option>
                <option value="10">10 baris</option>
                <option value="50">50 baris</option>
            </select>
            
            <button className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-sm flex items-center gap-2">
                <span>📊</span> Export
            </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Materi & URL</th>
                <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Kategori</th>
                <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {materi.length > 0 ? (
                materi.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-5">
                        <div className="font-bold text-gray-800 leading-snug">{item.judul}</div>
                        <div className="text-xs text-blue-400 mt-1 font-mono truncate max-w-xs">{item.urlYoutube}</div>
                    </td>
                    <td className="p-5">
                        <span className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-[10px] uppercase font-black rounded-lg shadow-sm">
                        {item.kategori}
                        </span>
                    </td>
                    <td className="p-5">
                        <div className="flex justify-center items-center gap-6">
                        <ModalEditMateri materi={item} />
                        <form action={async () => { "use server"; await hapusMateri(item.id); }}>
                            <button className="text-red-400 hover:text-red-600 text-sm font-bold transition-all">Hapus</button>
                        </form>
                        </div>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan={3} className="p-20 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl mb-2">📥</span>
                            <p className="text-gray-400 font-medium italic">Data tidak ditemukan atau masih kosong...</p>
                        </div>
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* PAGINATION SECTION */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
           <p className="text-sm text-gray-500 font-medium">Halaman <span className="text-blue-600 font-bold">{page}</span> dari <span className="text-gray-800">{totalPages}</span></p>
           <div className="flex gap-2">
                <Link 
                    href={`/admin/materi?q=${query}&page=${page - 1}`}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition ${page === 1 ? "pointer-events-none opacity-30 bg-gray-100" : "bg-white border hover:bg-gray-50"}`}
                >
                    Prev
                </Link>
                <Link 
                    href={`/admin/materi?q=${query}&page=${page + 1}`}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition ${page === totalPages ? "pointer-events-none opacity-30 bg-gray-100" : "bg-white border hover:bg-gray-50"}`}
                >
                    Next
                </Link>
           </div>
        </div>
      )}
    </div>
  );
}