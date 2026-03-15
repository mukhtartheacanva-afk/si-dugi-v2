"use client";

import { useRef } from "react";
import * as XLSX from "xlsx";
import { importSiswa } from "@/app/siswa/actions";

export default function ImportExcel() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const bstr = event.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      
      // Ambil sheet pertama
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      // Ubah jadi JSON
      const data = XLSX.utils.sheet_to_json(sheet);

      if (data.length > 0) {
        if (confirm(`Impor ${data.length} data siswa?`)) {
          await importSiswa(data);
          alert("Berhasil impor data!");
        }
      }
      
      // Reset input file agar bisa upload file yang sama lagi jika perlu
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-600 shadow-md transition flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Import Excel
      </button>
    </div>
  );
}