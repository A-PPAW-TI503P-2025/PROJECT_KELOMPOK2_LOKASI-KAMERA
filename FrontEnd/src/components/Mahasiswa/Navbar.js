import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Perpustakaan Mahasiswa</h1>
        <div className="space-x-4">
          <Link to="/member/dashboard" className="hover:text-blue-200">Daftar Buku</Link>
          <Link to="/member/kembali" className="hover:text-blue-200">Peminjaman Saya</Link>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;