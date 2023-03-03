const {Sequelize} = require("sequelize");
const User = require("../models/user");

exports.users_get_all = (req, res, next) => {
  User.findAll()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            email: doc.dataValues.email,
            name: doc.dataValues.name,
            surname: doc.dataValues.surname,
            citta: doc.dataValues.citta,
            long: doc.dataValues.long,
            lat: doc.dataValues.lat,
            role:  doc.dataValues.role,
            indirizzo:  doc.dataValues.indirizzo,
            request: {
              type: "GET",
              url: "https://localhost:3000/users/list/" + doc.id
            }
          };
        })
      };
    if (docs.length >= 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json({
     message: 'No entries found'
    });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.users_get_user = (req, res, next) => {
  const id = req.params.userId;
  User.findByPk(id)
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        var ris=doc.dataValues;
        ris.password="private!"
        res.status(200).json({
          user: ris,
          request: {
            type: "GET",
            url: "https://localhost:3000/users/list"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
