import React, { useState, useEffect } from "react";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";

const KelolaBuku = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "", 
    author: "", 
    year: "", 
    stock: "", 
    category: "" 
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // --- KATEGORI DDC ---
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
    setForm({
      title: book.title,
      author: book.author,
      year: book.year,
      stock: book.stock,
      category: book.category
    });
    setIsEditing(true);
    setEditId(book.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus buku ini?")) {
      try {
        await api.delete(`/books/${id}`);
        fetchBooks();
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
        await api.put(`/books/${editId}`, form);
        alert("Buku berhasil diperbarui!");
      } else {
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#0d0e12] text-white font-sans overflow-hidden">
      
      {/* 1. SIDEBAR KIRI (Dark Grey - Konsisten) */}
      <aside className="w-64 bg-[#1C1C2E] flex flex-col justify-between py-6 px-4 border-r border-gray-800">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">A</div>
            <span className="text-xl font-bold tracking-wide">Admin<span className="text-blue-500">Panel</span></span>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Main Menu</p>
            
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#252538] hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Dashboard
            </Link>

            {/* Menu Aktif: Kelola Buku */}
            <Link to="/admin/kelola-buku" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              Kelola Buku
            </Link>

            <Link to="/admin/laporan" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#252538] hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              Laporan & Validasi
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </aside>

      {/* 2. KONTEN UTAMA */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header Sama Persis */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <svg className="w-5 h-5 absolute left-3 top-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search data..." className="w-full bg-[#1C1C2E] text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" />
            </div>
            <div>
               <p className="text-sm font-bold">Administrator</p>
               <p className="text-xs text-gray-400">Super User</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
          Management Buku <span className="text-blue-500">📚</span>
        </h2>

        {/* --- FORM INPUT (Dark Theme) --- */}
        <div className="bg-[#1C1C2E] p-8 rounded-3xl border border-gray-800 mb-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
            <h3 className="text-lg font-bold text-white">
              {isEditing ? "Edit Data Buku" : "Tambah Buku Baru"}
            </h3>
            {isEditing && (
              <button onClick={resetForm} className="text-sm text-red-400 hover:text-red-300 font-bold">
                ✕ Batal Edit
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Judul Buku</label>
                <input 
                  className="w-full bg-[#0d0e12] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 transition" 
                  placeholder="Masukkan Judul..." 
                  value={form.title} onChange={e => setForm({...form, title: e.target.value})} required 
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Penulis</label>
                <input 
                  className="w-full bg-[#0d0e12] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 transition" 
                  placeholder="Nama Penulis" 
                  value={form.author} onChange={e => setForm({...form, author: e.target.value})} required 
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tahun Terbit</label>
                <input 
                  className="w-full bg-[#0d0e12] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 transition" 
                  placeholder="Contoh: 2024" type="number"
                  value={form.year} onChange={e => setForm({...form, year: e.target.value})} required 
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Stok Buku</label>
                <input 
                  className="w-full bg-[#0d0e12] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 transition" 
                  placeholder="Jumlah Stok" type="number"
                  value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required 
                />
            </div>
            <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Kategori (DDC)</label>
                <select
                  className="w-full bg-[#0d0e12] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 transition"
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
            </div>

            <div className="md:col-span-2 pt-2">
              <button type="submit" className={`w-full p-3 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95 ${isEditing ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                {isEditing ? "✨ Update Data Buku" : "＋ Simpan Buku Baru"}
              </button>
            </div>
          </form>
        </div>

        {/* --- TABEL DAFTAR BUKU (Dark Table) --- */}
        <div className="bg-[#1C1C2E] rounded-3xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
             <h3 className="font-bold text-white">Daftar Pustaka</h3>
             <span className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-300">Total: {books.length} Buku</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#13131F] text-gray-400">
                <tr>
                  <th className="p-5 text-xs uppercase font-bold tracking-wider">Judul & Penulis</th>
                  <th className="p-5 text-xs uppercase font-bold tracking-wider">Kategori</th>
                  <th className="p-5 text-xs uppercase font-bold tracking-wider text-center">Stok</th>
                  <th className="p-5 text-xs uppercase font-bold tracking-wider text-center">Tahun</th>
                  <th className="p-5 text-xs uppercase font-bold tracking-wider text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-[#252538] transition-colors group">
                    <td className="p-5">
                        <div className="font-bold text-white text-sm group-hover:text-blue-400 transition">{book.title}</div>
                        <div className="text-xs text-gray-500">{book.author}</div>
                    </td>
                    <td className="p-5">
                        <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-bold border border-gray-700">
                            {book.category || "Umum"}
                        </span>
                    </td>
                    <td className="p-5 text-center">
                        <span className={`font-bold ${book.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {book.stock}
                        </span>
                    </td>
                    <td className="p-5 text-center text-sm text-gray-400">{book.year}</td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(book)}
                          className="w-8 h-8 flex items-center justify-center bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-white transition"
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button 
                          onClick={() => handleDelete(book.id)}
                          className="w-8 h-8 flex items-center justify-center bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                          title="Hapus"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {books.length === 0 && (
            <div className="p-10 text-center text-gray-500">
                Belum ada data buku.
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default KelolaBuku;