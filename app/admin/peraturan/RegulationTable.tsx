"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { deleteRegulation, exportRegulationsToExcel, importRegulationsFromExcel } from "@/lib/actions/regulation";
import Link from "next/link";

export default function RegulationTable({ 
  initialData, 
  total, 
  categories 
}: { 
  initialData: any[], 
  total: number, 
  categories: string[] 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // 1. Fungsi Update URL (Pencarian & Pagination)
  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    
    // Jika ganti filter/search, balik ke halaman 1
    if (key !== 'page') params.set('page', '1'); 
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // 2. Fungsi Hapus Data
  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus peraturan ini? File fisik juga akan terhapus.")) {
      setLoading(true);
      const res = await deleteRegulation(id);
      if (res.success) {
        alert("Berhasil dihapus");
      } else {
        alert("Gagal menghapus");
      }
      setLoading(false);
    }
  };

  // 3. Fungsi Export Excel
  const handleExport = async () => {
    setLoading(true);
    const res = await exportRegulationsToExcel();
    if (res.success && res.data) {
      const link = document.createElement("a");
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.data}`;
      link.download = `data-peraturan-${new Date().getTime()}.xlsx`;
      link.click();
    } else {
      alert("Gagal export excel");
    }
    setLoading(false);
  };

  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;
  const totalPages = Math.ceil(total / limit);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  setLoading(true);
  const res = await importRegulationsFromExcel(formData);
  if (res.success) {
    alert(res.message);
    router.refresh();
  } else {
    alert(res.message);
  }
  setLoading(false);
  // Reset input file biar bisa upload file yang sama lagi kalau mau
  e.target.value = "";
};

  return (
    <div className="space-y-4">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="font-bold opacity-60 uppercase text-xs tracking-widest">
          Daftar Peraturan ({total})
        </h2>
        <div className="flex gap-2 w-full md:w-auto">
          <label className="flex-1 md:flex-none cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm">
          📥 {loading ? "..." : "Import Excel"}
          <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImport} disabled={loading} />
          </label>
          <button 
            onClick={handleExport}
            disabled={loading}
            className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm"
          >
            📊 {loading ? "..." : "Export Excel"}
          </button>
          <Link 
            href="/admin/peraturan/tambah" 
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm text-center transition shadow-sm"
          >
            + Tambah Baru
          </Link>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-50 relative">
          <input
            type="text"
            placeholder="Cari judul peraturan..."
            className="w-full p-2 pl-3 border rounded-lg bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => updateURL("q", e.target.value)}
            defaultValue={searchParams.get("q") || ""}
          />
        </div>
        <select 
          className="p-2 border rounded-lg bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          onChange={(e) => updateURL("category", e.target.value)}
          defaultValue={searchParams.get("category") || ""}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat: string) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select 
          className="p-2 border rounded-lg bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          onChange={(e) => updateURL("limit", e.target.value)}
          defaultValue={limit}
        >
          <option value="5">Tampil: 5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-[10px] uppercase tracking-wider font-bold opacity-50">
              <tr>
                <th className="p-4">Informasi Peraturan</th>
                <th className="p-4 text-center">Kategori</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialData.length > 0 ? (
                initialData.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition group">
                    <td className="p-4">
                      <p className="font-bold text-sm text-gray-800 group-hover:text-blue-600 transition">
                        {item.title}
                      </p>
                      <p className="text-xs opacity-60 truncate max-w-xs md:max-w-md">
                        {item.description || "Tidak ada deskripsi"}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <a 
                        href={item.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 text-xs font-bold hover:underline"
                      >
                        Lihat
                      </a>
                      <Link 
                        href={`/admin/peraturan/edit/${item.id}`}
                        className="text-blue-600 text-xs font-bold hover:underline"
                      >
                        Edit
                      </Link>
                      <button 
                        disabled={loading}
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 text-xs font-bold hover:underline disabled:opacity-30"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-10 text-center opacity-50 text-sm italic">
                    Data tidak ditemukan...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex items-center justify-between text-[11px] px-2 font-bold opacity-60 uppercase tracking-tighter">
        <p>Halaman {currentPage} dari {totalPages || 1}</p>
        <div className="flex gap-2">
          <button 
            disabled={currentPage <= 1 || loading}
            onClick={() => updateURL("page", (currentPage - 1).toString())}
            className="px-4 py-2 border rounded-xl bg-white hover:bg-gray-50 disabled:opacity-30 transition shadow-sm"
          >
            Kembali
          </button>
          <button 
            disabled={currentPage >= totalPages || loading}
            onClick={() => updateURL("page", (currentPage + 1).toString())}
            className="px-4 py-2 border rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 transition shadow-sm"
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}