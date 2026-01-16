import React, { useState, useEffect } from "react";
import api from "../../api";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const LihatDaftarBuku = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books");
        setBooks(res.data);
      } catch (err) {
        console.error("Gagal ambil buku", err);
      }
    };
    fetchBooks();
  }, []);

  // Fungsi untuk lanjut ke halaman form pinjam
  const handlePinjamClick = (book) => {
    if (book.stock <= 0) {
      alert("Stok buku habis!");
      return;
    }
    // Kirim data buku ke halaman PinjamBuku lewat state
    navigate("/member/pinjam", { state: { book } });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Koleksi Buku</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-1">Penulis: {book.author}</p>
              <p className="text-gray-600 mb-1">Kategori: {book.category}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`font-bold ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Stok: {book.stock}
                </span>
                <button
                  onClick={() => handlePinjamClick(book)}
                  className={`px-4 py-2 rounded text-white ${
                    book.stock > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={book.stock <= 0}
                >
                  {book.stock > 0 ? "Pinjam" : "Habis"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LihatDaftarBuku;