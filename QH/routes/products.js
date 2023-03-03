const express = require("express");
const router = express.Router();
const ProductsController = require('../controller/products');
/**
 * @api {get} /products Get All Products informations
 * @apiName GetAllProducts
 * @apiGroup Products
 *
 * @apiSuccess {JSON} data of all products
 *
 * @apiSuccessExample Success-Response:
 *     HTTPS/1.1 200 OK
 *      {
    "count": 1,
    "products": [
        {
           "imagePath":"https://www.ilmiostore.eu/wp-content/uploads/2020/07/felceazzurra-bagnoschiuma-orchidea-nera.jpg",
           "title":"Bagnoschiuma Felce Azzurra",
           "description":"Bagnoschiuma al profumo di Orchidea Nera 650ml",
           "id":6,
           "category":
           "Bagno",
           "request":{
               "type":"GET",
               "url":"https://localhost:3000/products/6"
            }
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
router.get("/", ProductsController.products_get_all);
/**
 * @api {get} /products/:id Get User information
 * @apiName GetOneProduct
 * @apiGroup Products
 * 
 *
 * @apiParam {Number} id Products unique ID.
 *
 *
 * @apiSuccess {JSON} data of one product
 *
 * @apiSuccessExample Success-Response:
 *     HTTPS/1.1 200 OK
 *     {
 *          "product": {
 *              "id":7,
                "imagePath":"https://d2f5fuie6vdmie.cloudfront.net/asset/ita/2020/25/bc50e472df83542ef4bcc48d62536d0c0014cd78.jpeg",
                "title":"Tortiglioni Barilla",
                "description":"Tortiglioni Integrali 500g",
                "category":"Alimentari",
                "createdAt":"2021-04-27",
                "updatedAt":"2021-04-27"
            },
                "request":{
                    "type":"GET",
                    "url":"https://localhost:3000/products"
                }
 * }
 *
 * @apiError No valid entry found for provided id: <code>id</code>
 *
 * @apiErrorExample Error-Response:
 *     HTTPS/1.1 404 Not Found
 *     { 
 *          message: "No valid entry found for provided ID" 
 * }
 */
router.get("/:productId", ProductsController.products_get_product);


module.exports = router;
