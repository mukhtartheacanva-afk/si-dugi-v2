"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PaginationControls({ 
  currentPage, 
  totalPages 
}: { 
  currentPage: number; 
  totalPages: number 
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  // Jangan tampilkan apa-apa kalau cuma ada 1 halaman
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-gray-100 px-6 py-2 rounded-2xl border border-gray-100 shadow-sm mt-3">
      {/* Keterangan Halaman */}
      <div className="text-sm text-gray-500 font-medium">
        Halaman <span className="text-gray-900 font-bold">{currentPage}</span> dari <span className="text-gray-900 font-bold">{totalPages}</span>
      </div>

      <div className="flex gap-2">
        {/* Tombol PREVIOUS */}
        <button
          disabled={currentPage <= 1}
          onClick={() => createPageURL(currentPage - 1)}
          className="px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent transition-all duration-200 shadow-sm"
        >
          &larr; Prev
        </button>
        
        {/* Indikator Angka Tengah */}
        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-200 border-2 border-blue-600">
          {currentPage}
        </div>

        {/* Tombol NEXT - Dibuat Mencolok dengan Background Biru */}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => createPageURL(currentPage + 1)}
          className="px-4 py-2 bg-blue-600 border-2 border-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 hover:border-blue-700 disabled:opacity-30 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all duration-200 shadow-md shadow-blue-200"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}