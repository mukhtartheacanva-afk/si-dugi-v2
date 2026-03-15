import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* Sisi Kiri - Sidebar tetap di sini */}
        <Sidebar />

        {/* Sisi Kanan - Konten Utama + Header */}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}