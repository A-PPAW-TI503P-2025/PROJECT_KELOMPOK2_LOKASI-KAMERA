import React, { useState, useEffect } from "react";
import api from "../../api";
import Navbar from "./Navbar";

const Laporan = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/transaction/history");
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Laporan & Validasi Peminjaman</h2>
        
        <div className="bg-white p-6 rounded shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3">Peminjam</th>
                <th className="p-3">Buku</th>
                <th className="p-3">Status</th>
                <th className="p-3">Bukti Pinjam</th>
                <th className="p-3">Lokasi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.peminjam}</td>
                  <td className="p-3">{t.judul_buku}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      t.status === 'dipinjam' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                    }`}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  
                  {/* Tampilkan Bukti Foto */}
                  <td className="p-3">
                    {t.borrow_proof ? (
                      <a 
                        href={`http://localhost:3000/${t.borrow_proof.replace(/\\/g, "/")}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-500 underline"
                      >
                        Lihat Foto
                      </a>
                    ) : (
                      <span className="text-red-500">Tidak ada</span>
                    )}
                  </td>

                  {/* Link Google Maps */}
                  <td className="p-3">
                    {t.lat && t.long ? (
                      <a 
                        href={`https://www.google.com/maps?q=${t.lat},${t.long}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                      >
                        📍 Cek Map
                      </a>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Laporan;