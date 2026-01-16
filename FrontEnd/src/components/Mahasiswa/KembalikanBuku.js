import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import Navbar from "./Navbar";
import Webcam from "react-webcam";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

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
  const [selectedLoan, setSelectedLoan] = useState(null); // Buku yang dipilih untuk dikembalikan

  // State untuk Fitur Lokasi & Kamera
  const webcamRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Ambil Data Peminjaman
  const fetchMyLoans = async () => {
    try {
      const res = await api.get("/transaction/history");
      const myActiveLoans = res.data.filter(
        (t) => t.status === "dipinjam" && t.peminjam === user.nama
      );
      setLoans(myActiveLoans);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyLoans();
  }, []);

  // 2. Ambil Lokasi SAAT user memilih buku (agar fresh)
  useEffect(() => {
    if (selectedLoan && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          alert("Gagal ambil lokasi. Pastikan GPS aktif!");
        }
      );
    }
  }, [selectedLoan]);

  // 3. Fungsi Kamera
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  // 4. Helper: Convert Base64 ke File
  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  // 5. Handle Submit Pengembalian
  const handleReturn = async () => {
    if (!imageSrc || !coords) {
      alert("Wajib ambil foto bukti & tunggu lokasi terdeteksi!");
      return;
    }

    const photoFile = dataURLtoFile(imageSrc, "bukti-kembali.jpg");
    
    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("title", selectedLoan.judul_buku);
    formData.append("lat", coords.lat);
    formData.append("long", coords.lng);
    formData.append("proof", photoFile);

    setLoading(true);
    try {
      await api.post("/transaction/return", formData);
      alert("Buku berhasil dikembalikan!");
      
      // Reset State agar kembali ke daftar
      setSelectedLoan(null);
      setImageSrc(null);
      setCoords(null);
      fetchMyLoans(); // Refresh list agar buku yang dikembalikan hilang
    } catch (err) {
      console.error(err);
      alert("Gagal mengembalikan buku.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Peminjaman Saya</h2>

        {/* --- TAMPILAN 1: LIST BUKU (Jika belum memilih buku) --- */}
        {!selectedLoan ? (
          loans.length === 0 ? (
            <div className="text-center p-10 bg-white rounded shadow">
                <p className="text-gray-500 text-lg">Tidak ada buku yang sedang dipinjam.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loans.map((loan) => (
                <div key={loan.id} className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
                  <h3 className="text-xl font-bold text-gray-800">{loan.judul_buku}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Dipinjam pada: {new Date(loan.borrow_date || loan.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => setSelectedLoan(loan)}
                    className="w-full bg-yellow-500 text-white font-bold py-2 rounded hover:bg-yellow-600 transition"
                  >
                    Proses Pengembalian (Kamera & Map)
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          
          /* --- TAMPILAN 2: PROSES PENGEMBALIAN (Kamera & Map) --- */
          <div className="max-w-3xl mx-auto animate-fade-in">
            <button 
              onClick={() => { setSelectedLoan(null); setImageSrc(null); }}
              className="mb-4 text-gray-600 hover:text-gray-900 font-semibold"
            >
              &larr; Batal & Kembali ke Daftar
            </button>

            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="text-xl font-bold mb-4 border-b pb-2 text-center">
                Mengembalikan: <span className="text-blue-600">{selectedLoan.judul_buku}</span>
              </h3>

              {/* MAP SECTION */}
              <div className="mb-6">
                <p className="font-bold mb-2 text-gray-700">1. Lokasi Pengembalian:</p>
                {coords ? (
                  <div className="h-48 w-full rounded overflow-hidden border z-0 relative">
                    <MapContainer center={[coords.lat, coords.lng]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[coords.lat, coords.lng]}>
                        <Popup>Lokasi Anda</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center animate-pulse rounded">
                    <span className="text-gray-500">Menunggu Sinyal GPS...</span>
                  </div>
                )}
              </div>

              {/* CAMERA SECTION */}
              <div className="mb-6">
                <p className="font-bold mb-2 text-gray-700">2. Foto Bukti Buku:</p>
                <div className="flex flex-col items-center">
                  {imageSrc ? (
                    <div className="mb-3">
                      <img src={imageSrc} alt="Preview" className="rounded border shadow max-w-sm w-full" />
                      <button onClick={() => setImageSrc(null)} className="text-red-500 text-sm underline mt-2 font-bold">Ambil Ulang Foto</button>
                    </div>
                  ) : (
                    <div className="mb-3 w-full flex justify-center bg-black rounded overflow-hidden shadow-inner">
                       <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          className="w-full max-w-sm rounded"
                          videoConstraints={{ facingMode: "user" }}
                        />
                    </div>
                  )}

                  {!imageSrc && (
                    <button onClick={capture} className="bg-blue-600 text-white px-8 py-2 rounded-full hover:bg-blue-700 font-bold shadow-lg transition transform hover:scale-105">
                      📸 Ambil Foto
                    </button>
                  )}
                </div>
              </div>

              {/* TOMBOL KONFIRMASI */}
              <button 
                onClick={handleReturn}
                disabled={loading || !coords || !imageSrc}
                className={`w-full py-3 text-white font-bold rounded-lg text-lg shadow-md transition ${
                  loading || !coords || !imageSrc ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? "Memproses..." : "✅ Konfirmasi Pengembalian"}
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KembalikanBuku;