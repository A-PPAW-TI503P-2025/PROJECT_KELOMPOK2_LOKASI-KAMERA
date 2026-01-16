const db = require("../config/db");

module.exports = {
  async getAll(req, res) {
    try {
      const [books] = await db.execute("SELECT * FROM Books");
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: "Gagal ambil buku", error: err.message });
    }
  },

  async add(req, res) {
    try {
      const { title, author, year, stock, category } = req.body; // Sesuaikan kolom DB
      await db.execute(
        "INSERT INTO Books (title, author, year, stock, category) VALUES (?, ?, ?, ?, ?)",
        [title, author, year, stock, category]
      );
      res.json({ message: "Buku berhasil ditambahkan" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Gagal tambah buku", error: err.message });
    }
  },
};

