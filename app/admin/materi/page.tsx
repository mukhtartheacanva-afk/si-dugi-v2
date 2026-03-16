import { prisma } from "@/lib/prisma";
import { hapusMateri } from "@/lib/materiActions";
import ModalEditMateri from "@/components/ModalEditMateri";
import ModalTambahMateri from "@/components/ModalTambahMateri";
import FilterKategori from "@/components/FilterKategori";
import Link from "next/link";
import LimitControl from "@/components/LimitControl";

export const dynamic = "force-dynamic";

export default async function AdminMateriPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const selectedCategory = params.category || "";
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 5;
  const skip = (page - 1) * limit;

  // 1. Deteksi Database
  const isPostgres = process.env.DATABASE_URL?.includes("postgres");
  const searchMode = isPostgres ? { mode: "insensitive" as const } : {};

  // 2. Ambil Daftar Kategori Unik (untuk isi Dropdown Filter)
  const categoriesRaw = await prisma.materi.findMany({
    select: { kategori: true },
    distinct: ["kategori"],
    orderBy: { kategori: "asc" }
  });
  const allCategories = categoriesRaw.map((c) => c.kategori);

  // 3. Query Data (Gabungan Search + Filter Kategori)
  const whereClause = {
    AND: [
      selectedCategory ? { kategori: selectedCategory } : {},
      {
        OR: [
          { judul: { contains: query, ...searchMode } },
          { kategori: { contains: query, ...searchMode } },
        ],
      },
    ],
  };

  const [materi, total] = await Promise.all([
    prisma.materi.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
    }),
    prisma.materi.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(total / limit);

  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Materi</h1>
          <p className="text-gray-500">Ditemukan <span className="font-bold text-blue-600">{total}</span> materi</p>
        </div>
        <ModalTambahMateri categories={allCategories} />
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
        <form className="flex flex-1 gap-2 min-w-300">
          <input 
            name="q" 
            defaultValue={query}
            placeholder="Cari judul..." 
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition">
            Cari
          </button>
          
          {(query || selectedCategory) && (
            <Link href="/admin/materi" className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition">
              Reset
            </Link>
          )}
          <FilterKategori categories={allCategories} />
          
        </form>
        <div className="flex gap-3 items-center">
          <button className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-sm flex items-center gap-2">
            <span>📊</span> Export
          </button>
          {/* 2. PAKAI KOMPONEN YANG UDAH ADA */}
          {/* Kirim angka limit yang sekarang aktif ke prop currentLimit */}
          <LimitControl currentLimit={limit} />
        </div>
      </div>
      
      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-5 text-xs font-bold text-gray-500 uppercase">Materi & URL</th>
              <th className="p-5 text-xs font-bold text-gray-500 uppercase">Kategori</th>
              <th className="p-5 text-xs font-bold text-gray-500 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {materi.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30 transition">
                <td className="p-5">
                  <div className="font-bold text-gray-800">{item.judul}</div>
                  <div className="text-xs text-blue-400 font-mono truncate max-w-xs">{item.urlYoutube}</div>
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-[10px] uppercase font-black rounded-lg shadow-sm">
                    {item.kategori}
                  </span>
                </td>
                <td className="p-5 flex justify-center gap-6">
                  <ModalEditMateri materi={item} />
                  <form action={async () => { "use server"; await hapusMateri(item.id); }}>
                    <button className="text-red-400 hover:text-red-600 font-bold transition">Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Halaman {page} dari {totalPages}</p>
          <div className="flex gap-2">
            <Link 
              href={`/admin/materi?q=${query}&category=${selectedCategory}&page=${page - 1}`}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${page === 1 ? "opacity-30 pointer-events-none" : "bg-white border hover:bg-gray-50"}`}
            >
              Prev
            </Link>
            <Link 
              href={`/admin/materi?q=${query}&category=${selectedCategory}&page=${page + 1}`}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${page === totalPages ? "opacity-30 pointer-events-none" : "bg-black text-white hover:bg-gray-800"}`}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}