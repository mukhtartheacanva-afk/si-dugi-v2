import { auth } from "@/auth";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./globals.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Ambil data session dari server
  const session = await auth();

  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* HANYA tampilkan Sidebar & Header jika user sudah login.
           Jika di halaman login (belum login), biarkan children (halaman login) tampil full.
        */}
        {session ? (
          <>
            {/* Sisi Kiri - Sidebar */}
            <Sidebar user={session?.user as any} />

            {/* Sisi Kanan - Konten Utama + Header */}
            <div className="flex-1 flex flex-col">
              <Header user={session?.user as any} />
              <main className="p-6">
                {children}
              </main>
            </div>
          </>
        ) : (
          /* Tampilan untuk halaman login (tanpa sidebar/header) */
          <div className="flex-1">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}