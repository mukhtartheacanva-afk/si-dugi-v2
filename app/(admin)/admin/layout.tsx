import { auth } from "@/auth";
import Header from "../../../components/Header"; 
import Sidebar from "../../../components/Sidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Jika tidak login atau bukan admin, lempar ke dashboard user
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      {/* Kirim prop role admin ke sidebar */}
      <Sidebar user={session.user as any} role="ADMIN" />
      
      <div className="flex-1 flex flex-col">
        <Header user={session.user as any} />
        <main className="p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}