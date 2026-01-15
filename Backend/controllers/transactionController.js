const { sequelize, BorrowLog, User, Book } = require("../models"); // Pastikan import sequelize instance

// 1. Controller PINJAM (Borrow)
const borrowBook = async (req, res) => {
  try {
    // Ambil data text dari body
    const { email, title, lat, long } = req.body;

    // Ambil path file dari Multer (Pastikan middleware upload udah jalan)
    const proofPath = req.file ? req.file.path : null;

    if (!proofPath) {
      return res.status(400).json({ message: "Foto bukti wajib diupload!" });
    }

    // PANGGIL STORED PROCEDURE PINJAM
    await sequelize.query(
      "CALL sp_BorrowBook(:email, :title, :proof, :lat, :long)",
      {
        replacements: {
          email: email,
          title: title,
          proof: proofPath,
          lat: lat,
          long: long,
        },
      }
    );

    res.status(201).json({
      success: true,
      message: "Berhasil meminjam buku! Stok otomatis berkurang.",
    });
  } catch (error) {
    // Tangkap Error custom dari Database (SIGNAL SQLSTATE)
    res.status(400).json({
      success: false,
      message: "Gagal meminjam",
      error: error.original ? error.original.sqlMessage : error.message,
    });
  }
};

// 2. Controller KEMBALI (Return)
const returnBook = async (req, res) => {
  try {
    const { email, title, lat, long } = req.body;

    // Ambil file bukti pengembalian (Foto kondisi buku pas balik)
    const returnProofPath = req.file ? req.file.path : null;

    if (!returnProofPath) {
      return res
        .status(400)
        .json({ message: "Foto bukti pengembalian wajib diupload!" });
    }

    // PANGGIL STORED PROCEDURE KEMBALI
    await sequelize.query(
      "CALL sp_ReturnBook(:email, :title, :proof, :lat, :long)",
      {
        replacements: {
          email: email,
          title: title,
          proof: returnProofPath,
          lat: lat,
          long: long,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Buku berhasil dikembalikan! Stok otomatis bertambah.",
    });
  } catch (error) {
    console.error("Error Return:", error);

    res.status(400).json({
      success: false,
      message: "Gagal mengembalikan buku",
      error: error.original ? error.original.sqlMessage : error.message,
    });
  }
};

const getAllTransactions = async (req, res) => {    try {
      const transactions = await BorrowLog.findAll({
        // JOIN ke tabel User dan Book agar data lengkap
        include: [
          {
            model: User,
            as: 'User', // Harus sesuai dengan alias di models/index.js
            attributes: ['id', 'name', 'email', 'nim'] // Ambil kolom penting saja
          },
          {
            model: Book,
            as: 'Book', // Harus sesuai dengan alias di models/index.js
            attributes: ['id', 'judul', 'pengarang']
          }
        ],
        order: [['createdAt', 'DESC']] // Data terbaru di atas
      });

      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error Get All:", error);
      res.status(500).json({
        message: "Gagal mengambil data laporan transaksi",
        error: error.message
      });
    }
};

module.exports = { borrowBook, returnBook, getAllTransactions };