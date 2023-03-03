const {Sequelize} = require("sequelize");
const Product = require("../models/product");

exports.products_get_all = (req, res, next) => {
  Product.findAll()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            imagePath: doc.dataValues.imagePath,
            title: doc.dataValues.title,
            description: doc.dataValues.description,
            id: doc.dataValues.id,
            category: doc.dataValues.category,
            request: {
              type: "GET",
              url: "https://localhost:3000/products/" + doc.id
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

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findByPk(id)
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc.dataValues,
          request: {
            type: "GET",
            url: "https://localhost:3000/products"
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
