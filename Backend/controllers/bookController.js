const { Book } = require("../models");

exports.getAllBooks = async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
};

exports.addBook = async (req, res) => {
  const { judul, pengarang } = req.body;

  const newBook = await Book.create({ judul, pengarang });
  res.json({ message: "Buku ditambahkan", newBook });
};
