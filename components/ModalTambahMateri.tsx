"use client";

import { useState } from "react";
import { tambahMateri } from "@/lib/materiActions";

// Kita terima list kategori unik dari server component (page.tsx)
export default function ModalTambahMateri({ categories = [] }: { categories?: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md flex items-center gap-2"
      >
        <span>+</span> Tambah Materi Baru
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Tambah Materi</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <form 
              action={async (formData) => {
                await tambahMateri(formData);
                setIsOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Materi</label>
                <input name="judul" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Belajar CRUD Next.js" required />
              </div>

              {/* TAHAP UPDATE: KATEGORI DINAMIS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <input 
                  name="kategori" 
                  list="category-options" 
                  placeholder="Pilih atau ketik kategori baru..."
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  required
                />
                <datalist id="category-options">
                  {/* Hapus pilihan manual "frontend", "backend" dst yang tadi lo tulis */}
                  {/* Biarkan datalist ini hanya berisi kategori unik dari database */}
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                <p className="text-[10px] text-gray-400 mt-1 italic">*Ketik untuk membuat kategori baru jika belum ada di daftar.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL YouTube</label>
                <input name="urlYoutube" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://www.youtube.com/watch?v=..." required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea name="deskripsi" rows={3} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jelaskan isi video ini..."></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Batal</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm transition">Simpan Materi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}