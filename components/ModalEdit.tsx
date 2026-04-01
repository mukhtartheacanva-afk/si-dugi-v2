"use client";
import { useState } from "react";
import { updateSiswa } from "@/app/(admin)/admin/siswa/actions";

// UPDATE: Sesuaikan interface dengan kolom di tabel User
interface SiswaData {
  id: number;
  nama: string;
  email: string; // Tambahkan ini
  kelas: string | null;
  status: string;
}

export default function ModalEdit({ siswa }: { siswa: SiswaData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleAction(formData: FormData) {
    setIsPending(true);
    await updateSiswa(formData);
    setIsOpen(false);
    setIsPending(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 text-sm font-bold transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 text-left">
            <h2 className="text-2xl font-bold mb-1 text-gray-800">Edit Data Siswa</h2>
            <p className="text-sm text-gray-500 mb-6">Perbarui informasi profil atau status siswa.</p>
            
            <form action={handleAction} className="space-y-4">
              {/* ID Tersembunyi tetap wajib */}
              <input type="hidden" name="id" value={siswa.id} />

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Nama Lengkap</label>
                <input 
                  name="nama" 
                  defaultValue={siswa.nama} 
                  required 
                  className="w-full border-none bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                />
              </div>

              {/* INPUT EMAIL (WAJIB ADA) */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Email / Username</label>
                <input 
                  name="email" 
                  type="email"
                  defaultValue={siswa.email} 
                  required 
                  className="w-full border-none bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Kelas</label>
                <select 
                  name="kelas" 
                  defaultValue={siswa.kelas || ""} 
                  required 
                  className="w-full border-none bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                >
                  <option value="GANISPH">GANISPH</option>
                  <option value="TUK">TUK</option>
                  <option value="UMUM">UMUM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Status Keaktifan</label>
                <select 
                  name="status" 
                  defaultValue={siswa.status} 
                  className="w-full border-none bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none text-sm font-semibold text-blue-600"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Lulus">Lulus</option>
                  <option value="Keluar">Keluar</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="px-5 py-2.5 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className={`px-8 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all ${
                    isPending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                  }`}
                >
                  {isPending ? "Menyimpan..." : "Update Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}