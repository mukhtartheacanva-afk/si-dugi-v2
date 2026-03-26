"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfilMandiri } from "@/app/profil/actions";
import Link from "next/link";

// Tambahkan targetUserId di destructured props
export default function FormEditProfil({ 
  initialData, 
  targetUserId 
}: { 
  initialData: any; 
  targetUserId: string; 
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const res = await updateProfilMandiri(formData);

    if (res.success) {
      alert("Profil Berhasil Diperbarui!");
      // Jika yang edit adalah Admin, balikkan ke halaman data siswa
      if (initialData.role === "USER") {
        router.push("/siswa"); // Sesuaikan route data siswa lo
      } else {
        router.push("/profil");
      }
      router.refresh();
    } else {
      setMessage(res.message || "Gagal memperbarui profil. Coba lagi.");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    /* max-w-5xl supaya form tetap proporsional dan tidak kepanjangan di layar lebar */
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="mb-6">
        <Link href="/profil" className="text-[#8D6E63] font-bold flex items-center gap-2 hover:underline">
          ← Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
        {/* INPUT HIDDEN: Sangat penting agar Action tahu ID target */}
        <input type="hidden" name="userId" value={targetUserId} />

        <div className="bg-[#5D4037] p-8 text-white">
          <h1 className="text-2xl font-black">Lengkapi Data Personal</h1>
          <p className="text-stone-300 text-sm italic">
            {initialData.role === "USER" ? `Mengedit Profil: ${initialData.nama}` : "Pastikan data sesuai dengan dokumen asli"}
          </p>
        </div>

        <div className="p-8 space-y-10">
          {message && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm animate-pulse">
              ⚠️ {message}
            </div>
          )}

          {/* SECTION 1: Identitas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-[#8D6E63] font-black uppercase text-xs tracking-widest border-b pb-2">I. Identitas Kependudukan</h3>
            </div>
            <InputGroup 
              label="NIK (16 Digit)" 
              name="nik" 
              defaultValue={initialData?.profile?.nik} 
              placeholder="16 digit angka KTP" 
            />
            <InputGroup 
              label="Nomor WhatsApp" 
              name="noHp" 
              defaultValue={initialData?.profile?.noHp} 
              placeholder="0812xxxx" 
            />
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2 ml-1">Alamat Lengkap</label>
              <textarea 
                name="alamatKtp" 
                defaultValue={initialData?.profile?.alamatKtp}
                placeholder="Alamat lengkap sesuai KTP..."
                className="w-full p-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none transition h-28 text-stone-800"
              ></textarea>
            </div>
          </div>

          {/* SECTION 2: Pekerjaan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-50">
            <div className="md:col-span-2">
              <h3 className="text-[#8D6E63] font-black uppercase text-xs tracking-widest border-b pb-2">II. Detail Pekerjaan & Registrasi</h3>
            </div>
            <InputGroup label="Pekerjaan" name="pekerjaan" defaultValue={initialData?.profile?.pekerjaan} placeholder="GANIS/TUK/..." />
            <InputGroup label="Nama Perusahaan" name="namaPerusahaan" defaultValue={initialData?.profile?.namaPerusahaan} placeholder="PT/CV/UD..." />
            <InputGroup label="Alamat Perusahaan" name="alamatPerusahaan" defaultValue={initialData?.profile?.alamatPerusahaan} placeholder="Alamat Perusahaan" />
            <InputGroup label="Kualifikasi" name="kualifikasi" defaultValue={initialData?.profile?.kualifikasi} placeholder="GANISPH-PKB/PKG/PKL..." />
            <InputGroup label="No. Reg Ganis" name="noRegGanis" defaultValue={initialData?.profile?.noRegGanis} placeholder="REG-xxxx" />
            <InputGroup label="No. SK Penugasan" name="skPenugasan" defaultValue={initialData?.profile?.skPenugasan} placeholder="SK-xxxx" />
          </div>

          {/* SECTION 3: Upload */}
          <div className="space-y-6 pt-4 border-t border-stone-50">
            <h3 className="text-[#8D6E63] font-black uppercase text-xs tracking-widest border-b pb-2">III. Unggah Dokumen</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UploadBox label="KTP" name="fileKtp" isExist={!!initialData?.profile?.fileKtp} />
              <UploadBox label="Kartu Ganis" name="fileKartuGanis" isExist={!!initialData?.profile?.fileKartuGanis} />
              <UploadBox label="SK Penugasan" name="fileSkPenugasan" isExist={!!initialData?.profile?.fileSkPenugasan} />
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => router.back()} 
              className="px-8 py-4 text-stone-400 font-bold hover:text-stone-600"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-12 py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${loading ? "bg-stone-300 cursor-not-allowed" : "bg-[#5D4037] hover:bg-[#4E342E]"}`}
            >
              {loading ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Komponen Reusable Input (Tetap Aman)
function InputGroup({ label, name, placeholder, defaultValue }: any) {
  return (
    <div>
      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1.5 ml-1">{label}</label>
      <input 
        name={name}
        defaultValue={defaultValue}
        type="text"
        className="w-full p-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none transition text-stone-800"
        placeholder={placeholder}
      />
    </div>
  );
}

// Komponen Reusable Upload (Tetap Aman)
function UploadBox({ label, name, isExist }: any) {
  return (
    <div className={`border-2 border-dashed rounded-[2rem] p-6 text-center transition hover:border-[#8D6E63] ${isExist ? 'bg-green-50 border-green-200' : 'bg-stone-50 border-stone-200'}`}>
      <label className="cursor-pointer block">
        <span className="text-2xl block mb-2">{isExist ? '✅' : '📂'}</span>
        <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block">{label}</span>
        <input name={name} type="file" className="hidden" />
        <span className="text-[9px] text-stone-400 block mt-1 italic">{isExist ? 'File tersedia' : 'Klik untuk pilih'}</span>
      </label>
    </div>
  );
}