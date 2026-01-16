import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const Register = () => {
  // --- LOGIKA (TETAP SAMA) ---
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateInput = (name, value) => {
    let errors = { ...validationErrors };
    if (name === "nama") {
      if (value.length < 5) errors.nama = "Nama minimal 5 karakter";
      else delete errors.nama;
    }
    if (name === "nim") {
      if (!value) delete errors.nim;
      else {
        if (!/^\d+$/.test(value)) errors.nim = "NIM harus berupa angka";
        else if (value.length !== 11) errors.nim = "NIM harus tepat 11 digit";
        else delete errors.nim;
      }
    }
    if (name === "email") {
      if (!value.endsWith("@mail.umy.ac.id")) errors.email = "Wajib gunakan email kampus (@mail.umy.ac.id)";
      else delete errors.email;
    }
    setValidationErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateInput(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(validationErrors).length > 0) {
      setError("Mohon perbaiki data yang merah.");
      return;
    }
    try {
      await api.post("/auth/register", formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal daftar.");
    }
  };

  const isButtonDisabled = Object.keys(validationErrors).length > 0 || !formData.email || !formData.password || !formData.nama;

  return (
    // 1. BACKGROUND LEBIH PINK (Pink-200 ke Pink-100)
    <div className="font-sans min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-100 to-white relative overflow-hidden py-10">
      
      {/* 2. BOLA DEKORASI (Warna Lebih Tebal biar Kelihatan) */}
      <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      {/* 3. KARTU KACA (Lebih Bening) */}
      <div className="relative w-full max-w-lg p-8 m-4 
                      bg-white/30                 /* Putih Transparan 30% (Bening) */
                      backdrop-blur-xl            /* Efek Blur Kuat */
                      border border-white/60      /* Border Putih */
                      rounded-[40px]              
                      shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 tracking-wide drop-shadow-sm">
            Join Us! <span className="text-pink-500">🌸</span>
          </h2>
          <p className="text-gray-600 mt-2 text-sm font-medium">
            Gabung komunitas perpustakaan UMY ✨
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100/80 border border-red-200 text-red-600 rounded-2xl text-center text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama */}
          <div className="group">
            <label className="block mb-1 text-sm font-bold text-gray-600 ml-3">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              placeholder="Min. 5 Huruf"
              className={`w-full px-6 py-3 bg-white/50 border rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white/80 transition-all duration-300 shadow-sm
                ${validationErrors.nama ? "border-red-300 ring-red-200" : "border-white/50 focus:ring-pink-300"}`}
              onChange={handleChange}
            />
            {validationErrors.nama && <p className="text-xs text-red-500 mt-1 ml-4 font-bold">{validationErrors.nama}</p>}
          </div>

          {/* Input NIM */}
          <div className="group">
            <label className="block mb-1 text-sm font-bold text-gray-600 ml-3">NIM <span className="text-gray-400 font-normal text-xs">(Opsional)</span></label>
            <input
              type="text"
              name="nim"
              placeholder="11 Digit Angka"
              className={`w-full px-6 py-3 bg-white/50 border rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white/80 transition-all duration-300 shadow-sm
                ${validationErrors.nim ? "border-red-300 ring-red-200" : "border-white/50 focus:ring-pink-300"}`}
              onChange={handleChange}
            />
            {validationErrors.nim && <p className="text-xs text-red-500 mt-1 ml-4 font-bold">{validationErrors.nim}</p>}
          </div>

          {/* Input Email */}
          <div className="group">
            <label className="block mb-1 text-sm font-bold text-gray-600 ml-3">Email Kampus</label>
            <input
              type="email"
              name="email"
              placeholder="nama@mail.umy.ac.id"
              className={`w-full px-6 py-3 bg-white/50 border rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white/80 transition-all duration-300 shadow-sm
                ${validationErrors.email ? "border-red-300 ring-red-200" : "border-white/50 focus:ring-pink-300"}`}
              onChange={handleChange}
              required
            />
            {validationErrors.email && <p className="text-xs text-red-500 mt-1 ml-4 font-bold">{validationErrors.email}</p>}
          </div>

          {/* Input Password */}
          <div className="group">
            <label className="block mb-1 text-sm font-bold text-gray-600 ml-3">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Buat password aman..."
              className="w-full px-6 py-3 bg-white/50 border border-white/50 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white/80 transition-all duration-300 shadow-sm"
              onChange={handleChange}
              required
            />
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full py-4 mt-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300
              ${isButtonDisabled 
                ? "bg-gray-300/50 text-gray-500 cursor-not-allowed shadow-none" 
                : "bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-pink-400/40 hover:shadow-pink-400/60 hover:scale-[1.02]"}`}
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm font-medium">
          Sudah punya akun?{" "}
          <Link to="/" className="font-bold text-pink-500 hover:text-pink-700 underline decoration-2 underline-offset-4 transition-colors">
            Login disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;