import { prisma } from "@/lib/prisma";
import ModalTambah from "@/components/ModalTambah"; // nampilin modal tambah data
import ModalEdit from "@/components/ModalEdit"; // nampilin modal edit data
import TombolHapus from "@/components/TombolHapus"; // nampilin tombol hapus
import SearchBar from "@/components/SearchBar"; // untuk searching data
import PaginationControls from "@/components/PaginationControls"; // untuk pagging
import ExportExcel from "@/components/ExportExcel"; // untuk export data excel
import ImportExcel from "@/components/ImportExcel"; // Import komponen baru
import LimitControl from "@/components/LimitControl"; // Limit control halaman

// Interface tetap aman
interface Siswa {
  id: number;
  nama: string;
  kelas: string;
  status: string;
  createdAt: Date;
}

export default async function SiswaPage(props: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.search || "";
  const currentPage = Number(searchParams.page) || 1;
  
  // AMBIL LIMIT DARI URL (Default ke 5 kalau tidak ada)
  const itemsPerPage = Number(searchParams.limit) || 5;

  // --- UPDATE: Query SEMUA Data untuk Export Excel ---
  // Kita tarik data tanpa take/skip tapi tetap pakai filter search agar hasil export relevan
  const semuaSiswa = await prisma.siswa.findMany({
    where: {
      OR: [
        { nama: { contains: query } },
        { kelas: { contains: query } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const totalSiswa = semuaSiswa.length;
  const totalPages = Math.ceil(totalSiswa / itemsPerPage);

  // --- DATA UNTUK TABEL (Hanya yang muncul di halaman aktif) ---
  const dataSiswa = semuaSiswa.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Siswa</h1>
        
        {/* Pembungkus tombol dibuat flex agar tidak turun-turun */}
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <div className="flex-1 lg:flex-none">
            <SearchBar />
          </div>
          <ImportExcel />
          <ExportExcel data={semuaSiswa} />
          <ModalTambah />
          
        </div>
        
      </div>
      {/* Tambahkan Kontrol Limit di atas tabel */}
        <div className="p-1 bg-gray-50/50 border-b-0 flex justify-end">
          <LimitControl currentLimit={itemsPerPage} />
        </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">No</th>
              <th className="p-4 font-semibold text-gray-600">Nama Lengkap</th>
              <th className="p-4 font-semibold text-gray-600">Kelas</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dataSiswa.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 italic">
                  Belum ada data siswa. Klik tambah data!
                </td>
              </tr>
            ) : (
              dataSiswa.map((siswa, index) => (
                <tr key={siswa.id} className="hover:bg-gray-50 transition">
                  {/* Perbaikan No: Menyesuaikan dengan halaman aktif */}
                  <td className="p-4 text-gray-600">
                    {(currentPage - 1) * itemsPerPage + (index + 1)}
                  </td>
                  <td className="p-4 font-medium text-gray-800">{siswa.nama}</td>
                  <td className="p-4 text-gray-600">{siswa.kelas}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      siswa.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {siswa.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-4">
                    <ModalEdit siswa={siswa} /> 
                    <TombolHapus id={siswa.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer Pagging */}
        <div className="flex justify-between items-center bg-gray-50 p-4 border-t">
          <p className="text-sm text-gray-600">
            Menampilkan {dataSiswa.length} dari {totalSiswa} siswa
          </p>
          <div className="flex gap-2">
            <PaginationControls currentPage={currentPage} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}