import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilPage() {
  const session = await auth();

  // Proteksi: Jika belum login, tendang ke login
  if (!session) redirect("/login");

  // Ambil data user + detail profilnya
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
    include: { profile: true },
  });

  return (
    <div className="min-h-screen bg-[#F5F5F4] p-6 lg:p-10">
      <div className="max-w-10xl mx-auto">
        
        {/* Header Profil */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-[#4E342E]">Profil Personil</h1>
            <p className="text-stone-500 font-medium">Lengkapi dokumen dan data registrasi Ganis Anda</p>
          </div>
          <Link 
            href="/profil/edit" 
            className="bg-[#5D4037] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-[#4E342E] transition"
          >
            Edit Profil ✏️
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KARTU KIRI: FOTO & STATUS */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-[#8D6E63]"></div>
              <div className="relative z-10">
                <div className="w-32 h-32 bg-stone-200 border-4 border-white rounded-full mx-auto mb-4 overflow-hidden shadow-md">
                  <img 
                    src={user?.profile?.fotoProfil || "https://ui-avatars.com/api/?name=" + user?.nama} 
                    alt="Foto Profil" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-black text-[#4E342E]">{user?.nama}</h2>
                <p className="text-stone-400 text-sm font-bold uppercase tracking-widest">{user?.kelas || "Siswa"}</p>
                <div className="mt-4 inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase">
                  Status: {user?.status || "Aktif"}
                </div>
              </div>
            </div>

            {/* Konten File/Berkas Terunggah */}
            <div className="bg-[#5D4037] text-white rounded-[2.5rem] p-8 shadow-xl">
              <h3 className="font-bold border-b border-white/20 pb-4 mb-4">Berkas Terunggah</h3>
              <div className="space-y-4">
                <FileItem label="KTP" path={user?.profile?.fileKtp} />
                <FileItem label="Kartu Ganis" path={user?.profile?.fileKartuGanis} />
                <FileItem label="SK Penugasan" path={user?.profile?.fileSkPenugasan} />
              </div>
            </div>
          </div>

          {/* KARTU KANAN: DETAIL BIODATA */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-stone-100 h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <section className="space-y-6">
                  <h3 className="text-[#8D6E63] font-black uppercase text-xs tracking-[0.2em] border-b pb-2">Informasi Dasar</h3>
                  <DataField label="NIK" value={user?.profile?.nik} />
                  <DataField label="Email" value={user?.email} />
                  <DataField label="No. HP" value={user?.profile?.noHp} />
                  <DataField label="Alamat KTP" value={user?.profile?.alamatKtp} isLong />
                </section>

                <section className="space-y-6">
                  <h3 className="text-[#8D6E63] font-black uppercase text-xs tracking-[0.2em] border-b pb-2">Detail Ganis</h3>
                  <DataField label="Pekerjaan" value={user?.profile?.pekerjaan} />
                  <DataField label="Nama Perusahaan" value={user?.profile?.namaPerusahaan} />
                  <DataField label="Alamat Perusahaan" value={user?.profile?.alamatPerusahaan} />
                  <DataField label="Kualifikasi" value={user?.profile?.kualifikasi} />
                  <DataField label="No. Reg Ganis" value={user?.profile?.noRegGanis} />
                  <DataField label="SK Penugasan" value={user?.profile?.skPenugasan} />
                </section>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Komponen Kecil untuk Baris Data
function DataField({ label, value, isLong = false }: { label: string, value?: string | null, isLong?: boolean }) {
  return (
    <div className={isLong ? "col-span-2" : ""}>
      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">{label}</label>
      <p className="text-stone-800 font-semibold border-b border-stone-50 pb-2">
        {value || <span className="text-stone-300 italic font-normal">Belum dilengkapi</span>}
      </p>
    </div>
  );
}

// Komponen Kecil untuk List File
function FileItem({ label, path }: { label: string, path?: string | null }) {
  return (
    <div className="flex items-center justify-between group">
      <span className="text-sm font-medium text-stone-300">{label}</span>
      {path ? (
        <a href={path} target="_blank" className="text-green-400 font-bold text-xs hover:underline flex items-center">
          LIHAT BERKAS 📄
        </a>
      ) : (
        <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">Kosong</span>
      )}
    </div>
  );
}