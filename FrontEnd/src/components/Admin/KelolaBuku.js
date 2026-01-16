import React, { useState, useEffect } from "react";
import api from "../../api";
import Navbar from "./Navbar";

const KelolaBuku = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "", 
    author: "", 
    year: "", 
    stock: "", 
    category: "" // Ini nanti akan diisi dari dropdown
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // --- 1. DAFTAR KATEGORI DDC (Ditambahkan di sini) ---
  const categories = [
    { code: "000", name: "Karya Umum & Komputer" },
    { code: "100", name: "Filsafat & Psikologi" },
    { code: "200", name: "Agama" },
    { code: "300", name: "Ilmu Sosial" },
    { code: "400", name: "Bahasa" },
    { code: "500", name: "Sains & Matematika" },
    { code: "600", name: "Teknologi" },
    { code: "700", name: "Kesenian & Rekreasi" },
    { code: "800", name: "Kesusastraan" },
    { code: "900", name: "Sejarah & Geografi" },
  ];

  // Ambil data buku saat halaman dibuka
  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);



  const handleEdit = (book) => {
    // Isi form dengan data buku yang dipilih
    setForm({
      title: book.title,
      author: book.author,
      year: book.year,
      stock: book.stock,
      category: book.category
    });
    setIsEditing(true);
    setEditId(book.id);
    
    // Scroll ke atas agar form terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus buku ini?")) {
      try {
        await api.delete(`/books/${id}`);
        fetchBooks(); // Refresh tabel
      } catch (err) {
        alert("Gagal menghapus buku");
      }
    }
  };

  const resetForm = () => {
    setForm({ title: "", author: "", year: "", stock: "", category: "" });
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Mode Update
        await api.put(`/books/${editId}`, form);
        alert("Buku berhasil diperbarui!");
      } else {
        // Mode Tambah Baru
        await api.post("/books", form);
        alert("Buku berhasil ditambahkan!");
      }
      resetForm();
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menyimpan data");
    }
  };

return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Kelola Buku</h2>

        {/* Form Input / Edit */}
        <div className="bg-white p-6 rounded shadow mb-8 border-t-4 border-blue-600">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {isEditing ? "Edit Data Buku" : "Tambah Buku Baru"}
            </h3>
            {isEditing && (
              <button onClick={resetForm} className="text-sm text-red-500 hover:underline">
                Batal Edit
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              className="p-2 border rounded" placeholder="Judul Buku" 
              value={form.title} onChange={e => setForm({...form, title: e.target.value})} required 
            />
            <input 
              className="p-2 border rounded" placeholder="Penulis" 
              value={form.author} onChange={e => setForm({...form, author: e.target.value})} required 
            />
            <input 
              className="p-2 border rounded" placeholder="Tahun Terbit" type="number"
              value={form.year} onChange={e => setForm({...form, year: e.target.value})} required 
            />
            <input 
              className="p-2 border rounded" placeholder="Stok" type="number"
              value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required 
            />
            <select
              className="p-2 border rounded bg-white md:col-span-2"
              value={form.category}
              onChange={(e) => setForm({...form, category: e.target.value})}
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.code} value={`${cat.code} - ${cat.name}`}>
                  {cat.code} - {cat.name}
                </option>
              ))}
            </select>

            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className={`flex-1 p-2 rounded text-white font-bold ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
                {isEditing ? "Update Buku" : "Simpan Buku"}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabel Daftar Buku */}
        <div className="bg-white p-6 rounded shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 border">Judul</th>
                <th className="p-3 border">Penulis</th>
                <th className="p-3 border">Kategori</th>
                <th className="p-3 border text-center">Stok</th>
                <th className="p-3 border text-center">Tahun</th>
                <th className="p-3 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.author}</td>
                  <td className="p-3 text-sm text-gray-600">{book.category}</td>
                  <td className="p-3 text-center font-bold text-blue-600">{book.stock}</td>
                  <td className="p-3 text-center">{book.year}</td>
                  <td className="p-3 text-center space-x-2">
                    {/* Tombol Edit */}
                    <button 
                      onClick={() => handleEdit(book)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm"
                    >
                      Edit
                    </button>
                    {/* Tombol Hapus */}
                    <button 
                      onClick={() => handleDelete(book.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {books.length === 0 && (
            <p className="text-center text-gray-500 mt-4">Belum ada data buku.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KelolaBuku;