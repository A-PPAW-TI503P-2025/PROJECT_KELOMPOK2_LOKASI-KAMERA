import React, { useState, useEffect } from "react";
import api from "../../api";
import Navbar from "./Navbar";

const KelolaBuku = () => {
  const [books, setBooks] = useState([]);
  const initialFormState = { title: "", author: "", year: "", stock: "", category: "", cover_image: "" };
  const [form, setForm] = useState(initialFormState);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const categories = [
    { code: "000", name: "Karya Umum" }, { code: "100", name: "Filsafat" }, { code: "200", name: "Agama" },
    { code: "300", name: "Ilmu Sosial" }, { code: "400", name: "Bahasa" }, { code: "500", name: "Sains" },
    { code: "600", name: "Teknologi" }, { code: "700", name: "Kesenian" }, { code: "800", name: "Sastra" }, { code: "900", name: "Sejarah" }
  ];

  const fetchBooks = async () => {
    try { const res = await api.get("/books"); setBooks(res.data); } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchBooks(); }, []);

  const handleEdit = (book) => {
    setForm({ 
        title: book.title, 
        author: book.author, 
        year: book.year, 
        stock: book.stock, 
        category: book.category, 
        cover_image: book.cover_image || "" 
    });
    setIsEditing(true); 
    setEditId(book.id); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsEditing(false);       
    setEditId(null);           
    setForm(initialFormState); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus?")) { await api.delete(`/books/${id}`); fetchBooks(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      isEditing ? await api.put(`/books/${editId}`, form) : await api.post("/books", form);
      alert("Berhasil!"); 
      setForm(initialFormState);
      setIsEditing(false);
      setEditId(null);
      fetchBooks();
    } catch (err) { alert("Gagal simpan"); }
  };

  return (
    <div className="flex min-h-screen bg-[#FDF4FF] font-sans">
      <Navbar />
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">Kelola Buku <span className="text-pink-500">📚</span></h2>

        {/* FORM INPUT */}
        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-pink-50 mb-8">
          <div className="flex justify-between mb-6 border-b border-pink-50 pb-4">
             <h3 className="text-xl font-bold text-gray-700">{isEditing ? "Edit Buku" : "Tambah Buku Baru"}</h3>
             {isEditing && <button onClick={handleCancel} className="text-pink-500 font-bold text-sm hover:text-pink-700 transition">Batal</button>}          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <input className="input-pink" placeholder="Judul Buku" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
             <input className="input-pink" placeholder="Penulis" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required />
             <input className="input-pink" type="number" placeholder="Tahun" value={form.year} onChange={e => setForm({...form, year: e.target.value})} required />
             <input className="input-pink" type="number" placeholder="Stok" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
             <select className="input-pink" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                <option value="">- Kategori -</option>
                {categories.map(c => <option key={c.code} value={`${c.code} - ${c.name}`}>{c.name}</option>)}
             </select>
             
             <button type="submit" className="md:col-span-2 py-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl font-bold shadow-md hover:shadow-pink-200 transition transform active:scale-95">
                {isEditing ? "Simpan Perubahan" : "Tambah Buku"}
             </button>
          </form>
        </div>

        {/* TABEL BUKU */}
        <div className="bg-white rounded-[30px] shadow-sm border border-pink-50 overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-pink-50 text-pink-600">
                 <tr>
                    <th className="p-5 font-bold text-sm">Buku</th>
                    <th className="p-5 font-bold text-sm">Kategori</th>
                    <th className="p-5 font-bold text-sm text-center">Stok</th>
                    <th className="p-5 font-bold text-sm text-center">Aksi</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                 {books.map(b => (
                    <tr key={b.id} className="hover:bg-pink-50/30 transition">
                       <td className="p-5 font-bold text-gray-700">{b.title}<br/><span className="text-xs font-normal text-gray-400">{b.author}</span></td>
                       <td className="p-5"><span className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs font-bold">{b.category}</span></td>
                       <td className="p-5 text-center font-bold text-gray-600">{b.stock}</td>
                       <td className="p-5 text-center">
                          <button onClick={() => handleEdit(b)} className="text-yellow-500 hover:text-yellow-600 mr-3">✎</button>
                          <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-600">🗑</button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </main>
      
      {/* Custom CSS untuk Input biar ringkas */}
      <style>{`
        .input-pink {
           width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #FBCFE8;
           background: #FFF; color: #4B5563; outline: none; transition: all;
        }
        .input-pink:focus { border-color: #EC4899; box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1); }
      `}</style>
    </div>
  );
};

export default KelolaBuku;