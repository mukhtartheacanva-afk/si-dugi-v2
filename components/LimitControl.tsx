"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LimitControl({ currentLimit }: { currentLimit: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", value);
    params.set("page", "1"); // Reset ke halaman 1 tiap kali limit berubah
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span>Tampilkan:</span>
      <select
        value={currentLimit}
        onChange={(e) => handleLimitChange(e.target.value)}
        className="border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-300"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  );
}