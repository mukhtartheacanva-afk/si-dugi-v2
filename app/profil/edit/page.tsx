import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import FormEditProfil from "./FormEditProfil";

export default async function EditProfilPage() {
  const session = await auth();
  
  // Proteksi kalau belum login
  if (!session?.user?.email) redirect("/login");

  // AMBIL DATA: include profile itu wajib biar datanya ketarik
  const userWithProfile = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
      profile: true 
    },
  });

  if (!userWithProfile) redirect("/login");

  return (
    <div className="min-h-screen bg-[#F5F5F4] p-6 lg:p-10 flex justify-center"> 
      <div className="w-full max-w-5xl">
        {/* Lempar data user ke Client Component */}
        <FormEditProfil initialData={userWithProfile} />
      </div>
    </div>
  );
}