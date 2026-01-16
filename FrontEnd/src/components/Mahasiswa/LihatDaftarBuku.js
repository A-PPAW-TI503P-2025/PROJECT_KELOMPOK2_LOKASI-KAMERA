import React, { useState, useEffect } from "react";
import api from "../../api";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const LihatDaftarBuku = () => {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState({ nama: "Mahasiswa" });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchBooks = async () => {
      try {
        const res = await api.get("/books");
        setBooks(res.data);
      } catch (err) {
        console.error("Gagal ambil buku", err);
      }
    };
    fetchBooks();
  }, []);

  const handlePinjamClick = (book) => {
    if (book.stock <= 0) {
      alert("Stok buku habis!");
      return;
    }
    navigate("/member/pinjam", { state: { book } });
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDF4FF] font-sans flex"> 
      {/* Background Pink/Ungu Sangat Muda (#FDF4FF) biar soft banget */}
      
      {/* 1. SIDEBAR */}
      <Navbar />

      {/* 2. KONTEN UTAMA */}
      <main className="flex-1 ml-64 p-8">
        
        {/* --- HEADER ATAS --- */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              type="text" 
              placeholder="Cari buku favoritmu..." 
              className="w-full py-3 pl-10 pr-4 bg-white border border-purple-100 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm placeholder-purple-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-purple-100">
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-700">{user.nama}</p>
                <p className="text-xs text-purple-500">Mahasiswa Aktif</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold border-2 border-white shadow-md">
                {user.nama.charAt(0)}
             </div>
          </div>
        </div>

        {/* --- HERO BANNER (GRADASI BARU: UNGU - PINK - PEACH) --- */}
        {/* Ini kuncinya: from-violet-400 via-fuchsia-300 to-rose-300 */}
        <div className="relative w-full bg-gradient-to-r from-violet-400 via-pink-400 to-rose-300 rounded-[35px] p-10 mb-10 text-white shadow-xl shadow-pink-200/50 overflow-hidden">
          
          {/* Dekorasi Blur Biar Makin Soft (Mesh Gradient Effect) */}
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-blue-300 mix-blend-overlay filter blur-3xl opacity-30 rounded-full"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-80 h-80 bg-yellow-200 mix-blend-overlay filter blur-3xl opacity-40 rounded-full"></div>
          
          <div className="relative z-10 flex justify-between items-center">
             <div className="max-w-lg">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold tracking-wider mb-3 inline-block border border-white/30">
                   ✨ NEW COLLECTION
                </span>
                <h2 className="text-4xl font-bold mb-3 tracking-tight">Halo, {user.nama}!</h2>
                <p className="text-white/90 mb-8 text-lg font-medium leading-relaxed">
                  Temukan buku impianmu & jelajahi dunia baru hari ini. 
                  Semuanya ada di genggamanmu!
                </p>
             </div>
             
             {/* Gambar Kartun 3D */}
             <img 
               src="https://cdn-icons-png.flaticon.com/512/3330/3330314.png" 
               alt="Books 3D" 
               className="w-56 h-56 object-contain hidden md:block drop-shadow-2xl hover:rotate-3 transition-transform duration-500"
             />
          </div>
        </div>

        {/* --- GRID JUDUL BUKU --- */}
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
             📚 Koleksi Populer
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white p-4 rounded-[25px] shadow-sm border border-purple-50 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
              
              {/* Cover Buku */}
              <div className="h-52 w-full bg-gray-50 rounded-2xl mb-4 overflow-hidden relative">
                 <img 
                    src={book.cover_image || "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg"} 
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                 />
                 <div className="absolute top-3 right-3">
                    {book.stock > 0 ? (
                      <span className="bg-white/90 backdrop-blur-sm text-green-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {book.stock} Available
                      </span>
                    ) : (
                      <span className="bg-white/90 backdrop-blur-sm text-red-500 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Out of Stock
                      </span>
                    )}
                 </div>
              </div>

              {/* Info Buku */}
              <div className="flex-1 flex flex-col px-1">
                <h4 className="font-bold text-gray-800 text-lg mb-1 leading-tight line-clamp-1" title={book.title}>{book.title}</h4>
                <p className="text-sm text-gray-400 mb-4">{book.author}</p>
                
                <div className="mt-auto">
                  <button
                    onClick={() => handlePinjamClick(book)}
                    disabled={book.stock <= 0}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2
                      ${book.stock > 0 
                        ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-purple-300 hover:scale-[1.02]' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                  >
                    {book.stock > 0 ? "Pinjam Buku" : "Stok Habis"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default LihatDaftarBuku;