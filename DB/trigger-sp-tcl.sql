-- TRIGGERS

DELIMITER $$

-- 1. TRIGGER PINJAM (Saat Insert Transaksi -> Stok Berkurang)
CREATE TRIGGER trg_stock_minus
AFTER INSERT ON Transactions
FOR EACH ROW
BEGIN
    UPDATE Books 
    SET stock = stock - 1 
    WHERE id = NEW.book_id;
END$$

-- 2. TRIGGER KEMBALI (Saat Update Status jadi 'dikembalikan' -> Stok Bertambah)
CREATE TRIGGER trg_stock_plus
AFTER UPDATE ON Transactions
FOR EACH ROW
BEGIN
    -- Cek: Hanya nambah stok kalau status berubah dari 'dipinjam' ke 'dikembalikan'
    IF OLD.status = 'dipinjam' AND NEW.status = 'dikembalikan' THEN
        UPDATE Books 
        SET stock = stock + 1 
        WHERE id = NEW.book_id;
    END IF;
END$$

DELIMITER ;

-- store procedure
-- LAPORAN ADMIN
DELIMITER $$

CREATE PROCEDURE sp_GetAdminReport()
BEGIN
    SELECT 
        t.id AS 'ID Transaksi',
        u.nama AS 'Peminjam',
        u.email AS 'Email UMY',
        b.title AS 'Judul Buku',
        t.borrow_date AS 'Tanggal Pinjam',
        t.return_date AS 'Tanggal Kembali',
        t.status AS 'Status',
        
        -- Opsional: Menampilkan bukti foto di laporan
        t.borrow_proof AS 'Bukti Pinjam'
    FROM Transactions t
    JOIN Users u ON t.user_id = u.id
    JOIN Books b ON t.book_id = b.id
    ORDER BY t.borrow_date DESC; -- Yang terbaru paling atas
END$$

DELIMITER ;

-- nanti panggil di backend pake: CALL sp_GetAdminReport();

-- input peminjaman
DELIMITER $$

CREATE PROCEDURE sp_BorrowBook(
    IN p_email VARCHAR(100),    -- Input Email (bukan ID)
    IN p_title VARCHAR(255),    -- Input Judul Buku (bukan ID)
    IN p_proof VARCHAR(255),    -- URL Foto Bukti
    IN p_lat DECIMAL(10,8),
    IN p_long DECIMAL(11,8)
)
BEGIN
    -- Variabel buat nyimpen ID hasil pencarian
    DECLARE v_user_id INT;
    DECLARE v_book_id INT;
    DECLARE v_stock INT;

    -- Error Handler (Kalau ada error, batalkan semua/ROLLBACK)
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL; -- Tampilkan pesan error ke user
    END;

    -- MULAI TRANSAKSI (TCL)
    START TRANSACTION;

    -- 1. Cari ID User berdasarkan Email
    SELECT id INTO v_user_id FROM Users WHERE email = p_email LIMIT 1;
    
    -- 2. Cari ID Buku & Stok berdasarkan Judul
    SELECT id, stock INTO v_book_id, v_stock FROM Books WHERE title = p_title LIMIT 1;

    -- 3. Validasi: User & Buku Ketemu gak?
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Email user tidak ditemukan!';
    ELSEIF v_book_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Buku tidak ditemukan!';
    ELSEIF v_stock <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Stok buku habis!';
    ELSE
        -- 4. Kalau semua aman, INSERT Transaksi
        INSERT INTO Transactions (user_id, book_id, borrow_proof, lat, `long`, status)
        VALUES (v_user_id, v_book_id, p_proof, p_lat, p_long, 'dipinjam');
        
        -- (Stok akan otomatis berkurang -1 berkat TRIGGER di atas)
        
        -- 5. SIMPAN PERMANEN
        COMMIT;
    END IF;

END$$

DELIMITER ;

-- input pengembalian
DELIMITER $$

CREATE PROCEDURE sp_ReturnBook(
    IN p_email VARCHAR(100),    -- Input Email Peminjam
    IN p_title VARCHAR(255),    -- Input Judul Buku
    IN p_return_proof VARCHAR(255), -- Foto Bukti Balikin
    IN p_lat DECIMAL(10,8),     -- Lokasi Pengembalian
    IN p_long DECIMAL(11,8)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_book_id INT;
    DECLARE v_trans_id INT;

    -- Error Handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- 1. Cari ID User & Buku
    SELECT id INTO v_user_id FROM Users WHERE email = p_email LIMIT 1;
    SELECT id INTO v_book_id FROM Books WHERE title = p_title LIMIT 1;

    -- 2. Cek Validasi: User/Buku ada gak?
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Email user tidak ditemukan!';
    ELSEIF v_book_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Buku tidak ditemukan!';
    ELSE
        -- 3. Cari Transaksi yang statusnya MASIH 'dipinjam'
        -- (Kita cari ID transaksinya buat di-update)
        SELECT id INTO v_trans_id 
        FROM Transactions 
        WHERE user_id = v_user_id 
          AND book_id = v_book_id 
          AND status = 'dipinjam' 
        LIMIT 1;

        -- 4. Validasi: Ada gak barang yang lagi dipinjam sama dia?
        IF v_trans_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: User ini tidak sedang meminjam buku tersebut!';
        ELSE
            -- 5. UPDATE Transaksi (Proses Pengembalian)
            UPDATE Transactions
            SET 
                return_date = NOW(),
                return_proof = p_return_proof,
                lat = p_lat,
                `long` = p_long,
                status = 'dikembalikan' -- Ini akan memicu TRIGGER trg_stock_plus
            WHERE id = v_trans_id;

            COMMIT;
        END IF;
    END IF;

END$$

DELIMITER ;

