const {Sequelize} = require("sequelize");
const Order = require("../models/order");

exports.orders_get_all = (req, res, next) => {
  Order.findAll()
    .then(docs => {
      if (docs.length == 0) {
        res.status(404).json({
          message: 'No entries found'
         });
      } 
      else {
        
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            emailuser: doc.dataValues.emailuser,
            iduser: doc.dataValues.iduser,
            cartTitoli: doc.dataValues.cartTitoli,
            cartQuantita: doc.dataValues.cartQuantita,
            emailassistente: doc.dataValues.emailassistente,
            stato: doc.dataValues.stato,
            rifiuti: doc.dataValues.rifiuti,
            indirizzo: doc.dataValues.indirizzo,
            id: doc.dataValues.id,
            request: {
              type: "GET",
              url: "https://localhost:3000/orders/" + doc.id
            }
          };
        })
      });
    }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  
};



exports.orders_get_order = (req, res, next) => {
  Order.findByPk(req.params.orderId)
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found for provided ID"
        });
      }
      res.status(200).json({
        order: order.dataValues,
        request: {
          type: "GET",
          url: "https://localhost:3000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
