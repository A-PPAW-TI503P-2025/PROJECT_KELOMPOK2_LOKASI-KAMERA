'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    judul: DataTypes.STRING,
    pengarang: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  return Book;
};