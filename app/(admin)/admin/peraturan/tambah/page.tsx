"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRegulation } from "@/lib/actions/regulation";
import Link from "next/link";

export default function TambahPeraturanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await createRegulation(formData);
    if (res.success) {
      alert("Berhasil menyimpan peraturan!");
      router.push("/admin/peraturan");
      router.refresh();
    } else {
      alert(res.message || "Gagal menyimpan");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/peraturan" className="p-2 hover:bg-gray-100 rounded-full transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Tambah Peraturan Baru</h1>
      </div>

      <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        {/* JUDUL */}
        <div>
          <label className="block text-sm font-bold mb-2 opacity-70">Judul Peraturan</label>
          <input 
            name="title" 
            required 
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" 
            placeholder="Contoh: UU No. 1 Tahun 2026..." 
          />
        </div>

        {/* KATEGORI */}
        <div>
          <label className="block text-sm font-bold mb-2 opacity-70">Kategori</label>
          <select name="category" required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition">
            <option value="Undang-Undang">Undang-Undang</option>
            <option value="Peraturan Pemerintah">Peraturan Pemerintah</option>
            <option value="Peraturan Menteri">Peraturan Menteri</option>
            <option value="Peraturan Daerah">Peraturan Daerah</option>
            <option value="Peraturan Gubernur">Peraturan Gubernur</option>
            <option value="Surat Edaran">Surat Edaran</option>
            <option value="Surat Keputusan">Surat Keputusan</option>
            <option value="SNI">SNI</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* DESKRIPSI (Gue balikin lagi bro!) */}
        <div>
          <label className="block text-sm font-bold mb-2 opacity-70">Deskripsi Singkat</label>
          <textarea 
            name="description" 
            rows={3}
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" 
            placeholder="Jelaskan isi singkat peraturan di sini..."
          />
        </div>

        <hr className="border-gray-100" />

        {/* OPSI 1: DRIVE */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <label className="block text-[10px] font-bold text-blue-600 mb-2 uppercase tracking-wider">Opsi A: Link Google Drive</label>
          <input 
            name="driveLink" 
            type="url" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400" 
            placeholder="https://drive.google.com/file/d/..." 
          />
          <p className="text-[10px] text-gray-500 mt-2 italic">*Gunakan link Drive jika file PDF lebih dari 10MB.</p>
        </div>

        <div className="text-center text-xs font-bold opacity-30 my-2">— ATAU —</div>

        {/* OPSI 2: UPLOAD */}
        <div className="relative border-2 border-dashed border-gray-200 p-8 text-center rounded-xl hover:border-blue-400 hover:bg-gray-50/50 transition group">
          <input 
            name="file" 
            type="file" 
            accept=".pdf" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
          <div className="space-y-1">
            <p className="text-sm font-bold opacity-50 group-hover:opacity-100 transition">Opsi B: Upload PDF Manual</p>
            <p className="text-[10px] opacity-40">Klik atau seret file PDF ke sini (Maks 10MB)</p>
          </div>
        </div>

        {/* BUTTON SUBMIT */}
        <button 
          disabled={loading} 
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
        >
          {loading ? "Sedang Menyimpan..." : "Simpan Peraturan"}
        </button>
      </form>
    </div>
  );
}