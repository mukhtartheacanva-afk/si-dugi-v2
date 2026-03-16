"use client";

import { useState } from "react";
import { updateMateri } from "@/lib/materiActions";

export default function ModalEditMateri({ materi }: { materi: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tombol Pemicu Modal */}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Edit Materi</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <form 
              action={async (formData) => {
                await updateMateri(materi.id, formData);
                setIsOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Materi</label>
                <input name="judul" defaultValue={materi.judul} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select name="kategori" defaultValue={materi.kategori} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="frontend">Frontend Dev</option>
                  <option value="backend">Backend Integration</option>
                  <option value="database">Database Prisma</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL YouTube</label>
                <input name="urlYoutube" defaultValue={materi.urlYoutube} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://youtube.com/watch?v=..." required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea name="deskripsi" defaultValue={materi.deskripsi} rows={3} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}