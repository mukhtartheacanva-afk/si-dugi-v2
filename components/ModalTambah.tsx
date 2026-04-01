"use client";
import { useState } from "react";
import { tambahSiswa } from "@/app/(admin)/admin/siswa/actions";

export default function ModalTambah() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleAction(formData: FormData) {
    setIsPending(true);
    const result = await tambahSiswa(formData);
    
    if (result?.success === false) {
      alert(result.message);
      setIsPending(false);
    } else {
      setIsOpen(false);
      setIsPending(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95 font-semibold"
      >
        + Tambah Siswa
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tambah Siswa Baru</h2>
              <p className="text-sm text-gray-500">Data ini akan otomatis menjadi akun login siswa.</p>
            </div>
            
            <form action={handleAction} className="space-y-4">
              {/* INPUT NAMA */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Nama Lengkap</label>
                <input 
                  name="nama" 
                  type="text" 
                  required 
                  className="w-full border-none bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                  placeholder="Nama sesuai ijazah" 
                />
              </div>

              {/* INPUT EMAIL (BARU & WAJIB) */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Email / Username</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full border-none bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                  placeholder="nama@siswa.com" 
                />
              </div>

              {/* INPUT KELAS */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Kelas</label>
                <select 
                  name="kelas" 
                  required 
                  className="w-full border-none bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                >
                  <option value="">Pilih Kelas</option>
                  <option value="GANISPH">GANISPH</option>
                  <option value="TUK">TUK</option>
                  <option value="UMUM">UMUM</option>
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 mt-4">
                <p className="text-[10px] text-blue-700 leading-relaxed italic">
                  * Password default siswa adalah <strong>123456</strong>. Siswa bisa login menggunakan email yang didaftarkan.
                </p>
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
                    isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                  }`}
                >
                  {isPending ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}