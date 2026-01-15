const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('PerpustakaanDB_PAW', 'root', 'Coldplayers06', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3308,  // ganti 3307 kalau MySQL-mu di 3307
  logging: false
});

module.exports = sequelize;
