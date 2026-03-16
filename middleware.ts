import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

  // Jika mencoba akses dashboard tapi belum login
  if (!isLoggedIn && !isAuthPage) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Jika sudah login tapi malah mau buka halaman login lagi
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL("/siswa", req.nextUrl));
  }
});

// Daftarkan halaman mana saja yang mau dijaga "Satpam" ini
export const config = {
  matcher: ["/siswa/:path*", "/login", "/register"], // Tambahkan /register di sini
};