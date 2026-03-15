export default function StatCard({ judul, jumlah, warna }: any) {
  return (
    <div className={`p-6 rounded-2xl shadow-sm border border-gray-100 ${warna} transition-transform hover:scale-105`}>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{judul}</h3>
      <div className="flex items-end justify-between mt-4">
        <p className="text-4xl font-bold text-gray-800">{jumlah}</p>
        <span className="text-xs bg-white/50 px-2 py-1 rounded-full text-gray-600">Bulan ini</span>
      </div>
    </div>
  );
}