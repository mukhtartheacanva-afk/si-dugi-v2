import { prisma } from "@/lib/prisma";
import ModalTambah from "@/components/ModalTambah";
import ModalEdit from "@/components/ModalEdit";
import TombolHapus from "@/components/TombolHapus";
import SearchBar from "@/components/SearchBar";
import PaginationControls from "@/components/PaginationControls";
import ExportExcel from "@/components/ExportExcel";
import ImportExcel from "@/components/ImportExcel";
import LimitControl from "@/components/LimitControl";
import Link from "next/link"; // Tambahkan Link untuk navigasi ke profil

// UPDATE: Interface menyesuaikan model User
interface Siswa {
  id: string; // Sesuaikan dengan tipe ID di database lo (biasanya string kalau pakai Prisma ID)
  nama: string;
  email: string;
  kelas: string | null;
  status: string;
  role: string;
  createdAt: Date;
}

export default async function SiswaPage(props: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.search || "";
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = Number(searchParams.limit) || 5;

  const semuaSiswa = await prisma.user.findMany({
    where: {
      role: "USER",
      OR: [
        { nama: { contains: query } },
        { email: { contains: query } },
        { kelas: { contains: query } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const totalSiswa = semuaSiswa.length;
  const totalPages = Math.ceil(totalSiswa / itemsPerPage);

  const dataSiswa = semuaSiswa.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Data Siswa</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total database: <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{totalSiswa}</span> Siswa
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-75 md:max-w-xs">
          <SearchBar />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ImportExcel />
          <ExportExcel data={semuaSiswa} />
          <div className="h-8 w-px bg-gray-200 mx-1 hidden lg:block"></div>
          <ModalTambah />
          <div className="h-8 w-px bg-gray-200 mx-1 hidden lg:block"></div>
          <div className="flex items-center gap-2">
            <LimitControl currentLimit={itemsPerPage} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">No</th>
              <th className="p-4 font-semibold text-gray-600">Nama Lengkap</th>
              <th className="p-4 font-semibold text-gray-600">Email / Akun</th>
              <th className="p-4 font-semibold text-gray-600">Kelas</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dataSiswa.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                  Belum ada data siswa.
                </td>
              </tr>
            ) : (
              dataSiswa.map((siswa, index) => (
                <tr key={siswa.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-600">
                    {(currentPage - 1) * itemsPerPage + (index + 1)}
                  </td>
                  <td className="p-4 font-medium text-gray-800">{siswa.nama}</td>
                  <td className="p-4 text-gray-600 text-sm">{siswa.email}</td>
                  <td className="p-4 text-gray-600">{siswa.kelas || "-"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      siswa.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {siswa.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-center gap-3">
                    {/* TOMBOL PROFIL: Akses halaman edit profil siswa berdasarkan ID */}
                    <Link 
                      href={`/profil/${siswa.id}`} // Arahkan ke folder detail
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8D6E63] text-white text-xs font-bold rounded-lg hover:bg-[#5D4037] transition shadow-sm"
                      title="Lihat/Edit Profil Lengkap"
                    >
                      <span>Profil</span>
                    </Link>

                    <div className="h-4 w-px bg-gray-200"></div>

                    <ModalEdit siswa={siswa} /> 
                    <TombolHapus id={siswa.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls 
        currentPage={currentPage} 
        totalPages={totalPages}
      />
    </div>
  );
}