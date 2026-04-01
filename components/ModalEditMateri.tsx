"use client";

import { useState } from "react";
import { updateMateri } from "@/lib/materiActions";

export default function ModalEditMateri({ 
  materi, 
  categories = [] 
}: { 
  materi: any, 
  categories?: string[] 
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Buat ID unik untuk datalist agar tidak bentrok antar baris tabel
  const datalistId = `list-kategori-edit-${materi.id}`;
  // console.log("DATA KATEGORI DI MODAL:", categories);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
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
                <input name="judul" defaultValue={materi.judul} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <input 
                  name="kategori" 
                  list={datalistId} 
                  defaultValue={materi.kategori}
                  placeholder="Pilih atau ketik kategori baru..."
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  required
                  autoComplete="off"
                  // PAKAI INI SAJA: Lebih aman, nggak bikin error stack size
                  onMouseDown={(e) => {
                    // Menampilkan semua pilihan saat diklik tanpa memicu infinite loop
                    e.currentTarget.value = '';
                  }}
                  onBlur={(e) => {
                    // Kalau nggak jadi ngetik, balikin ke nilai awal
                    if (!e.currentTarget.value) e.currentTarget.value = materi.kategori;
                  }}
                />
                <datalist id={datalistId}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                <p className="text-[10px] text-gray-400 mt-1 italic">*Ketik atau klik untuk melihat saran kategori.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL YouTube</label>
                <input name="urlYoutube" defaultValue={materi.urlYoutube} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://youtube.com/watch?v=..." required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea name="deskripsi" defaultValue={materi.deskripsi} rows={3} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Batal</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}