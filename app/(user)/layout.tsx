// app/(user)/layout.tsx
import { auth } from "@/auth";
import Header from "../../components/Header"; // Sesuaikan titik ../ nya
import Sidebar from "../../components/Sidebar"; // Sesuaikan titik ../ nya
import { redirect } from "next/navigation";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Jika tidak login, tendang ke halaman login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={session?.user as any} />
      <div className="flex-1 flex flex-col">
        <Header user={session?.user as any} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}