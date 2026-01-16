import React, { useState, useEffect } from "react";
import api from "../../api";
import Navbar from "./Navbar";

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeLoans: 0,
    totalHistory: 0,
    recentTransactions: []
  });
  
  // 1. DEFAULT USER (Kalau belum login, namanya "Admin")
  const [user, setUser] = useState({ nama: "Admin", role: "admin" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 2. AMBIL DATA USER DARI LOCALSTORAGE
    // Logika ini sama persis dengan yang ada di Member/Mahasiswa
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Gagal membaca data user", error);
      }
    }

    const fetchData = async () => {
      try {
        const booksRes = await api.get("/books");
        const transRes = await api.get("/transaction/history");
        
        // Sorting data transaksi terbaru
        const sortedTrans = transRes.data; 

        setStats({
          totalBooks: booksRes.data.length,
          activeLoans: transRes.data.filter(t => t.status === 'dipinjam').length,
          totalHistory: transRes.data.length,
          recentTransactions: sortedTrans.slice(0, 4) 
        });
      } catch (err) {
        console.error("Gagal ambil data dashboard", err);
      }
    };
    fetchData();
  }, []);

  // Filter Search Logic
  const filteredTransactions = stats.recentTransactions.filter((item) => {
      if (!searchTerm) return true;
      const title = item.judul_buku || item.title || "";
      return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-[#FDF4FF] font-sans">
      <Navbar />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-96">
             <input 
                type="text" 
                placeholder="Cari aktivitas buku..." 
                className="w-full bg-white text-gray-600 pl-6 pr-4 py-3 rounded-full border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-200 shadow-sm placeholder-pink-300" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-pink-50 shadow-sm">
             <div className="w-10 h-10 rounded-full bg-pink-100 p-1">
                {/* AVATAR DINAMIS: Sesuai Inisial Nama */}
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.nama}&background=random&color=fff`} 
                  alt="Admin" 
                  className="rounded-full" 
                />
             </div>
             <div className="hidden md:block">
                {/* NAMA ADMIN (Pojok Kanan Atas) */}
                <p className="text-sm font-bold text-gray-700">{user.nama}</p>
                <p className="text-xs text-pink-400">Super User</p>
             </div>
          </div>
        </div>

        {/* Banner Pink */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           <div className="lg:col-span-2 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-[35px] p-8 relative overflow-hidden shadow-xl shadow-pink-200 text-white">
              <div className="relative z-10">
                 {/* SAPAAN DINAMIS (Halo, [Nama User]!) */}
                 {/* Kalau kode ini benar terpasang, tulisan "Admin Cantik" PASTI HILANG */}
                 <h2 className="text-3xl font-bold mb-2">Halo, {user.nama}! 👋</h2>
                 
                 <p className="text-pink-50 mb-6 max-w-md">Ada <span className="font-bold bg-white/20 px-2 rounded">{stats.activeLoans} peminjaman aktif</span> yang perlu kamu cek hari ini. Semangat!</p>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl opacity-40 transform translate-x-10 translate-y-10"></div>
           </div>

           {/* Quick Stats (Bagian Kanan) */}
           <div className="space-y-4">
              <div className="bg-white p-5 rounded-[25px] shadow-sm border border-pink-50 flex items-center justify-between">
                 <div>
                    <p className="text-gray-400 text-xs font-bold uppercase">Total Buku</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalBooks}</p>
                 </div>
                 <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center text-xl">📚</div>
              </div>
              <div className="bg-white p-5 rounded-[25px] shadow-sm border border-pink-50 flex items-center justify-between">
                 <div>
                    <p className="text-gray-400 text-xs font-bold uppercase">Total Transaksi</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalHistory}</p>
                 </div>
                 <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center text-xl">✅</div>
              </div>
           </div>
        </div>

        {/* Transaksi Terbaru */}
        <div className="bg-white p-8 rounded-[30px] border border-pink-50 shadow-sm">
           <h3 className="text-lg font-bold text-gray-800 mb-6">Aktivitas Terbaru</h3>
           <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                 <p className="text-center text-gray-400 py-4">
                    {searchTerm ? "Buku tidak ditemukan." : "Belum ada aktivitas."}
                 </p>
              ) : (
                 filteredTransactions.map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-pink-50/30 rounded-2xl hover:bg-pink-50 transition border border-transparent hover:border-pink-100">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.status === 'dipinjam' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                          {item.status === 'dipinjam' ? '⏳' : '↩️'}
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-800 text-sm">
                             {item.judul_buku || item.title || "Judul Tidak Ditemukan"}
                          </h4>
                          <p className="text-xs text-gray-400">{new Date(item.createdAt || item.borrow_date).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${item.status === 'dipinjam' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                       {item.status}
                    </span>
                 </div>
              )))}
           </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardAdmin;