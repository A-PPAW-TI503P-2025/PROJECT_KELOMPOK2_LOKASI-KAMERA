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

  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const { title, author, year, category, stock } = req.body;

      await db.execute(
        "UPDATE Books SET title=?, author=?, year=?, category=?, stock=? WHERE id=?",
        [title, author, year, category, stock, id]
      );

      res.json({ message: "Buku berhasil diupdate" });
    } catch (err) {
      res.status(500).json({ message: "Gagal update buku", error: err.message });
    }
  },

  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      await db.execute("DELETE FROM Books WHERE id=?", [id]);
      res.json({ message: "Buku berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ message: "Gagal hapus buku", error: err.message });
    }
  },
};