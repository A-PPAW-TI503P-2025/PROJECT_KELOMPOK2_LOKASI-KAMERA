'use strict';
module.exports = (sequelize, DataTypes) => {
    const BookLoan = sequelize.define('BookLoan', {
        userId: DataTypes.INTEGER,
        bookId: DataTypes.INTEGER,
        loanDate: DataTypes.DATE,
        status: DataTypes.STRING
    }, {
        tableName: 'bookloans' // Ensure mapping to existing table
    });
    return BookLoan;
};
