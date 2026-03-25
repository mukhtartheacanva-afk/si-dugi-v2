import { auth } from "@/auth";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* SCRIPT ANTI-FLASH BIRU: Mengecek theme sebelum render UI */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'nature') {
                    document.documentElement.setAttribute('data-theme', 'nature');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen font-sans">
        {session ? (
          <>
            <Sidebar user={session?.user as any} />
            <div className="flex-1 flex flex-col">
              <Header user={session?.user as any} />
              <main className="p-6">{children}</main>
            </div>
          </>
        ) : (
          <div className="flex-1">{children}</div>
        )}
      </body>
    </html>
  );
}