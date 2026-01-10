const { Book } = require("../models");

module.exports = {
  async getAll(req, res) {
    const books = await Book.findAll();
    res.json(books);
  },

  async add(req, res) {
    const { title, author, year, stock } = req.body;
    const newBook = await Book.create({ title, author, year, stock });
    res.json(newBook);
  }
};
