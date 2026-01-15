const { Book } = require("../models");

module.exports = {
  async getAll(req, res) {
    try {
      const books = await Book.findAll();
      res.json(books);
    } catch (err) {
      console.error("Error fetching books:", err);
      res.status(500).json({ message: "Gagal mengambil data buku", error: err.message });
    }
  },

  async add(req, res) {
    try {
      const { judul, pengarang, status } = req.body;
      const newBook = await Book.create({ judul, pengarang, status });
      res.json(newBook);
    } catch (err) {
      console.error("Error adding book:", err);
      res.status(500).json({ message: "Gagal menambah buku", error: err.message });
    }
  }
};
