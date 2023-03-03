var { Sequelize } = require('sequelize');
var sequelize=require('../config/connection');
var bcrypt = require('bcrypt-nodejs');

var userSchema = sequelize.define('user',{
    email: {type: Sequelize.STRING, allowNull: false},
    password: {type: Sequelize.STRING, allowNull: false},
    name: {type: Sequelize.STRING, allowNull: false},
    surname: {type: Sequelize.STRING, allowNull: false},
    citta: {type: Sequelize.STRING},
    long: {type: Sequelize.NUMBER},
    lat: {type: Sequelize.NUMBER},
    role:  {type: Sequelize.STRING},
    indirizzo:  {type: Sequelize.STRING},
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
});

userSchema.prototype.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
}
userSchema.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);  
}

module.exports = sequelize.models.user;
