const { Sequelize } = require("sequelize");

const db = new Sequelize('perpustakaandb_paw', 'root', 'SandiMySQL24', {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql'
});

module.exports = db;
