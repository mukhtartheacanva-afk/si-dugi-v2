"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PaginationControls({ 
  currentPage, 
  totalPages 
}: { 
  currentPage: number; 
  totalPages: number 
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <button
        disabled={currentPage <= 1}
        onClick={() => createPageURL(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-30"
      >
        Prev
      </button>
      
      <span className="px-3 py-1 font-medium">
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => createPageURL(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
}