"use client";
import { useState } from "react";
import { tambahSiswa } from "@/app/siswa/actions";

export default function ModalTambah() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md"
      >
        + Tambah Siswa
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Tambah Siswa Baru</h2>
            
            <form action={async (formData) => {
              await tambahSiswa(formData);
              setIsOpen(false);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input name="nama" type="text" required className="w-full border p-2 rounded-md mt-1" placeholder="Contoh: Budi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kelas</label>
                <input name="kelas" type="text" required className="w-full border p-2 rounded-md mt-1" placeholder="Contoh: 12-IPA-1" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}