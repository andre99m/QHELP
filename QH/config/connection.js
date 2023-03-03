var { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.CONNECTION_URL)
module.exports = sequelize;
