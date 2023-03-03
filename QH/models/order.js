var { Sequelize } = require('sequelize');
var sequelize=require('../config/connection');

var schema = sequelize.define('order',{
    emailuser: {type: Sequelize.STRING , allowNull:false},
    iduser: {type: Sequelize.STRING , allowNull:false},
    cartTitoli: {type: Sequelize.ARRAY(Sequelize.STRING), allowNull:false},
    cartQuantita: {type: Sequelize.ARRAY(Sequelize.NUMBER), allowNull:false},
    emailassistente: {type: Sequelize.STRING , allowNull:false},
    stato: {type: Sequelize.STRING},
    rifiuti: {type: Sequelize.ARRAY(Sequelize.STRING)},
    indirizzo: {type: Sequelize.STRING}
});

module.exports = sequelize.models.order;