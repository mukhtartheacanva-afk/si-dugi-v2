import { prisma } from "@/lib/prisma";
import RegulationUserList from "./RegulationUserList";

export default async function PeraturanPage(props: {
  searchParams: Promise<{
    limit(limit: any): unknown; q?: string; category?: string; page?: string 
}>;
}) {
  // Await searchParams (Wajib di Next.js 15)
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const category = searchParams.category || "";
  const currentPage = Number(searchParams.page) || 1;
  
  const limit = Number(searchParams.limit) || 10; // Ambil dari URL, default 10 
  const skip = (currentPage - 1) * limit;

  // Ambil list kategori unik untuk filter dropdown
  const categoriesData = await prisma.regulation.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  const categories = categoriesData.map((c) => c.category);

  // Filter pencarian
  const where = {
    AND: [
      q ? { title: { contains: q } } : {},
      category ? { category: category } : {},
    ],
  };

  const [data, total] = await Promise.all([
    prisma.regulation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    }),
    prisma.regulation.count({ where }),
  ]);

  return (
    <div className="p-6 space-y-6 w-full"> {/* Ganti max-w-7xl mx-auto jadi w-full */}
      <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">📚 Kumpulan Peraturan</h1>
        <p className="text-sm text-gray-500 mt-1">Pusat data regulasi dan perundang-undangan.</p>
      </div>

      <RegulationUserList 
        initialData={data} 
        categories={categories} 
        total={total} 
        limit={limit} 
      />
    </div>
  );
}