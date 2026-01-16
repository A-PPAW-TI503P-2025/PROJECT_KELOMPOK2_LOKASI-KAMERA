import React, { useState, useEffect } from "react";
import api from "../../api";
import Navbar from "./Navbar";

const Laporan = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/transaction/history");
        const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTransactions(sortedData);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FDF4FF] font-sans">
      <Navbar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">Laporan Transaksi <span className="text-blue-400">📝</span></h2>
           <div className="bg-white px-4 py-2 rounded-full border border-pink-50 shadow-sm text-pink-500 font-bold text-sm">
              Total: {transactions.length} Data
           </div>
        </div>

        <div className="bg-white rounded-[30px] shadow-sm border border-pink-50 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-pink-50 text-pink-600">
              <tr>
                <th className="p-5 font-bold text-sm">Peminjam</th>
                <th className="p-5 font-bold text-sm">Buku</th>
                <th className="p-5 font-bold text-sm text-center">Status</th>
                <th className="p-5 font-bold text-sm text-center">Bukti</th>
                <th className="p-5 font-bold text-sm text-center">Lokasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-pink-50/30 transition group">
                  <td className="p-5">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-xs">
                              {t.peminjam ? t.peminjam.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                              <p className="font-bold text-gray-700 text-sm">{t.peminjam}</p>
                              <p className="text-xs text-gray-400">ID: {t.userId}</p>
                          </div>
                      </div>
                  </td>
                  <td className="p-5">
                      <p className="font-bold text-gray-700 text-sm">{t.judul_buku || t.Book?.title}</p>
                      <p className="text-xs text-gray-400">{new Date(t.borrow_date || t.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        t.status === 'dipinjam' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                      }`}>
                          {t.status}
                      </span>
                  </td>
                  <td className="p-5 text-center">
                      {t.borrow_proof ? (
                          <a href={`http://localhost:5000/${t.borrow_proof.replace(/\\/g, "/")}`} target="_blank" rel="noreferrer" className="text-pink-500 hover:text-pink-700 text-xs font-bold underline flex items-center justify-center gap-1">
                              📸 Foto
                          </a>
                      ) : <span className="text-gray-300 text-xs">-</span>}
                  </td>
                  <td className="p-5 text-center">
                      {t.lat && t.long ? (
                          <a href={`https://www.google.com/maps?q=${t.lat},${t.long}`} target="_blank" rel="noreferrer" className="bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 px-3 py-1 rounded-lg text-xs font-bold transition">
                              📍 Map
                          </a>
                      ) : <span className="text-gray-300 text-xs">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Laporan;