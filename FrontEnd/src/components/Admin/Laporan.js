import React, { useState, useEffect } from "react";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";

const Laporan = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/transaction/history");
        // Urutkan dari yang terbaru
        const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTransactions(sortedData);
      } catch (err) {
        console.error(err);
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
      
      {/* 1. SIDEBAR KIRI (Dark Grey - Konsisten) */}
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
            
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#252538] hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Dashboard
            </Link>

            <Link to="/admin/kelola-buku" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#252538] hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              Kelola Buku
            </Link>

            {/* Menu Aktif: Laporan */}
            <Link to="/admin/laporan" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-xl transition-all">
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
            <input type="text" placeholder="Search report..." className="w-full bg-[#1C1C2E] text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500" />
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

        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
          Validasi Peminjaman <span className="text-blue-500">📝</span>
        </h2>

        {/* --- TABEL LAPORAN (Dark Theme) --- */}
        <div className="bg-[#1C1C2E] rounded-3xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
             <h3 className="font-bold text-white">Data Transaksi Masuk</h3>
             <span className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-300">Total: {transactions.length}</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#13131F] text-gray-400">
                <tr>
                  <th className="p-5 text-xs uppercase font-bold tracking-wider">Peminjam</th>
                  <th className="p-5 text-xs uppercase font-bold tracking-wider">Buku Info</th>
                  <th className="p-5 text-xs uppercase font-bold tracking-wider text-center">Status</th>
                  <th className="p-5 text-xs uppercase font-bold tracking-wider text-center">Bukti</th>
                  <th className="p-5 text-xs uppercase font-bold tracking-wider text-center">Lokasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#252538] transition-colors group">
                    
                    {/* Kolom Peminjam */}
                    <td className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                                {t.peminjam ? t.peminjam.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm">{t.peminjam}</p>
                                <p className="text-xs text-gray-500">ID: {t.userId}</p>
                            </div>
                        </div>
                    </td>

                    {/* Kolom Buku */}
                    <td className="p-5">
                        <p className="font-bold text-white text-sm">{t.judul_buku || t.Book?.title}</p>
                        <p className="text-xs text-gray-500">{new Date(t.borrow_date || t.createdAt).toLocaleDateString()}</p>
                    </td>

                    {/* Kolom Status */}
                    <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                          t.status === 'dipinjam' 
                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
                            : 'bg-green-500/10 text-green-500 border-green-500/20'
                        }`}>
                            {t.status}
                        </span>
                    </td>

                    {/* Kolom Bukti Foto */}
                    <td className="p-5 text-center">
                        {t.borrow_proof ? (
                            <a 
                              href={`http://localhost:3000/${t.borrow_proof.replace(/\\/g, "/")}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-xs font-bold underline flex items-center justify-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Lihat Foto
                            </a>
                        ) : (
                            <span className="text-gray-600 text-xs italic">Tanpa Bukti</span>
                        )}
                    </td>

                    {/* Kolom Cek Lokasi */}
                    <td className="p-5 text-center">
                        {t.lat && t.long ? (
                            <a 
                              href={`https://www.google.com/maps?q=${t.lat},${t.long}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 bg-gray-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                                📍 Cek Map
                            </a>
                        ) : (
                            <span className="text-gray-600 text-xs">-</span>
                        )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {transactions.length === 0 && (
            <div className="p-10 text-center text-gray-500">
                Belum ada data transaksi.
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Laporan;