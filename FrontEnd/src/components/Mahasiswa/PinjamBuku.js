import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import Navbar from "./Navbar";
import Webcam from "react-webcam";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Pastikan CSS Leaflet diimport

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const PinjamBuku = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = state?.book;

  const webcamRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
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
    } else {
      alert("Browser tidak support GPS.");
    }
  }, []);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  const handleSubmit = async () => {
    if (!imageSrc || !coords) {
      alert("Wajib ambil foto selfie & tunggu lokasi terdeteksi!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const photoFile = dataURLtoFile(imageSrc, "bukti-pinjam.jpg");

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("title", book.title);
    formData.append("lat", coords.lat);
    formData.append("long", coords.lng);
    formData.append("proof", photoFile);

    setLoading(true);
    try {
      await api.post("/transaction/borrow", formData);
      alert("Berhasil meminjam buku!");
      navigate("/member/kembali"); // Redirect ke halaman "Peminjaman Saya"
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal meminjam");
    } finally {
      setLoading(false);
    }
  };

  if (!book) return <div className="p-10 text-center text-pink-600 font-bold">Error: Pilih buku dulu dari dashboard.</div>;

  return (
    <div className="min-h-screen bg-[#FDF4FF] font-sans flex">
      <Navbar />
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Konfirmasi Peminjaman <span className="text-pink-500">📸</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* KOLOM KIRI: MAP & INFO BUKU */}
          <div className="space-y-6">
             {/* Info Buku Card */}
             <div className="bg-white p-6 rounded-[25px] shadow-sm border border-purple-50 flex items-start gap-4">
                <img src={book.cover_image || "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg"} alt={book.title} className="w-24 h-32 object-cover rounded-xl shadow-md" />
                <div>
                   <h3 className="text-xl font-bold text-gray-800">{book.title}</h3>
                   <p className="text-gray-500 text-sm mb-2">{book.author}</p>
                   <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold">Stok: {book.stock}</span>
                </div>
             </div>

             {/* Map Card */}
             <div className="bg-white p-6 rounded-[25px] shadow-sm border border-purple-50">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  📍 Lokasi Anda
                </h3>
                {coords ? (
                  <div className="h-64 w-full rounded-2xl overflow-hidden border border-gray-100 z-0 relative shadow-inner">
                    <MapContainer center={[coords.lat, coords.lng]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[coords.lat, coords.lng]}>
                        <Popup>Lokasi Pinjam</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                ) : (
                  <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center animate-pulse border border-dashed border-gray-300">
                    <p className="text-gray-400 font-medium">Mencari GPS...</p>
                  </div>
                )}
             </div>
          </div>

          {/* KOLOM KANAN: KAMERA */}
          <div className="bg-white p-6 rounded-[25px] shadow-sm border border-purple-50 flex flex-col items-center justify-center text-center h-fit">
            <h3 className="font-bold text-gray-700 mb-2">Ambil Foto Selfie / KTM</h3>
            <p className="text-xs text-gray-400 mb-6">Pastikan wajah terlihat jelas ya!</p>

            <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-1 ring-gray-100 mb-6">
               {imageSrc ? (
                 <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
               ) : (
                 <Webcam
                   audio={false}
                   ref={webcamRef}
                   screenshotFormat="image/jpeg"
                   className="w-full h-full object-cover"
                   videoConstraints={{ facingMode: "user" }}
                 />
               )}
            </div>

            <div className="w-full max-w-sm space-y-3">
              {!imageSrc ? (
                <button onClick={capture} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all">
                  📸 Jepret Foto
                </button>
              ) : (
                <div className="flex gap-3">
                   <button onClick={() => setImageSrc(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                     Ulangi
                   </button>
                   <button 
                     onClick={handleSubmit} 
                     disabled={loading || !coords}
                     className={`flex-[2] py-3 text-white rounded-xl font-bold shadow-lg transition-all ${loading || !coords ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-pink-300 hover:scale-[1.02]'}`}
                   >
                     {loading ? "Memproses..." : "✅ Konfirmasi"}
                   </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default PinjamBuku;