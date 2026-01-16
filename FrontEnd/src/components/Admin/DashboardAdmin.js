import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import api from "../../api";
import { Link } from "react-router-dom";

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeLoans: 0,
    totalHistory: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ambil Data Buku
        const booksRes = await api.get("/books");
        
        // 2. Ambil Data Transaksi
        const transRes = await api.get("/transaction/history");
        
        // Hitung Statistik
        const totalBooks = booksRes.data.length;
        const activeLoans = transRes.data.filter(t => t.status === 'dipinjam').length;
        const totalHistory = transRes.data.length;

        setStats({ totalBooks, activeLoans, totalHistory });
      } catch (err) {
        console.error("Gagal ambil data dashboard", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 mb-8">Pantau aktivitas perpustakaan secara real-time.</p>

        {/* --- GRID STATISTIK --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Kartu 1: Total Buku */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm uppercase font-bold">Total Koleksi Buku</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{stats.totalBooks}</p>
            <Link to="/admin/kelola-buku" className="text-blue-500 text-sm mt-4 inline-block hover:underline">
              Kelola Buku &rarr;
            </Link>
          </div>

          {/* Kartu 2: Sedang Dipinjam */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm uppercase font-bold">Sedang Dipinjam</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{stats.activeLoans}</p>
            <Link to="/admin/laporan" className="text-yellow-600 text-sm mt-4 inline-block hover:underline">
              Lihat Laporan &rarr;
            </Link>
          </div>

          {/* Kartu 3: Total Riwayat */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm uppercase font-bold">Total Riwayat Transaksi</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{stats.totalHistory}</p>
            <p className="text-gray-400 text-xs mt-4">Akumulasi peminjaman & pengembalian</p>
          </div>

        </div>

        {/* --- AKSES CEPAT --- */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Akses Cepat</h2>
            <div className="flex gap-4">
                <Link to="/admin/kelola-buku" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    + Tambah Buku Baru
                </Link>
                <Link to="/admin/laporan" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                    Cek Validasi Peminjaman
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;