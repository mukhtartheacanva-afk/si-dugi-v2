import { prisma } from "@/lib/prisma";
import { hapusMateri } from "@/lib/materiActions";
import ModalEditMateri from "@/components/ModalEditMateri";
import ModalTambahMateri from "@/components/ModalTambahMateri";
import FilterKategori from "@/components/FilterKategori";
import Link from "next/link";
import LimitControl from "@/components/LimitControl";
import ExportMateriExcel from "@/components/ExportMateriExcel";
import ImportMateriExcel from "@/components/ImportMateriExcel";
import PaginationControls from "@/components/PaginationControls";
import VideoLink from "@/components/VideoLink";

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

  const isPostgres = process.env.DATABASE_URL?.includes("postgres");
  const searchMode = isPostgres ? { mode: "insensitive" as const } : {};

  // Ambil kategori unik untuk filter dan modal
  const categoriesRaw = await prisma.materi.findMany({
    select: { kategori: true },
    distinct: ["kategori"],
    orderBy: { kategori: "asc" }
  });
  const allCategories = categoriesRaw.map((c) => c.kategori);

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
      </div>
      
      <div className="bg-gray-40 p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center justify-between gap-4">
        <form className="flex gap-2 items-center"> 
          <input 
            name="q" 
            defaultValue={query}
            placeholder="Cari judul..." 
            className="w-150 px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition">
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
          <ImportMateriExcel />
          <ExportMateriExcel query={query} category={selectedCategory} />
          <div className="h-8 w-px bg-gray-200 mx-0 hidden md:block"></div> 
          <ModalTambahMateri categories={allCategories} />
          <div className="h-8 w-px bg-gray-200 mx-0 hidden md:block"></div> 
          <LimitControl currentLimit={limit} />
        </div>
      </div>
      
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
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">{item.judul}</div>
                  <VideoLink url={item.urlYoutube} />
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-[10px] uppercase font-black rounded-lg shadow-sm">
                    {item.kategori}
                  </span>
                </td>
                <td className="p-5 flex justify-center gap-6">
                  {/* DATA KATEGORI DIKIRIM KE SINI */}
                  <ModalEditMateri materi={item} categories={allCategories} />
                  
                  <form action={async () => { "use server"; await hapusMateri(item.id); }}>
                    <button className="text-red-400 hover:text-red-600 font-bold transition">Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls currentPage={page} totalPages={totalPages}/>
    </div>
  );
}