import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth Components
import Login from "./components/Login";
import Register from "./components/Register";

// Admin Components
import DashboardAdmin from "./components/Admin/DashboardAdmin";
import KelolaBuku from "./components/Admin/KelolaBuku";
import Laporan from "./components/Admin/Laporan";

// Member Components (Folder 'Mahasiswa')
import LihatDaftarBuku from "./components/Mahasiswa/LihatDaftarBuku";
import PinjamBuku from "./components/Mahasiswa/PinjamBuku";
import KembalikanBuku from "./components/Mahasiswa/KembalikanBuku";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Route Admin */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/kelola-buku" element={<KelolaBuku />} />
        <Route path="/admin/laporan" element={<Laporan />} />

        {/* Route Member (Mahasiswa) */}
        <Route path="/member/dashboard" element={<LihatDaftarBuku />} />
        <Route path="/member/pinjam" element={<PinjamBuku />} />
        <Route path="/member/kembali" element={<KembalikanBuku />} />
      </Routes>
    </Router>
  );
}

export default App;