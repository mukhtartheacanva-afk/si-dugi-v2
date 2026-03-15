export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Tombol menu buat mobile nanti kalau mau dikembangkan */}
        <span className="text-gray-400 md:hidden">☰</span>
        <h2 className="font-semibold text-gray-700">Dashboard Utama</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-500">Selamat datang,</p>
          <p className="text-sm font-bold text-gray-700">Admin Surabaya</p>
        </div>
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
          A
        </div>
      </div>
    </header>
  );
}