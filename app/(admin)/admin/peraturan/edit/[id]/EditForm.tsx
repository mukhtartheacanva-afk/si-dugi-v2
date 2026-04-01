"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateRegulation } from "@/lib/actions/regulation";
import Link from "next/link";

export default function EditForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Cek apakah data saat ini adalah link drive atau file lokal
  const isDrive = initialData.fileUrl.startsWith("http");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");

    const res = await updateRegulation(initialData.id, formData);

    if (res.success) {
      alert("Peraturan berhasil diperbarui!");
      router.push("/admin/peraturan");
      router.refresh();
    } else {
      setMessage(res.message || "Gagal memperbarui data");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <form action={handleSubmit} className="space-y-5" encType="multipart/form-data">
        
        {/* Input Judul */}
        <div className="space-y-2">
          <label className="text-sm font-bold opacity-70">Judul Peraturan</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={initialData.title}
            className="w-full p-3 border rounded-xl bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Input Kategori */}
        <div className="space-y-2">
          <label className="text-sm font-bold opacity-70">Kategori</label>
          <select
            name="category"
            required
            defaultValue={initialData.category}
            className="w-full p-3 border rounded-xl bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
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

        {/* Input Deskripsi */}
        <div className="space-y-2">
          <label className="text-sm font-bold opacity-70">Deskripsi</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialData.description || ""}
            className="w-full p-3 border rounded-xl bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <hr className="border-gray-100 my-4" />

        {/* OPSI 1: LINK GOOGLE DRIVE */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
            <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider">
              Opsi A: Link Google Drive
            </label>
            <input 
              name="driveLink" 
              type="url" 
              // Pakai defaultValue agar input bisa diedit
              defaultValue={isDrive ? initialData.fileUrl : ""}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-white" 
              placeholder="https://drive.google.com/..." 
            />
            <p className="text-[10px] text-gray-500 italic">
              {isDrive 
                ? "✅ Saat ini menggunakan Drive. Ubah link di atas atau upload file di bawah untuk ganti." 
                : "ℹ️ Saat ini menggunakan File Lokal. Isi link di atas jika ingin ganti ke Google Drive."}
            </p>
          </div>

        <div className="text-center text-xs font-bold opacity-30 my-2">— ATAU —</div>

        {/* OPSI 2: UPLOAD FILE BARU */}
        <div className="space-y-2">
          <label className="text-sm font-bold opacity-70">Opsi B: Upload PDF Baru</label>
          
                    
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-gray-50 transition cursor-pointer relative group">
            <input
              name="file"
              type="file"
              accept=".pdf"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="space-y-1">
              <p className="text-sm font-bold opacity-50 group-hover:opacity-100 transition">Ganti dengan File PDF Lokal</p>
              <p className="text-[10px] opacity-40 italic">
                *Klik di sini jika ingin mengubah sumber menjadi file upload (Maks 10MB)
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {message && (
          <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
            {message}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Link
            href="/admin/peraturan"
            className="flex-1 text-center py-4 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`flex-2 py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "Sedang Mengupdate..." : "Update Peraturan"}
          </button>
        </div>
      </form>
    </div>
  );
}