const db = require("../config/db");

module.exports = {
  async borrowBook(req, res) {
    try {
      const { email, title, lat, long } = req.body;
      const proofPath = req.file ? req.file.path : null; // Dari Multer

      if (!proofPath)
        return res.status(400).json({ message: "Foto bukti wajib!" });

      await db.execute("CALL sp_BorrowBook(?, ?, ?, ?, ?)", [
        email,
        title,
        proofPath,
        lat,
        long,
      ]);

      res.json({ message: "Berhasil meminjam buku! Stok berkurang." });
    } catch (err) {
      res.status(400).json({ message: "Gagal meminjam", error: err.message });
    }
  },

  async returnBook(req, res) {
    try {
      const { email, title, lat, long } = req.body;
      const proofPath = req.file ? req.file.path : null;

      if (!proofPath)
        return res.status(400).json({ message: "Foto bukti wajib!" });

      await db.execute("CALL sp_ReturnBook(?, ?, ?, ?, ?)", [
        email,
        title,
        proofPath,
        lat,
        long,
      ]);

      res.json({ message: "Buku berhasil dikembalikan! Stok bertambah." });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Gagal mengembalikan", error: err.message });
    }
  },

  
  async getAllHistory(req, res) {
    try {
      const [rows] = await db.execute(`
        SELECT t.*, u.nama AS peminjam, b.title AS judul_buku 
        FROM Transactions t
        JOIN Users u ON t.user_id = u.id
        JOIN Books b ON t.book_id = b.id
        ORDER BY t.createdAt DESC 
      `);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Gagal ambil data", error: err.message });
    }
  },
};