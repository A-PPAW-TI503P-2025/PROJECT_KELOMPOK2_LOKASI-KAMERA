import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Fungsi untuk mengecek menu aktif biar warnanya beda
  const isActive = (path) => {
    return location.pathname === path 
      ? "bg-pink-50 text-pink-600 font-bold border-r-4 border-pink-500" 
      : "text-gray-500 hover:bg-pink-50 hover:text-pink-500";
  };

  return (
    // SIDEBAR CONTAINER
    <aside className="w-64 h-screen bg-white fixed left-0 top-0 shadow-xl z-50 flex flex-col justify-between">
      
      {/* BAGIAN ATAS: LOGO & MENU */}
      <div>
        {/* Logo Brand */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-pink-300 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            P
          </div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
            Perpus<span className="text-pink-500">Umy</span>
          </h1>
        </div>

        {/* Menu Navigasi */}
        <nav className="mt-4 px-4 space-y-2">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
          
          <Link to="/member/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive('/member/dashboard')}`}>
            {/* Ikon Dashboard SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Daftar Buku
          </Link>

          <Link to="/member/kembali" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive('/member/kembali')}`}>
            {/* Ikon Buku SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Peminjaman Saya
          </Link>
        </nav>
      </div>

      {/* BAGIAN BAWAH: LOGOUT */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all duration-300 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout Akun</span>
        </button>
      </div>
    </aside>
  );
};

export default Navbar;