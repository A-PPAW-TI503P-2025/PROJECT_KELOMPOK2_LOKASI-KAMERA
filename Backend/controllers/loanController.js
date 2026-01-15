const { BookLoan, Book } = require("../models");

module.exports = {
  async borrow(req, res) {
    try {
      const { userId, bookId } = req.body;

      const newLoan = await BookLoan.create({
        userId,
        bookId,
        loanDate: new Date(),
        status: "Dipinjam"
      });

      res.json({ message: "Berhasil meminjam buku!", data: newLoan });
    } catch (err) {
      console.error("Error borrowing book:", err);
      res.status(500).json({ message: "Gagal meminjam buku", error: err.message });
    }
  }
};
