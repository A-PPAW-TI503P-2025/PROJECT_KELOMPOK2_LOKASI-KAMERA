import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Fungsi untuk mengecek menu aktif
  const isActive = (path) => {
    return location.pathname === path 
      ? "bg-blue-600/10 text-blue-500" 
      : "text-gray-400 hover:bg-[#252538] hover:text-white";
  };

  return (
    // SIDEBAR CONTAINER (Fixed di kiri)
    <aside className="w-64 h-screen bg-[#1C1C2E] fixed left-0 top-0 border-r border-gray-800 flex flex-col justify-between py-6 px-4 z-50">
      
      {/* BAGIAN ATAS */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">
            A
          </div>
          <span className="text-xl font-bold tracking-wide text-white">
            Admin<span className="text-blue-500">Panel</span>
          </span>
        </div>

        {/* Menu Navigasi */}
        <nav className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold px-2">Main Menu</p>
          
          {/* Menu 1: Dashboard */}
          <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/dashboard')}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </Link>

          {/* Menu 2: Kelola Buku */}
          <Link to="/admin/kelola-buku" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/kelola-buku')}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Kelola Buku
          </Link>

          {/* Menu 3: Laporan */}
          <Link to="/admin/laporan" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/laporan')}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Laporan & Validasi
          </Link>
        </nav>
      </div>

      {/* BAGIAN BAWAH: LOGOUT */}
      <div>
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-[#252538] rounded-xl transition-all group"
        >
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>

    </aside>
  );
};

export default Navbar;