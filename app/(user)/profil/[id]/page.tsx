import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

// UPDATE: Tambahkan Promise pada tipe props params
export default async function DetailProfilPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  // FIX: Await params dulu baru ambil id-nya
  const params = await props.params;
  const targetId = Number(params.id);

  // Validasi jika ID bukan angka yang valid
  if (isNaN(targetId)) notFound();

  const user = await prisma.user.findUnique({
    where: { id: targetId },
    include: { profile: true },
  });

  if (!user) notFound();

  return (
    <div className="min-h-screen bg-[#F5F5F4] p-6 lg:p-10 lg:pl-30">
      <div className="flex justify-between items-center mb-6">
        <Link href="/siswa" className="text-[#8D6E63] font-bold flex items-center gap-2 hover:underline">
          ← Kembali ke Daftar Siswa
        </Link>
        
        {(session.user as any).role === "ADMIN" && (
          <Link 
            href={`/profil/edit?id=${user.id}`}
            className="bg-[#5D4037] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#4E342E] transition flex items-center gap-2"
          >
            Edit Profil ✏️
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Kiri: Profil & Berkas */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm text-center">
            <div className="w-32 h-32 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-black text-stone-400">
              {user.nama?.substring(0, 2).toUpperCase()}
            </div>
            <h2 className="text-xl font-black text-stone-800">{user.nama}</h2>
            <p className="text-stone-400 text-sm mb-4 uppercase">{user.role}</p>
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black uppercase">
              STATUS: {user.status || 'AKTIF'}
            </span>
          </div>

          <div className="bg-[#5D4037] rounded-[2.5rem] p-8 shadow-sm text-white">
            <h3 className="font-black text-xs uppercase tracking-widest mb-4 border-b border-[#8D6E63] pb-2">Berkas Terunggah</h3>
            <div className="space-y-3">
              <FileLink label="KTP" path={user.profile?.fileKtp} />
              <FileLink label="Kartu Ganis" path={user.profile?.fileKartuGanis} />
              <FileLink label="SK Penugasan" path={user.profile?.fileSkPenugasan} />
            </div>
          </div>
        </div>

        {/* Card Kanan: Informasi Detail */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 self-start">
          <div>
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 border-b pb-2">Informasi Dasar</h3>
            <DetailItem label="NIK" value={user.profile?.nik} />
            <DetailItem label="Email" value={user.email} />
            <DetailItem label="No. HP" value={user.profile?.noHp} />
            <DetailItem label="Alamat KTP" value={user.profile?.alamatKtp} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 border-b pb-2">Detail Ganis</h3>
            <DetailItem label="Pekerjaan" value={user.profile?.pekerjaan} />
            <DetailItem label="Nama Perusahaan" value={user.profile?.namaPerusahaan} />
            <DetailItem label="Alamat Perusahaan" value={user.profile?.alamatPerusahaan} />
            <DetailItem label="Kualifikasi" value={user.profile?.kualifikasi} />
            <DetailItem label="No. Reg Ganis" value={user.profile?.noRegGanis} />
            <DetailItem label="SK Penugasan" value={user.profile?.skPenugasan} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value?: string | null }) {
  return (
    <div className="mb-4">
      <p className="text-[9px] font-black text-stone-400 uppercase">{label}</p>
      <p className="text-stone-800 font-bold">{value || "-"}</p>
    </div>
  );
}

function FileLink({ label, path }: { label: string, path?: string | null }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-stone-300">{label}</span>
      {path ? (
        <a href={path} target="_blank" className="text-white font-bold hover:underline flex items-center gap-1">
          LIHAT BERKAS 📄
        </a>
      ) : (
        <span className="text-stone-500 italic text-xs">Belum ada</span>
      )}
    </div>
  );
}