import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const Register = () => {
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

    // 1. Validasi Nama
    if (name === "nama") {
      if (value.length < 5) {
        errors.nama = "Nama minimal 5 karakter";
      } else {
        delete errors.nama;
      }
    }

    // 2. Validasi NIM (Hanya jika diisi)
    if (name === "nim") {
      if (!value) {
        delete errors.nim; // Hapus error jika kosong
      } else {
        if (!/^\d+$/.test(value)) {
          errors.nim = "NIM harus berupa angka";
        } else if (value.length !== 11) {
          errors.nim = "NIM harus tepat 11 digit";
        } else {
          delete errors.nim;
        }
      }
    }

    // 3. Validasi Email
    if (name === "email") {
      if (!value.endsWith("@mail.umy.ac.id")) {
        errors.email = "Wajib gunakan email kampus (@mail.umy.ac.id)";
      } else {
        delete errors.email;
      }
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

    // Cek error validasi
    if (Object.keys(validationErrors).length > 0) {
      setError("Mohon perbaiki data yang merah sebelum daftar.");
      return;
    }

    try {
      await api.post("/auth/register", formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate("/");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Gagal daftar. Cek koneksi atau data duplikat.";
      setError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Daftar Akun
        </h2>

        {error && (
          <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama */}
          <div>
            <input
              type="text"
              name="nama"
              placeholder="Nama Lengkap (Min. 5 Huruf)"
              className={`w-full p-2 border rounded ${
                validationErrors.nama ? "border-red-500" : "border-gray-300"
              }`}
              onChange={handleChange}
            />
            {validationErrors.nama && (
              <p className="text-xs text-red-500 mt-1">
                {validationErrors.nama}
              </p>
            )}
          </div>

          {/* Input NIM - SUDAH DIPERBAIKI (Tidak ada 'required') */}
          <div>
            <input
              type="text"
              name="nim"
              placeholder="NIM (Opsional - 11 Digit)" 
              className={`w-full p-2 border rounded ${
                validationErrors.nim ? "border-red-500" : "border-gray-300"
              }`}
              onChange={handleChange}
            />
            {validationErrors.nim && (
              <p className="text-xs text-red-500 mt-1">
                {validationErrors.nim}
              </p>
            )}
          </div>

          {/* Input Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Kampus (@mail.umy.ac.id)"
              className={`w-full p-2 border rounded ${
                validationErrors.email ? "border-red-500" : "border-gray-300"
              }`}
              onChange={handleChange}
              required
            />
            {validationErrors.email && (
              <p className="text-xs text-red-500 mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Input Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={Object.keys(validationErrors).length > 0}
            className={`w-full p-2 font-bold text-white rounded transition 
              ${
                Object.keys(validationErrors).length > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            Daftar
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Sudah punya akun?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;