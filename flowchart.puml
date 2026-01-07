```mermaid
flowchart TD
    %% Node Shapes: ([Start/End]), [/Input/Output/], [Process], {Decision}, [(Database)]

    Start([Mulai]) --> Login[/User Login & Masuk Dashboard/]
    Login --> ListBuku[/Pilih Menu Daftar Buku/]
    ListBuku --> PilihBuku[/Pilih Buku yg Mau Dipinjam/]
    
    PilihBuku --> CekStok{Stok Tersedia?}
    
    CekStok -- Tidak --> StokHabis[/Tampilkan: Stok Habis/]
    StokHabis --> ListBuku
    
    CekStok -- Ya --> ReqKamera[Request Izin Kamera]
    
    ReqKamera --> IzinCam{Izin Diberikan?}
    IzinCam -- Tidak --> ErrCam[/Error: Kamera Wajib Aktif/]
    ErrCam --> End([Selesai])
    
    IzinCam -- Ya --> BukaCam[Buka Kamera Viewfinder]
    BukaCam --> Foto[/Ambil Foto Selfie/Bukti/]
    Foto --> KlikPinjam[Klik Tombol Pinjam]
    
    KlikPinjam --> DB_Pinjam[(Simpan Data Peminjaman\n& Upload Foto)]
    DB_Pinjam --> DB_Stok[(Kurangi Stok Buku)]
    
    DB_Stok --> Sukses[/Tampilkan: Peminjaman Berhasil/]
    Sukses --> End
```