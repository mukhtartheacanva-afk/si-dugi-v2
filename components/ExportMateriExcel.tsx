"use client";

import * as XLSX from "xlsx";
import { getMateriForExport } from "@/lib/materiActions";
import { useState } from "react";

interface ExportProps {
  query: string;
  category: string;
}

export default function ExportMateriExcel({ query, category }: ExportProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      // 1. Ambil data
      const data = await getMateriForExport(query, category);

      if (!data || data.length === 0) {
        alert("Gak ada data yang bisa di-export, bro. Coba cek filternya.");
        return;
      }

      // 2. Mapping data biar kolomnya rapi di Excel
      const excelData = data.map((item, index) => ({
        "No": index + 1,
        "Judul Materi": item.judul,
        "Kategori": item.kategori.toUpperCase(),
        "Link YouTube": item.urlYoutube,
        "Deskripsi": item.deskripsi || "-",
        "Tanggal Dibuat": new Date(item.createdAt).toLocaleDateString("id-ID"),
      }));

      // 3. Buat Workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Materi");

      // 4. Atur lebar kolom (opsional, biar cantik)
      const wscols = [
        { wch: 5 },  // No
        { wch: 40 }, // Judul
        { wch: 15 }, // Kategori
        { wch: 40 }, // Link
        { wch: 30 }, // Deskripsi
        { wch: 15 }, // Tanggal
      ];
      worksheet["!cols"] = wscols;

      // 5. Download
      XLSX.writeFile(workbook, `Data_Materi_Dashboard_${category || "Semua"}.xlsx`);
    } catch (error) {
      console.error("Export Error:", error);
      alert("Waduh, gagal export nih. Cek konsol browser ya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`${
        loading ? "bg-emerald-300" : "bg-emerald-500 hover:bg-emerald-600"
      } text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm flex items-center gap-2`}
    >
      <span>{loading ? "⏳" : "📊"}</span>
      {loading ? "Processing..." : "Export Excel"}
    </button>
  );
}