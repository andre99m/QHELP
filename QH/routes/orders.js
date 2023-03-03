const express = require("express");
const router = express.Router();
const OrdersController = require('../controller/orders');

/**
 * @api {get} /orders Get All Orders informations
 * @apiName GetAllOrders
 * @apiGroup Orders
 *
 * @apiSuccess {JSON} data of all orders
 *
 * @apiSuccessExample Success-Response:
 *     HTTPS/1.1 200 OK
 *      {
    "count": 1,
    "orders": [
        {
           "emailuser":"mason.1862553@studenti.uniroma1.it",
           "iduser":"17",
           "cartTitoli":["Mastro Lindo Lavapavimenti"],
           "cartQuantita":["1"],
           "emailassistente":"nessuno",
           "stato":"cancellata",
           "rifiuti":["mason.andre99@gmail.com"],
           "indirizzo":"Via Moscarello, 24",
           "id":12,
           "request":{
               "type":"GET",
               "url":"https://localhost:3000/orders/12"
            }
        
        }
    ]
 *  }
 *
 * @apiError No entries found
 *
 * @apiErrorExample Error-Response:
 *     HTTPS/1.1 404 Not Found
 *     {
 *       "message": "No entries found"
 *     }
 */
router.get("/", OrdersController.orders_get_all);
/**
 * @api {get} /orders/:id Get order information
 * @apiName GetOneOrder
 * @apiGroup Orders
 * 
 *
 * @apiParam {Number} id Order unique ID.
 *
 *
 * @apiSuccess {JSON} data of one order
 *
 * @apiSuccessExample Success-Response:
 *     HTTPS/1.1 200 OK
 *     {
        "order":{
            "id":12,
            "emailuser":"mason.1862553@studenti.uniroma1.it",
            "iduser":"17",
            "cartTitoli":["Mastro Lindo Lavapavimenti"],
            "cartQuantita":["1"],
            "emailassistente":"nessuno",
            "stato":"cancellata",
            "rifiuti":["mason.andre99@gmail.com"],
            "indirizzo":"Via Moscarello, 24",
            "createdAt":"2021-05-24",
            "updatedAt":"2021-05-24"},
            "request":{
                "type":"GET",
                "url":"https://localhost:3000/orders"
            }
        }
 
 * @apiError Order not found for provided ID: <code>id</code>
 *
 * @apiErrorExample Error-Response:
 *     HTTPS/1.1 404 Not Found
 *     { 
 *          message: "Order not found for provided ID"
 * }
 */
router.get("/:orderId", OrdersController.orders_get_order);


module.exports = router;