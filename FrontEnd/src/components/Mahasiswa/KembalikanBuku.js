import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import Navbar from "./Navbar";
import Webcam from "react-webcam";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Icon Leaflet yang hilang
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const KembalikanBuku = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null); 
  const webcamRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Ambil data user dari LocalStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // --- 1. AMBIL DATA & FILTER (BAGIAN YG DIPERBAIKI) ---
  const fetchMyLoans = async () => {
    try {
      const res = await api.get("/transaction/history");
      
      // Debugging: Cek data di Console (Tekan F12 di browser)
      console.log("Semua Transaksi:", res.data);
      console.log("User Login:", user);

      // Filter Transaksi: Hanya yang statusnya 'dipinjam' DAN milik user ini
      const myActiveLoans = res.data.filter((t) => {
        const isBorrowed = t.status === "dipinjam";
        
        // Logika Pengecekan ID yang Lebih Kuat (Handle beda nama kolom & tipe data)
        const isMyData = 
             (t.user_id == user.id) ||       // Cek user_id (SQL biasa)
             (t.userId == user.id) ||        // Cek userId (Sequelize/ORM)
             (t.User?.email === user.email) || // Cek via Email (Relasi)
             (t.email === user.email);       // Cek email langsung

        return isBorrowed && isMyData;
      });

      console.log("Data Milik User:", myActiveLoans);
      setLoans(myActiveLoans);

    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchMyLoans();
  }, []);

  // --- 2. AMBIL LOKASI (Saat pilih buku) ---
  useEffect(() => {
    if (selectedLoan && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => alert("Gagal ambil lokasi. Pastikan GPS aktif!")
      );
    }
  }, [selectedLoan]);

  // --- 3. FUNGSI KAMERA ---
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  // --- 4. CONVERT FOTO KE FILE ---
  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){ u8arr[n] = bstr.charCodeAt(n); }
    return new File([u8arr], filename, {type:mime});
  }

  // --- 5. KIRIM DATA PENGEMBALIAN ---
  const handleReturn = async () => {
    if (!imageSrc || !coords) {
      alert("Wajib ambil foto bukti & tunggu lokasi terdeteksi!");
      return;
    }

    const photoFile = dataURLtoFile(imageSrc, "bukti-kembali.jpg");
    
    const formData = new FormData();
    formData.append("email", user.email);
    // Pastikan key judul bukunya benar (judul_buku / Book.title / title)
    const bookTitle = selectedLoan.judul_buku || selectedLoan.Book?.title || selectedLoan.title;
    formData.append("title", bookTitle);
    
    formData.append("lat", coords.lat);
    formData.append("long", coords.lng);
    formData.append("proof", photoFile);

    setLoading(true);
    try {
      await api.post("/transaction/return", formData);
      alert("Buku berhasil dikembalikan! Terima kasih 🌸");
      
      // Reset Form
      setSelectedLoan(null);
      setImageSrc(null);
      setCoords(null);
      fetchMyLoans(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Gagal mengembalikan buku. Cek console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF4FF] font-sans flex">
      {/* Sidebar */}
      <Navbar />
      
      {/* Konten Utama */}
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          Peminjaman Saya <span className="text-pink-500">📚</span>
        </h2>

        {!selectedLoan ? (
          // --- TAMPILAN 1: LIST BUKU ---
          loans.length === 0 ? (
            <div className="bg-white p-10 rounded-[30px] shadow-sm border border-purple-50 text-center">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🤷‍♀️</div>
                <h3 className="text-xl font-bold text-gray-700">Belum ada buku yang dipinjam</h3>
                <p className="text-gray-400 mt-2">Data kosong atau sedang loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loans.map((loan) => (
                <div key={loan.id} className="bg-white p-6 rounded-[25px] shadow-sm border border-purple-50 hover:shadow-md transition group">
                  <div className="flex gap-4 mb-4">
                     <div className="w-16 h-20 bg-pink-50 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img src="https://cdn-icons-png.flaticon.com/512/3330/3330314.png" alt="Book" className="w-full h-full object-cover p-2" />
                     </div>
                     <div>
                        {/* Handle nama kolom yg beda-beda */}
                        <h3 className="font-bold text-gray-800 line-clamp-2">
                          {loan.judul_buku || loan.Book?.title || "Judul Tidak Ada"}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Dipinjam: {new Date(loan.borrow_date || loan.createdAt).toLocaleDateString()}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-600 text-[10px] font-bold rounded-full uppercase tracking-wide border border-yellow-200">
                           Sedang Dipinjam
                        </span>
                     </div>
                  </div>
                  <button
                    onClick={() => setSelectedLoan(loan)}
                    className="w-full py-3 bg-white border-2 border-pink-200 text-pink-500 font-bold rounded-xl hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all shadow-sm"
                  >
                    Kembalikan Buku
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          // --- TAMPILAN 2: FORM PENGEMBALIAN (Kamera & Map) ---
          <div className="animate-fade-in bg-white p-8 rounded-[30px] shadow-lg border border-purple-50 max-w-4xl mx-auto">
             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-bold text-gray-800">Pengembalian Buku</h3>
                <button onClick={() => { setSelectedLoan(null); setImageSrc(null); }} className="text-gray-400 hover:text-red-500 font-bold text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition">
                   ✕ Batal
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* KIRI: Info & Map */}
                <div className="space-y-4">
                   <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
                      <p className="text-xs text-pink-400 font-bold uppercase mb-1">Judul Buku</p>
                      <h4 className="text-lg font-bold text-pink-700">
                        {selectedLoan.judul_buku || selectedLoan.Book?.title}
                      </h4>
                   </div>
                   
                   <div className="h-56 w-full rounded-2xl overflow-hidden border border-gray-200 relative z-0 shadow-inner">
                      {coords ? (
                        <MapContainer center={[coords.lat, coords.lng]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                           <Marker position={[coords.lat, coords.lng]}><Popup>Lokasi Anda</Popup></Marker>
                        </MapContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm animate-pulse flex-col gap-2">
                          <span className="text-2xl">📡</span>
                          Menunggu Sinyal GPS...
                        </div>
                      )}
                   </div>
                </div>

                {/* KANAN: Kamera */}
                <div className="flex flex-col items-center">
                   <p className="mb-2 font-bold text-gray-600 text-sm">Foto Kondisi Buku</p>
                   <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-md mb-4 border-4 border-white ring-1 ring-gray-100">
                      {imageSrc ? (
                         <img src={imageSrc} alt="Bukti" className="w-full h-full object-cover" />
                      ) : (
                         <Webcam 
                            audio={false} 
                            ref={webcamRef} 
                            screenshotFormat="image/jpeg" 
                            className="w-full h-full object-cover" 
                            videoConstraints={{ facingMode: "environment" }} // Kamera Belakang (jika di HP)
                         />
                      )}
                   </div>

                   {!imageSrc ? (
                      <button onClick={capture} className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-transform">
                         📸 Ambil Foto
                      </button>
                   ) : (
                      <div className="flex gap-3 w-full">
                         <button onClick={() => setImageSrc(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">Ulang</button>
                         <button 
                            onClick={handleReturn} 
                            disabled={loading || !coords} 
                            className={`flex-[2] py-3 text-white rounded-xl font-bold shadow-lg transition-all ${loading || !coords ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-[1.02]'}`}
                         >
                            {loading ? "Memproses..." : "✅ Kirim Bukti"}
                         </button>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default KembalikanBuku;