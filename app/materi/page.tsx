"use client";

import { useState, useMemo, useEffect } from "react"; 
import Link from "next/link";

export default function MateriPage() {
  const [dataMateri, setDataMateri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriTerpilih, setKategoriTerpilih] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const daftarKategori = [
    { id: "semua", nama: "Semua Materi" },
    { id: "frontend", nama: "Frontend Dev" },
    { id: "backend", nama: "Backend Integration" },
    { id: "database", nama: "Database Prisma" },
  ];

  // 2. Logic Filtering (DITAMBAHKAN dataMateri di dependency)
  const materiDifilter = useMemo(() => {
    return dataMateri.filter((m) => {
      const matchSearch = m.judul.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKategori = kategoriTerpilih === "semua" || m.kategori === kategoriTerpilih;
      return matchSearch && matchKategori;
    });
  }, [searchTerm, kategoriTerpilih, dataMateri]); // <--- Penting!

  // 3. Logic Pagination
  const totalPages = Math.ceil(materiDifilter.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = materiDifilter.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <div className="p-8 text-center text-gray-500">Menghubungkan ke database...</div>;

  return (
    <div className="p-8">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Materi Pembelajaran</h1>
          <p className="text-gray-500">Total: {materiDifilter.length} materi ditemukan.</p>
        </div>

        <Link 
          href="https://www.youtube.com/@mukhtarmuslim9461" 
          target="_blank"
          className="bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg flex items-center gap-2"
        >
          ▶ Subscribe YouTube
        </Link>
      </header>

      {/* FILTER, SEARCH, & LIMIT SECTION */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
          <input 
            type="text"
            placeholder="Cari judul materi..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="md:col-span-3">
          <select 
            className="w-full p-3 border rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={kategoriTerpilih}
            onChange={(e) => {
              setKategoriTerpilih(e.target.value);
              setCurrentPage(1);
            }}
          >
            {daftarKategori.map(kat => (
              <option key={kat.id} value={kat.id}>{kat.nama}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select 
            className="w-full p-3 border rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium text-blue-600"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); 
            }}
          >
            <option value={5}>Tampilkan: 5</option>
            <option value={10}>Tampilkan: 10</option>
            <option value={50}>Tampilkan: 50</option>
            <option value={100}>Tampilkan: 100</option>
          </select>
        </div>
      </div>

      {/* GRID MATERI */}
      {currentItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((materi) => (
            <div key={materi.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition">
              <div className="aspect-video bg-black">
                {/* DISESUAIKAN: materi.urlYoutube sesuai nama kolom di Prisma */}
                <iframe className="w-full h-full" src={materi.urlYoutube} allowFullScreen></iframe>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">
                        {materi.kategori}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">ID: {materi.id}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800">{materi.judul}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{materi.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-500">Materi tidak ditemukan 😅</p>
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-wrap justify-center items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-30 bg-white hover:bg-gray-50 transition"
          >
            Prev
          </button>
          
          <div className="flex gap-1 overflow-x-auto p-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`min-w-10 h-10 rounded-lg border transition ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-30 bg-white hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}