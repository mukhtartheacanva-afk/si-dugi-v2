"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { importMateriFromExcel } from "@/lib/materiActions";

export default function ImportMateriExcel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Convert Excel ke JSON
        // Pastikan header di Excel lo nanti: judul, kategori, urlYoutube, deskripsi
        const rawData = XLSX.utils.sheet_to_json(ws);

        if (rawData.length === 0) {
          alert("File Excel kosong, bro!");
          return;
        }

        const res = await importMateriFromExcel(rawData);

        if (res.success) {
          alert(`Mantap! Berhasil import ${res.count} materi.`);
        } else {
          alert("Gagal import, cek format Excel lo.");
        }
      } catch (err) {
        alert("Error baca file Excel.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx, .xls"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="bg-blue-100 text-blue-700 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-200 transition shadow-sm flex items-center gap-2"
      >
        <span>📥</span> {isImporting ? "Importing..." : "Import Excel"}
      </button>
    </>
  );
}