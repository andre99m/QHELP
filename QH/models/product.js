var { Sequelize } = require('sequelize');
var sequelize=require('../config/connection');
var schema = sequelize.define('product',{
    imagePath: {type: Sequelize.STRING, allowNull: false},
    title: {type: Sequelize.STRING, allowNull: false},
    description: {type: Sequelize.STRING, allowNull: false},
    category: {type: Sequelize.STRING}
});

module.exports = sequelize.models.product;