"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterKategori({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (val) {
      params.set("category", val);
    } else {
      params.delete("category");
    }
    
    // Reset ke halaman 1 setiap kali ganti kategori
    params.set("page", "1");
    
    router.push(`/admin/materi?${params.toString()}`);
  };

  return (
    <select
      onChange={(e) => handleCategoryChange(e.target.value)}
      defaultValue={searchParams.get("category") || ""}
      className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none bg-gray-50 font-medium cursor-pointer hover:bg-white transition-all"
    >
      <option value="">Semua Kategori</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat.toUpperCase()}
        </option>
      ))}
    </select>
  );
}