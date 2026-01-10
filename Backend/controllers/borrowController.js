const { Book, BorrowLog } = require("../models");

// PINJAM BUKU
exports.pinjamBuku = async (req, res) => {
  const { userId, bookId } = req.body;

  const buku = await Book.findByPk(bookId);
  if (!buku) return res.status(404).json({ message: "Buku tidak ditemukan" });

  if (buku.status === "dipinjam")
    return res.status(400).json({ message: "Buku sudah dipinjam orang lain" });

  // Update status buku
  buku.status = "dipinjam";
  await buku.save();

  // Tambahkan log
  const log = await BorrowLog.create({
    userId,
    bookId,
    tanggalPinjam: new Date()
  });

  res.json({ message: "Berhasil meminjam buku", log });
};


// KEMBALIKAN BUKU
exports.kembalikanBuku = async (req, res) => {
  const { bookId } = req.body;

  const buku = await Book.findByPk(bookId);
  if (!buku) return res.status(404).json({ message: "Buku tidak ditemukan" });

  if (buku.status === "tersedia")
    return res.status(400).json({ message: "Buku ini belum dipinjam" });

  // Update status buku
  buku.status = "tersedia";
  await buku.save();

  // Update log terakhir
  const log = await BorrowLog.findOne({
    where: { bookId, tanggalKembali: null }
  });

  if (log) {
    log.tanggalKembali = new Date();
    await log.save();
  }

  res.json({ message: "Berhasil mengembalikan buku", buku });
};
