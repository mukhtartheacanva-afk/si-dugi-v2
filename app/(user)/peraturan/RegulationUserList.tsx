"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function RegulationUserList({ initialData, categories, total, limit }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Jika ganti filter atau limit, reset ke halaman 1
    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`/peraturan?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentLimit = Number(searchParams.get("limit")) || limit;
  const totalPages = Math.ceil(total / currentLimit);

  
  return (
    <div className="space-y-6">
      {/* Filter, Search & Limit Halaman */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Input Search */}
        <input
          type="text"
          placeholder="Cari judul..."
          className="flex-2 p-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm text-sm"
          onChange={(e) => updateURL("q", e.target.value)}
          defaultValue={searchParams.get("q") || ""}
        />

        {/* Filter Kategori */}
        <select
          className="flex-1 p-4 px-6 rounded-2xl border border-gray-100 bg-white shadow-sm text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          onChange={(e) => updateURL("category", e.target.value)}
          defaultValue={searchParams.get("category") || ""}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat: string) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Pilihan Data Per Halaman */}
        <select
          className="p-4 px-6 rounded-2xl border border-gray-100 bg-white shadow-sm text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          onChange={(e) => updateURL("limit", e.target.value)}
          defaultValue={currentLimit.toString()}
        >
          <option value="5">Tampil 5</option>
          <option value="10">Tampil 10</option>
          <option value="50">Tampil 50</option>
        </select>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialData.map((item: any) => (
          <div 
            key={item.id} 
            className="bg-white border border-gray-50 rounded-4xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                {item.category}
              </span>
              <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition min-h-12 line-clamp-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-3">
                {item.description || "Dokumen peraturan resmi. Klik tombol di bawah untuk melihat isi file."}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              {/* Tombol LIHAT */}
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-4 bg-gray-300 text-gray-700 rounded-2xl font-black text-[11px] uppercase tracking-wider hover:bg-blue-600 transition active:scale-95"
              >
                👀 Lihat
              </a>
              
              {/* Tombol DOWNLOAD */}
              <a
                href={`/api/download?url=${encodeURIComponent(item.fileUrl)}&name=${encodeURIComponent(item.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-4 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-wider hover:bg-blue-600 transition shadow-lg shadow-gray-100 active:scale-95"
              >
                📥 Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* No Data State */}
      {initialData.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-4xl border border-dashed border-gray-200 text-gray-400 italic text-sm">
          Data peraturan belum tersedia...
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button 
            disabled={currentPage <= 1}
            onClick={() => updateURL("page", (currentPage - 1).toString())}
            className="px-6 py-3 rounded-xl bg-white border border-gray-100 text-xs font-bold disabled:opacity-30 hover:bg-gray-50 transition shadow-sm"
          >
            Prev
          </button>
          
          <span className="text-xs font-bold text-gray-500">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button 
            disabled={currentPage >= totalPages}
            onClick={() => updateURL("page", (currentPage + 1).toString())}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold disabled:opacity-30 shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}