"use client";

import { useState, useMemo, useEffect } from "react"; 
import Link from "next/link";

export default function MateriPage() {
  const [dataMateri, setDataMateri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriTerpilih, setKategoriTerpilih] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default ke 10 biar lebih rapi

  // 1. Fetch Data dari API
  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const res = await fetch("/api/materi");
        const data = await res.json();
        setDataMateri(data);
      } catch (error) {
        console.error("Gagal load materi", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMateri();
  }, []);

  // 2. LOGIC DINAMIS: Ambil kategori unik dari dataMateri yang di-fetch
  const daftarKategoriDinamis = useMemo(() => {
    // Ambil semua string kategori, bersihkan spasi, lalu hilangkan duplikat pakai Set
    const kategoriUnik = Array.from(new Set(dataMateri.map((m) => m.kategori)));
    // Urutkan abjad agar rapi
    return kategoriUnik.sort();
  }, [dataMateri]);

  // 3. Logic Filtering
  const materiDifilter = useMemo(() => {
    return dataMateri.filter((m) => {
      const matchSearch = m.judul.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKategori = kategoriTerpilih === "semua" || m.kategori === kategoriTerpilih;
      return matchSearch && matchKategori;
    });
  }, [searchTerm, kategoriTerpilih, dataMateri]);

  // 4. Logic Pagination
  const totalPages = Math.ceil(materiDifilter.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = materiDifilter.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <div className="p-20 text-center text-gray-500 font-medium">Menghubungkan ke database...</div>;

  return (
    <div className="p-8 max-w-10xl mx-auto">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Materi Pembelajaran</h1>
          <p className="text-gray-500 mt-1">Menampilkan <span className="text-blue-600 font-bold">{materiDifilter.length}</span> materi terbaik.</p>
        </div>

        <Link 
          href="https://www.youtube.com/@mukhtarmuslim9461" 
          target="_blank"
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-md flex items-center gap-2 group"
        >
          <span className="group-hover:scale-110 transition-transform">▶</span> Subscribe YouTube
        </Link>
      </header>

      {/* FILTER, SEARCH, & LIMIT SECTION */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <input 
            type="text"
            placeholder="Cari judul materi..."
            className="w-full pl-12 pr-4 py-3.5 border rounded-2xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        </div>

        {/* Dropdown Kategori (SEKARANG DINAMIS) */}
        <div className="md:col-span-3">
          <select 
            className="w-full p-3.5 border rounded-2xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
            value={kategoriTerpilih}
            onChange={(e) => {
              setKategoriTerpilih(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="semua">📂 Semua Kategori</option>
            {daftarKategoriDinamis.map((kat) => (
              <option key={kat} value={kat}>
                📍 {kat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Limit Control */}
        <div className="md:col-span-3">
          <select 
            className="w-full p-3.5 border rounded-2xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-600 cursor-pointer appearance-none"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); 
            }}
          >
            <option value={5}>Tampilkan: 5</option>
            <option value={10}>Tampilkan: 10</option>
            <option value={20}>Tampilkan: 20</option>
            <option value={50}>Tampilkan: 50</option>
          </select>
        </div>
      </div>

      {/* GRID MATERI */}
      {currentItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((materi) => (
            <div key={materi.id} className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-video bg-black relative overflow-hidden">
                <iframe 
                    className="w-full h-full border-0" 
                    src={materi.urlYoutube} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                        {materi.kategori}
                    </span>
                    <span className="text-[10px] text-gray-300 font-mono">#{materi.id}</span>
                </div>
                <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {materi.judul}
                </h3>
                <p className="text-sm text-gray-500 mt-3 line-clamp-2 italic">
                    {materi.deskripsi || "Tidak ada deskripsi materi."}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <span className="text-6xl mb-4 block">🔍</span>
          <h2 className="text-xl font-bold text-gray-800">Materi tidak ditemukan</h2>
          <p className="text-gray-400 mt-1">Coba cari dengan kata kunci lain atau ganti kategori.</p>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-16 flex flex-wrap justify-center items-center gap-3">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-6 py-3 border rounded-2xl disabled:opacity-20 bg-white hover:bg-blue-50 text-gray-700 font-bold transition-all shadow-sm"
          >
            ← Prev
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-2xl border font-bold transition-all shadow-sm ${
                  currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600 scale-110" : "bg-white text-gray-600 hover:border-blue-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-6 py-3 border rounded-2xl disabled:opacity-20 bg-white hover:bg-blue-50 text-gray-700 font-bold transition-all shadow-sm"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}