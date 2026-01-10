create database IF NOT EXISTS PerpustakaanDB_PAW;
use PerpustakaanDB_PAW;

-- 1. TABEL USERS
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim CHAR(11) UNIQUE,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('mahasiswa', 'admin') DEFAULT 'mahasiswa',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_nim_format CHECK (nim REGEXP '^[0-9]+$'),      -- NIM wajib angka
    CONSTRAINT chk_nim_len CHECK (LENGTH(nim) = 11),              -- NIM wajib 11 digit
    
    CONSTRAINT chk_nama_valid CHECK (nama REGEXP '^[a-zA-Z ]+$' AND LENGTH(nama) >= 5),

    CONSTRAINT chk_email_umy CHECK (email LIKE '%@mail.umy.ac.id')
);

-- 2. TABEL BOOKS
CREATE TABLE Books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    publisher VARCHAR(100),
    year INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    cover_image VARCHAR(255),
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_title_min CHECK (LENGTH(title) >= 5),     
    CONSTRAINT chk_author_min CHECK (LENGTH(author) >= 3),   
    
    CONSTRAINT chk_publisher_min CHECK (publisher IS NULL OR LENGTH(publisher) >= 3),

    CONSTRAINT chk_stock_positive CHECK (stock >= 0),        
    CONSTRAINT chk_year_valid CHECK (year >= 1900 AND year <= 2100) 
);

-- 3. TABEL TRANSACTIONS (Setting ON DELETE SET NULL)
CREATE TABLE Transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- PERHATIAN: Hapus 'NOT NULL' agar bisa diset NULL saat user/buku dihapus
    user_id INT, 
    book_id INT, 
    
    borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    return_date DATETIME,
    borrow_proof VARCHAR(255) NOT NULL,
    return_proof VARCHAR(255),
    lat DECIMAL(10, 8),
    `long` DECIMAL(11, 8),
    status ENUM('dipinjam', 'dikembalikan') DEFAULT 'dipinjam',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- RELASI (ON DELETE SET NULL)
    -- Jika User dihapus, user_id di transaksi jadi NULL (History aman)
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL,
    
    -- Jika Buku dihapus, book_id di transaksi jadi NULL
    FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE SET NULL
);