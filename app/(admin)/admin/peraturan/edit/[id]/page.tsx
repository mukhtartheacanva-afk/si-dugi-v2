import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Ambil data dari database berdasarkan ID
  const data = await prisma.regulation.findUnique({ 
    where: { id } 
  });

  // Jika data tidak ada, tampilkan halaman 404
  if (!data) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Peraturan</h1>
      
      {/* PASTIKAN PAKAI initialData={data} BIAR TIDAK ERROR LAGI */}
      <EditForm initialData={data} />
    </div>
  );
}