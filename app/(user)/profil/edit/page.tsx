import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import FormEditProfil from "./FormEditProfil";

export default async function EditProfilPage(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await auth();
  const query = await props.searchParams;
  
  if (!session?.user?.email) redirect("/login");

  // 1. Cari data user di DB berdasarkan email session 
  // Ini cara paling aman kalau session.user.id lo masih NaN/Undefined
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!currentUser) redirect("/login");

  const myId = currentUser.id; // Ini pasti Int dari DB

  // 2. Tentukan targetId
  const idFromParams = query.id ? Number(query.id) : null;
  const targetId = (idFromParams && !isNaN(idFromParams)) ? idFromParams : myId;

  // 3. Proteksi Keamanan
  if (idFromParams && idFromParams !== myId && (session.user as any).role !== "ADMIN") {
    redirect("/profil");
  }

  // 4. AMBIL DATA LENGKAP (Termasuk Profile)
  const userWithProfile = await prisma.user.findUnique({
    where: { id: targetId },
    include: { profile: true },
  });

  if (!userWithProfile) redirect("/profil");

  return (
    <div className="min-h-screen bg-[#F5F5F4] p-6 lg:p-10 lg:pl-72 flex justify-center"> 
      <div className="w-full max-w-5xl">
        <FormEditProfil initialData={userWithProfile} targetUserId={targetId.toString()} />
      </div>
    </div>
  );
}