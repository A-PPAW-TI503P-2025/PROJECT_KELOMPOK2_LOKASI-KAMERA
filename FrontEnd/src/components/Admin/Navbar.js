import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Perpustakaan</h1>
        <div className="space-x-4">
          <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/admin/kelola-buku" className="hover:text-gray-300">Kelola Buku</Link>
          <Link to="/admin/laporan" className="hover:text-gray-300">Laporan & Validasi</Link>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;