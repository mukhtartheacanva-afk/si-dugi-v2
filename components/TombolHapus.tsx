"use client";
import { hapusSiswa } from "@/app/siswa/actions";

export default function TombolHapus({ id }: { id: number }) {
  const handleHapus = async () => {
    if (confirm("Yakin mau hapus data siswa ini?")) {
      await hapusSiswa(id);
    }
  };

  return (
    <button 
      onClick={handleHapus}
      className="text-red-600 hover:underline text-sm font-medium"
    >
      Hapus
    </button>
  );
}