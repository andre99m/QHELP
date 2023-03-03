var { Sequelize } = require('sequelize');
var sequelize=require('../config/connection');

var schema = sequelize.define('message',{
    message: {type: Sequelize.STRING , allowNull:false},
    from: {type: Sequelize.STRING , allowNull:false},
    to: {type: Sequelize.STRING , allowNull:false},
});

module.exports = sequelize.models.message;