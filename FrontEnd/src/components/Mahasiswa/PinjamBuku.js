import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const PinjamBuku = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = state?.book;

  const webcamRef = useRef(null);
  const [coords, setCoords] = useState(null); // Koordinat GPS
  const [imageSrc, setImageSrc] = useState(null); // Hasil Foto Selfie
  const [loading, setLoading] = useState(false);

  // 1. Ambil Lokasi GPS saat halaman dibuka
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

  // 2. Fungsi Ambil Foto dari Webcam
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  // 3. Helper: Ubah Base64 (Webcam) jadi File Object (agar bisa dikirim ke Multer Backend)
  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  // 4. Handle Submit Pinjam
  const handleSubmit = async () => {
    if (!imageSrc || !coords) {
      alert("Wajib ambil foto selfie & tunggu lokasi terdeteksi!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const photoFile = dataURLtoFile(imageSrc, "bukti-pinjam.jpg"); // Konversi otomatis

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("title", book.title);
    formData.append("lat", coords.lat);
    formData.append("long", coords.lng);
    formData.append("proof", photoFile); // Kirim file hasil kamera

    setLoading(true);
    try {
      await api.post("/transaction/borrow", formData);
      alert("Berhasil meminjam buku!");
      navigate("/member/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal meminjam");
    } finally {
      setLoading(false);
    }
  };

  if (!book) return <div className="p-10">Error: Pilih buku dulu.</div>;

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar />
      
      <div className="container mx-auto p-4 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Konfirmasi Peminjaman</h2>
        
        {/* --- BAGIAN 1: PETA LOKASI (Mirip Image 1) --- */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold mb-2">Lokasi Terdeteksi:</h3>
          {coords ? (
            <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 z-0">
              <MapContainer center={[coords.lat, coords.lng]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[coords.lat, coords.lng]}>
                  <Popup>
                    Lokasi Kamu Saat Ini
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <div className="h-64 bg-gray-200 flex items-center justify-center rounded animate-pulse">
              <p>Mencari Lokasi GPS...</p>
            </div>
          )}
        </div>

        {/* --- BAGIAN 2: KAMERA / BUKTI FOTO (Mirip Image 2) --- */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">Bukti Selfie / KTM:</h3>
          
          <div className="flex flex-col items-center">
            {imageSrc ? (
              // Jika sudah ambil foto, tampilkan hasil preview
              <div className="mb-4">
                <img src={imageSrc} alt="Hasil Kamera" className="rounded-lg shadow-md border w-full max-w-md" />
                <button 
                  onClick={() => setImageSrc(null)} 
                  className="mt-2 text-sm text-red-600 underline"
                >
                  Ambil Ulang Foto
                </button>
              </div>
            ) : (
              // Jika belum, tampilkan Webcam Live
              <div className="mb-4 w-full flex justify-center bg-black rounded-lg overflow-hidden">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full max-w-md rounded-lg"
                  videoConstraints={{ facingMode: "user" }} // Kamera depan
                />
              </div>
            )}

            {/* Tombol Aksi */}
            {!imageSrc ? (
              <button 
                onClick={capture}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 shadow-lg mb-4"
              >
                📸 Ambil Foto
              </button>
            ) : (
              <div className="w-full">
                <div className="bg-blue-50 p-3 rounded mb-4 text-center">
                   <p className="font-bold text-gray-700">Buku: {book.title}</p>
                </div>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !coords}
                  className={`w-full py-3 text-white font-bold rounded-lg shadow-lg ${
                    loading || !coords ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? "Memproses..." : "✅ Konfirmasi Pinjam"}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PinjamBuku;