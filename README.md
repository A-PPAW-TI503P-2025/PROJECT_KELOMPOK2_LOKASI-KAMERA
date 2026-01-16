# Proyek Lokasi & Kamera (Kelompok 2)
## Aplikasi berbasis web untuk sistem peminjaman buku perpustakaan untuk verifikasi keamanan menggunakan Foto Selfie dan Lokasi GPS secara real-time

---

### Anggota Kelompok 2
| No | Nama | Peran | NIM |
|---|---|---|---|
| 1 | Aulia Nurfitria Dewi | Backend | 20230140006 |
| 2 | Octaviani Putri Anggraeni | Frontend | 20230140032 |
| 3 | Mesi Ananda Putri | Frontend | 20230140035 |
| 4 | Lailatul Ramadhani | Sistem Informasi dan Laporan | 20230140041 |
| 5 | Ananda Julia Rahmah | Sistem Informasi dan Laporan | 20230140046 |
| 6 | Ibnaty Salsabila T | Backend | 20230140047 |
| 7 | Nachma Olivia | Database | 20230140048 |

---

### Fitur Utama
- **Smart Verification**: Pengambilan foto otomatis menggunakan Webcam saat proses pinjam/kembali
- **Geolocation Tagging**: Pencatatan otomatis Latitude & Longitude lokasi user menggunakan Geolocation API
- **Multi-Role Access**: Pustakawan (Admin) dan Mahasiswa memiliki dashboard yang berbeda
- **CRUD Management**: Kelola data buku (Tambah, Edit, Hapus) dengan validasi real-time
- **Activity History**: Riwayat peminjaman lengkap dengan bukti foto dan titik koordinat map

---

## Tech Stack
| Bagian | Teknologi |
|---|---|
| **Frontend** | HTML5, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL Workbench |
| **Sistem Informasi** | Plant UML, Word |
| **Tools** | GitHub, VS Code, Browser |

---

## Struktur Folder
```text
PROJECT_KELOMPOK2_LOKASI-KAMERA/
├── Backend/               # API Server (Node.js)
│   ├── config/            # Koneksi Database
│   ├── controllers/       # Logika Bisnis (CRUD, Auth)
│   ├── middleware/        # JWT & Upload Auth
│   ├── routes/            # Routing API
│   ├── uploads/           # Penyimpanan foto selfie
│   └── server.js          # Entry point Backend
├── DB/                    # Skrip Database SQL
│   ├── dbperpusquery.sql  # Struktur Tabel & Data
│   └── trigger-sp-tcl.sql # Prosedur & Trigger
├── FrontEnd/              # Client Side (React + Tailwind)
│   ├── public/            # Aset Statis
│   ├── src/               # Source Code Utama
│   └── tailwind.config.js # Konfigurasi CSS
├── UML/                   # Dokumentasi Rancangan Sistem
└── .env                   # Environment Variables
```

---

## Instalasi & Menjalankan Proyek
Berikut langkah-langkah untuk menjalankan proyek dilokal:

### 1. Persiapan Database
1. Buka aplikasi manajemen database Anda 
2. Buat database baru dengan nama `perpustakaan_db` 
3. Masuk ke folder `DB/` dalam proyek ini
4. Impor file sesuai urutan berikut:
   - Pertama, jalankan `dbperpusquery.sql` (untuk struktur tabel dan data awal)
   - Kedua, jalankan `trigger-sp-tcl.sql` (untuk mengaktifkan fungsi otomatis dan keamanan data)

### 2. Konfigurasi Environment (.env)
1. Pastikan Anda berada di root folder proyek.
2. Edit file `.env` dan sesuaikan dengan kredensial MySQL Anda:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=perpustakaan_db
   PORT=3000

3. Menjalankan Backend (Server)
Buka terminal baru di VS Code, lalu jalankan perintah berikut:
```Bash
cd Backend
npm install
node server.js
```
Server akan berjalan di: http://localhost:3000

4. Menjalankan Frontend (Client)
Buka terminal kedua (split terminal), lalu jalankan perintah berikut:
```Bash
cd FrontEnd
npm install
npm run dev
```
Aplikasi web akan berjalan di: http://localhost:3000 (atau port yang muncul di terminal Anda).

## Catatan Penggunaan Sensor
Untuk memastikan fitur **Kamera** dan **Lokasi** berjalan dengan baik, harap perhatikan hal-hal berikut:
* **Izin Browser**: Pastikan Anda menekan tombol **Allow** (Izinkan) saat muncul pop-up notifikasi akses kamera dan lokasi di pojok kiri atas browser
* **Keamanan Localhost**: Browser modern memiliki kebijakan keamanan ketat. Jika Anda menjalankan proyek secara lokal tanpa sertifikat HTTPS, pastikan Anda menggunakan **Google Chrome** dan mengaksesnya melalui alamat `http://localhost`, karena Chrome menganggap *localhost* sebagai sumber yang aman
* **Konflik Kamera**: Pastikan tidak ada aplikasi lain (seperti Zoom, Microsoft Teams, atau Google Meet) yang sedang menggunakan kamera Anda secara bersamaan, karena hal ini dapat menyebabkan kegagalan akses pada browser
* **Keakuratan GPS**: Untuk hasil lokasi yang maksimal, disarankan menggunakan koneksi internet yang stabil dan memastikan fitur *Location Services* pada sistem operasi Anda sudah aktif



   
