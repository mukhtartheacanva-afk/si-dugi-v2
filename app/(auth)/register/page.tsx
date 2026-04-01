"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrRegisterUser } from "@/lib/actions/user"; 
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const res = await createOrRegisterUser(formData);

    if (res.success) {
      alert("Registrasi Berhasil! Silakan Login.");
      router.push("/login");
    } else {
      setError(res.message || "Gagal mendaftar");
      setLoading(false);
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop')" 
      }}
    >
      {/* Overlay Gelap halus */}
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]"></div>

      <div className="relative max-w-lg w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header nuansa kayu */}
        <div className="bg-[#5D4037] p-8 text-center text-white">
          <h1 className="text-3xl font-black tracking-tight">Daftar Akun Siswa</h1>
          <p className="text-stone-300 text-sm mt-1 italic">Gabung bersama komunitas SI-DUGI v2</p>
        </div>

        <div className="p-8">
          <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Nama Lengkap */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-400 mb-1 ml-1">Nama Lengkap</label>
              <input
                name="nama"
                type="text"
                required
                className="w-full p-4 bg-stone-100 border-none rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none transition text-stone-800"
                placeholder="Nama sesuai absen"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-400 mb-1 ml-1">Email Aktif</label>
              <input
                name="email"
                type="email"
                required
                className="w-full p-4 bg-stone-100 border-none rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none transition text-stone-800"
                placeholder="nama@siswa.com"
              />
            </div>

            {/* Pilih Kelas (Tambahan agar data lengkap) */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold uppercase text-stone-400 mb-1 ml-1">Kelas</label>
              <select
                name="kelas"
                required
                className="w-full p-4 bg-stone-100 border-none rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none transition text-stone-800 appearance-none"
              >
                <option value="">Pilih...</option>
                <option value="GANISPH">GANISPH</option>
                <option value="TUK">TUK</option>
                <option value="UMUM">UMUM</option>
              </select>
            </div>

            {/* Password */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold uppercase text-stone-400 mb-1 ml-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full p-4 bg-stone-100 border-none rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none transition text-stone-800"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="md:col-span-2 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 flex items-center">
                <span className="mr-2 text-base">⚠️</span> {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${
                  loading 
                  ? "bg-stone-400" 
                  : "bg-linear-to-r from-[#5D4037] to-[#8D6E63] hover:from-[#4E342E] hover:to-[#6D4C41]"
                }`}
              >
                {loading ? "MENYIAPKAN AKUN..." : "DAFTAR SEKARANG"}
              </button>
            </div>
          </form>

          {/* Link balik ke Login */}
          <div className="mt-8 text-center pt-6 border-t border-stone-100">
            <p className="text-sm text-stone-500 font-medium">
              Sudah pernah mendaftar?
            </p>
            <Link href="/login" className="mt-1 inline-block text-[#5D4037] font-bold hover:text-green-700 transition-colors">
              &larr; Kembali ke Login
            </Link>
          </div>
        </div>

        <div className="bg-stone-50 p-4 text-center">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
            Secure Student Registration System
          </p>
        </div>
      </div>
    </div>
  );
}