module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pengarang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("tersedia", "dipinjam"),
      defaultValue: "tersedia"
    }
  });

  return Book;
};
