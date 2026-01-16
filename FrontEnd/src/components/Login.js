import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      localStorage.setItem("nama", user.nama);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/member/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Email atau Password salah, Bestie! 😢");
    }
  };

  return (
    // 1. CONTAINER UTAMA (Background Gradasi Soft Pink)
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-50 relative overflow-hidden">
      
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>

      <div className="relative w-full max-w-md p-8 m-4 
                      bg-white/30                 /* Warna Putih Transparan */
                      backdrop-blur-xl            /* Efek Blur (Kaca Buram) */
                      border border-white/60      /* Garis Tepi Kaca */
                      rounded-[40px]              /* Sudut Bulat */
                      shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 tracking-wide drop-shadow-sm">
            Welcome!!! <span className="text-pink-500">🌸</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Login dulu biar makin produktif ✨</p>
        </div>

        {/* Alert Error */}
        {error && (
          <div className="mb-6 p-3 bg-red-100/50 border border-red-200/50 text-red-600 rounded-2xl text-center text-sm font-bold backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Input Email */}
          <div className="group">
            <label className="block mb-2 text-sm font-semibold text-gray-600 ml-3">Email</label>
            <input
              type="email"
              placeholder="nama@mail.umy.ac.id"
              // Input juga semi-transparan (Glass effect inside glass)
              className="w-full px-6 py-3 bg-white/50 border border-white/60 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white/80 transition-all duration-300 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Input Password */}
          <div className="group">
            <label className="block mb-2 text-sm font-semibold text-gray-600 ml-3">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-6 py-3 bg-white/50 border border-white/60 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white/80 transition-all duration-300 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Tombol Login (Gradasi Pink Cantik) */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-pink-400/50 hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            Masuk Sekarang
          </button>
        </form>

        {/* Link Daftar */}
        <p className="mt-8 text-center text-gray-600 text-sm">
          Belum punya akun?{" "}
          <Link to="/register" className="font-bold text-pink-500 hover:text-pink-700 underline decoration-2 underline-offset-4 transition-colors">
            Daftar disini
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;