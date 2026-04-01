"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau Password salah!");
      setIsLoading(false);
    } else {
      router.push("/"); 
      router.refresh();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop')" 
      }}
    >
      {/* Overlay Gelap agar form lebih menonjol */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
        
        {/* Header dengan Aksen Kayu/Coklat */}
        <div className="bg-[#5D4037] p-8 text-center text-white">
          <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
            SI-DUGI <span className="text-green-400">v2</span>
          </h2>
          <p className="text-stone-200 text-sm mt-2 font-medium italic">
            "Sistem Informasi Terpadu & Edukasi Digital"
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center shadow-sm">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5 ml-1">Alamat Email</label>
              <input
                type="email"
                required
                className="w-full p-4 bg-stone-100 border-none rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none transition text-stone-800 placeholder:text-stone-400"
                placeholder="admin@sidugi.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone- stone-500 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                required
                className="w-full p-4 bg-stone-100 border-none rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none transition text-stone-800"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                isLoading 
                ? "bg-stone-400 cursor-not-allowed" 
                : "bg-linear-to-r from-[#5D4037] to-[#8D6E63] hover:from-[#4E342E] hover:to-[#6D4C41]"
              }`}
            >
              {isLoading ? "Menghubungkan..." : "Masuk Sekarang"}
            </button>
          </form>

          {/* Bagian Register */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-stone-500 text-sm">
              Belum punya akun siswa?
            </p>
            <Link 
              href="/register" 
              className="mt-2 inline-block text-[#5D4037] font-bold hover:text-green-700 transition-colors"
            >
              Daftar Mandiri di Sini &rarr;
            </Link>
          </div>
        </div>

        {/* Footer Kecil */}
        <div className="bg-stone-50 p-4 text-center">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
            © 2026 Developer Surabaya - Next.js v16
          </p>
        </div>
      </div>
    </div>
  );
}