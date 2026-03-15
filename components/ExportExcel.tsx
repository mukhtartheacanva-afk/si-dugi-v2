"use client";

import * as XLSX from "xlsx";
import { Siswa } from "@prisma/client";

export default function ExportExcel({ data }: { data: Siswa[] }) {
  const handleExport = () => {
    // 1. Pilih data mana saja yang mau dimasukkan ke Excel
    const dataUntukExcel = data.map((s, index) => ({
      No: index + 1,
      Nama: s.nama,
      Kelas: s.kelas,
      Status: s.status,
      "Tanggal Input": s.createdAt.toLocaleDateString("id-ID"),
    }));

    // 2. Buat Worksheet (lembar kerja)
    const worksheet = XLSX.utils.json_to_sheet(dataUntukExcel);
    
    // 3. Buat Workbook (filenya)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");

    // 4. Download file
    XLSX.writeFile(workbook, "Data_Siswa_SiDugi.xlsx");
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md transition flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export Excel
    </button>
  );
}