const { BookLoan, Book } = require("../models");

module.exports = {
  async borrow(req, res) {
    const { userId, bookId } = req.body;

    await BookLoan.create({
      userId,
      bookId,
      loanDate: new Date(),
      status: "Dipinjam"
    });

    res.json({ message: "Berhasil meminjam buku!" });
  }
};
