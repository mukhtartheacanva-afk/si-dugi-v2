"use client";

import { useState } from "react";
import { tambahMateri } from "@/lib/materiActions";

export default function ModalTambahMateri() {
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select name="kategori" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="frontend">Frontend Dev</option>
                  <option value="backend">Backend Integration</option>
                  <option value="database">Database Prisma</option>
                </select>
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
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">Simpan Materi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}