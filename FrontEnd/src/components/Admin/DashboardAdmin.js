import React, { useState, useEffect } from "react";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeLoans: 0,
    totalHistory: 0,
    recentTransactions: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksRes = await api.get("/books");
        const transRes = await api.get("/transaction/history");
        
        // Urutkan transaksi dari yang terbaru
        const sortedTrans = transRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setStats({
          totalBooks: booksRes.data.length,
          activeLoans: transRes.data.filter(t => t.status === 'dipinjam').length,
          totalHistory: transRes.data.length,
          recentTransactions: sortedTrans.slice(0, 4) // Ambil 4 transaksi terakhir
        });
      } catch (err) {
        console.error("Gagal ambil data dashboard", err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#0d0e12] text-white font-sans overflow-hidden">
      
      {/* 1. SIDEBAR KIRI (Dark Grey) */}
      <aside className="w-64 bg-[#1C1C2E] flex flex-col justify-between py-6 px-4 border-r border-gray-800">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">A</div>
            <span className="text-xl font-bold tracking-wide">Admin<span className="text-blue-500">Panel</span></span>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Main Menu</p>
            
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Dashboard
            </Link>

            <Link to="/admin/kelola-buku" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#252538] hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              Kelola Buku
            </Link>

            <Link to="/admin/laporan" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#252538] hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              Laporan & Validasi
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </aside>

      {/* 2. KONTEN UTAMA */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <svg className="w-5 h-5 absolute left-3 top-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search data..." className="w-full bg-[#1C1C2E] text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" />
            </div>
            <div>
               <p className="text-sm font-bold">Administrator</p>
               <p className="text-xs text-gray-400">Super User</p>
            </div>
          </div>
        </div>

        {/* GRID LAYOUT UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI (2/3 Lebar) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Banner Biru (Mirip Referensi Image) */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 relative overflow-hidden shadow-lg shadow-blue-900/20">
               <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2">Halo, Administrator! 👋</h2>
                  <p className="text-blue-100 mb-6 max-w-md">
                     Anda memiliki <span className="font-bold text-white bg-white/20 px-2 rounded">{stats.activeLoans} peminjaman aktif</span> yang perlu dipantau hari ini.
                  </p>
                  <Link to="/admin/laporan" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition">
                     Cek Laporan
                  </Link>
               </div>
               {/* Dekorasi 3D Abstract */}
               <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20">
                  <img src="https://cdn-icons-png.flaticon.com/512/2881/2881031.png" className="w-full h-full object-contain transform translate-x-10 translate-y-10" alt="3d" />
               </div>
            </div>

            {/* Statistik "The Best Lessons" style (Mockup Bar Chart) */}
            <div className="bg-[#1C1C2E] p-6 rounded-3xl border border-gray-800">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Statistik Perpustakaan</h3>
                  <div className="flex gap-2">
                     <span className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-300">Bulanan</span>
                  </div>
               </div>
               
               {/* Visual Bar Chart Menggunakan CSS Tailwind */}
               <div className="flex justify-between items-end h-40 gap-4">
                  {/* Bar 1 */}
                  <div className="flex flex-col items-center gap-2 w-full">
                     <div className="w-full bg-blue-500/20 h-full rounded-t-lg relative group">
                        <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-400" style={{height: '40%'}}></div>
                     </div>
                     <span className="text-xs text-gray-500">Buku</span>
                  </div>
                  {/* Bar 2 */}
                  <div className="flex flex-col items-center gap-2 w-full">
                     <div className="w-full bg-indigo-500/20 h-full rounded-t-lg relative group">
                        <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-400" style={{height: `${Math.min(stats.activeLoans * 10, 100)}%`}}></div>
                     </div>
                     <span className="text-xs text-gray-500">Pinjam</span>
                  </div>
                   {/* Bar 3 */}
                   <div className="flex flex-col items-center gap-2 w-full">
                     <div className="w-full bg-purple-500/20 h-full rounded-t-lg relative group">
                        <div className="absolute bottom-0 w-full bg-purple-500 rounded-t-lg transition-all duration-500 group-hover:bg-purple-400" style={{height: '80%'}}></div>
                     </div>
                     <span className="text-xs text-gray-500">Kembali</span>
                  </div>
                   {/* Bar 4 */}
                   <div className="flex flex-col items-center gap-2 w-full">
                     <div className="w-full bg-pink-500/20 h-full rounded-t-lg relative group">
                        <div className="absolute bottom-0 w-full bg-pink-500 rounded-t-lg transition-all duration-500 group-hover:bg-pink-400" style={{height: '60%'}}></div>
                     </div>
                     <span className="text-xs text-gray-500">User</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-[#13131F] p-4 rounded-xl flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-lg">📚</div>
                     <div>
                        <p className="text-xs text-gray-400">Total Buku</p>
                        <p className="text-xl font-bold">{stats.totalBooks}</p>
                     </div>
                  </div>
                  <div className="bg-[#13131F] p-4 rounded-xl flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center font-bold text-lg">✅</div>
                     <div>
                        <p className="text-xs text-gray-400">Total Transaksi</p>
                        <p className="text-xl font-bold">{stats.totalHistory}</p>
                     </div>
                  </div>
               </div>

            </div>
          </div>

          {/* KOLOM KANAN (1/3 Lebar - Calendar Style) */}
          <div className="space-y-8">
            
            {/* Kartu Status Ringkas */}
            <div className="bg-[#1C1C2E] p-6 rounded-3xl border border-gray-800">
               <h3 className="text-lg font-bold mb-4">Status Peminjaman</h3>
               <div className="flex items-center justify-between py-4 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <span className="text-gray-300">Aktif Dipinjam</span>
                  </div>
                  <span className="font-bold text-xl">{stats.activeLoans}</span>
               </div>
               <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                     <span className="text-gray-300">Tersedia</span>
                  </div>
                  <span className="font-bold text-xl">{stats.totalBooks - stats.activeLoans}</span>
               </div>
            </div>

            {/* Transaksi Terbaru (Pengganti Calendar) */}
            <div className="bg-[#1C1C2E] p-6 rounded-3xl border border-gray-800 h-full">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Transaksi Terbaru</h3>
                  <Link to="/admin/laporan" className="text-xs text-blue-500 hover:text-blue-400">See all</Link>
               </div>

               <div className="space-y-4">
                  {stats.recentTransactions.length === 0 ? (
                     <p className="text-gray-500 text-sm text-center">Belum ada aktivitas.</p>
                  ) : (
                     stats.recentTransactions.map((item, idx) => (
                        <div key={idx} className="bg-[#13131F] p-4 rounded-2xl flex items-center gap-4 hover:bg-[#252538] transition cursor-pointer">
                           {/* Icon Status */}
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.status === 'dipinjam' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                              {item.status === 'dipinjam' ? '⏳' : '↩️'}
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm truncate text-white">{item.Book?.title || "Judul Buku"}</h4>
                              <p className="text-xs text-gray-500 truncate">{new Date(item.createdAt).toLocaleDateString()}</p>
                           </div>
                           <span className={`text-xs font-bold px-2 py-1 rounded ${item.status === 'dipinjam' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                              {item.status}
                           </span>
                        </div>
                     ))
                  )}
               </div>

               <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-sm font-bold text-gray-400 mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                     <Link to="/admin/kelola-buku" className="bg-blue-600 hover:bg-blue-500 text-white text-center py-3 rounded-xl text-sm font-bold transition">
                        + Add Book
                     </Link>
                     <Link to="/admin/laporan" className="bg-[#252538] hover:bg-[#30304b] text-white text-center py-3 rounded-xl text-sm font-bold transition">
                        Validate
                     </Link>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;