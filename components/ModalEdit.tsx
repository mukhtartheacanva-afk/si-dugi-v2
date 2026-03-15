"use client";
import { useState } from "react";
import { updateSiswa } from "@/app/siswa/actions";
// import { Siswa } from "@prisma/client";
interface SiswaData {
  id: number;
  nama: string;
  kelas: string;
  status: string;
}

export default function ModalEdit({ siswa }: { siswa: SiswaData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:underline text-sm font-medium"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl text-left">
            <h2 className="text-xl font-bold mb-4">Edit Data Siswa</h2>
            
            <form action={async (formData) => {
              await updateSiswa(formData);
              setIsOpen(false);
            }} className="space-y-4">
              {/* Input ID Tersembunyi (Penting!) */}
              <input type="hidden" name="id" value={siswa.id} />

              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input name="nama" defaultValue={siswa.nama} required className="w-full border p-2 rounded-md mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Kelas</label>
                <input name="kelas" defaultValue={siswa.kelas} required className="w-full border p-2 rounded-md mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" defaultValue={siswa.status} className="w-full border p-2 rounded-md mt-1">
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Lulus">Lulus</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Update Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}