import { prisma } from "@/lib/prisma";
import RegulationTable from "./RegulationTable";
import Link from "next/link";

export default async function AdminPeraturanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const category = params.category || "";
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 5;
  const skip = (page - 1) * limit;

  // 1. Ambil Data dengan Filter & Paging
  const [data, total] = await Promise.all([
    prisma.regulation.findMany({
      where: {
        AND: [
          query ? { title: { contains: query } } : {},
          category ? { category: category } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: limit,
    }),
    prisma.regulation.count({
      where: {
        AND: [
          query ? { title: { contains: query } } : {},
          category ? { category: category } : {},
        ],
      },
    }),
  ]);

  // 2. Ambil List Kategori Unik untuk Filter
  const categories = await prisma.regulation.findMany({
    distinct: ['category'],
    select: { category: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Peraturan</h1>
          <p className="text-sm opacity-60">Ditemukan {total} peraturan</p>
        </div>
        {/* <Link
          href="/admin/peraturan/tambah"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition shadow-md flex items-center gap-2 w-fit"
        >
          <span>+</span> Tambah Peraturan Baru
        </Link> */}
      </div>

      {/* Komponen Tabel & Filter Client-Side */}
      <RegulationTable 
        initialData={data} 
        total={total} 
        categories={categories.map(c => c.category)}
      />
    </div>
  );
}