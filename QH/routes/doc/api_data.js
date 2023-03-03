define({ "api": [
  {
    "type": "get",
    "url": "/orders",
    "title": "Get All Orders informations",
    "name": "GetAllOrders",
    "group": "Orders",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>of all orders</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTPS/1.1 200 OK\n    {\n   \"count\": 1,\n   \"orders\": [\n       {\n          \"emailuser\":\"mason.1862553@studenti.uniroma1.it\",\n          \"iduser\":\"17\",\n          \"cartTitoli\":[\"Mastro Lindo Lavapavimenti\"],\n          \"cartQuantita\":[\"1\"],\n          \"emailassistente\":\"nessuno\",\n          \"stato\":\"cancellata\",\n          \"rifiuti\":[\"mason.andre99@gmail.com\"],\n          \"indirizzo\":\"Via Moscarello, 24\",\n          \"id\":12,\n          \"request\":{\n              \"type\":\"GET\",\n              \"url\":\"https://localhost:3000/orders/12\"\n           }\n       \n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "No",
            "description": "<p>entries found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTPS/1.1 404 Not Found\n{\n  \"message\": \"No entries found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./orders.js",
    "groupTitle": "Orders",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/orders"
      }
    ]
  },
  {
    "type": "get",
    "url": "/orders/:id",
    "title": "Get order information",
    "name": "GetOneOrder",
    "group": "Orders",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Order unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>of one order</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTPS/1.1 200 OK\n{\n    \"order\":{\n        \"id\":12,\n        \"emailuser\":\"mason.1862553@studenti.uniroma1.it\",\n        \"iduser\":\"17\",\n        \"cartTitoli\":[\"Mastro Lindo Lavapavimenti\"],\n        \"cartQuantita\":[\"1\"],\n        \"emailassistente\":\"nessuno\",\n        \"stato\":\"cancellata\",\n        \"rifiuti\":[\"mason.andre99@gmail.com\"],\n        \"indirizzo\":\"Via Moscarello, 24\",\n        \"createdAt\":\"2021-05-24\",\n        \"updatedAt\":\"2021-05-24\"},\n        \"request\":{\n            \"type\":\"GET\",\n            \"url\":\"https://localhost:3000/orders\"\n        }\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Order",
            "description": "<p>not found for provided ID: <code>id</code></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTPS/1.1 404 Not Found\n    { \n         message: \"Order not found for provided ID\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./orders.js",
    "groupTitle": "Orders",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/orders/:id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/products",
    "title": "Get All Products informations",
    "name": "GetAllProducts",
    "group": "Products",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>of all products</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTPS/1.1 200 OK\n    {\n   \"count\": 1,\n   \"products\": [\n       {\n          \"imagePath\":\"https://www.ilmiostore.eu/wp-content/uploads/2020/07/felceazzurra-bagnoschiuma-orchidea-nera.jpg\",\n          \"title\":\"Bagnoschiuma Felce Azzurra\",\n          \"description\":\"Bagnoschiuma al profumo di Orchidea Nera 650ml\",\n          \"id\":6,\n          \"category\":\n          \"Bagno\",\n          \"request\":{\n              \"type\":\"GET\",\n              \"url\":\"https://localhost:3000/products/6\"\n           }\n       }\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "No",
            "description": "<p>entries found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTPS/1.1 404 Not Found\n{\n  \"message\": \"No entries found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./products.js",
    "groupTitle": "Products",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/products"
      }
    ]
  },
  {
    "type": "get",
    "url": "/products/:id",
    "title": "Get User information",
    "name": "GetOneProduct",
    "group": "Products",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Products unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>of one product</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTPS/1.1 200 OK\n    {\n         \"product\": {\n             \"id\":7,\n                \"imagePath\":\"https://d2f5fuie6vdmie.cloudfront.net/asset/ita/2020/25/bc50e472df83542ef4bcc48d62536d0c0014cd78.jpeg\",\n                \"title\":\"Tortiglioni Barilla\",\n                \"description\":\"Tortiglioni Integrali 500g\",\n                \"category\":\"Alimentari\",\n                \"createdAt\":\"2021-04-27\",\n                \"updatedAt\":\"2021-04-27\"\n            },\n                \"request\":{\n                    \"type\":\"GET\",\n                    \"url\":\"https://localhost:3000/products\"\n                }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "No",
            "description": "<p>valid entry found for provided id: <code>id</code></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTPS/1.1 404 Not Found\n    { \n         message: \"No valid entry found for provided ID\" \n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./products.js",
    "groupTitle": "Products",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/products/:id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/user/list",
    "title": "Get All Users information",
    "name": "GetAllUsers",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>of all users</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTPS/1.1 200 OK\n    {\n   \"count\": 1,\n   \"users\": [\n       {\n           \"email\": \"mason.andre99@gmail.com\",\n           \"name\": \"Andrea\",\n           \"surname\": \"Mason\",\n           \"citta\": \"Cisterna di Latina\",\n           \"long\": 12.8242,\n           \"lat\": 41.4841,\n           \"role\": \"assistente\",\n           \"indirizzo\": \"Via Moscarello, 24\",\n           \"request\": {\n               \"type\": \"GET\",\n               \"url\": \"https://localhost:3000/users/list/12\"\n           }\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "No",
            "description": "<p>entries found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTPS/1.1 404 Not Found\n{\n  \"message\": \"No entries found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/user/list"
      }
    ]
  },
  {
    "type": "get",
    "url": "/user/list/:id",
    "title": "Get User information",
    "name": "GetOneUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>of one user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTPS/1.1 200 OK\n    {\n         \"user\": {\n             \"id\":12,\n             \"email\":\"mason.andre99@gmail.com\",\n             \"password\":\"private!\",\n             \"name\":\"Andrea\",\n             \"surname\":\"Mason\",\n             \"citta\":\"Cisterna di Latina\",\n             \"long\":12.8242,\n             \"lat\":41.4841,\n             \"role\":\"assistente\",\n             \"indirizzo\":\"Via Moscarello, 24\",\n             \"createdAt\":\"2021-05-22\",\n             \"updatedAt\":\"2021-05-22\"},\n             \n          },\n         \"request\":{\n                 \"type\":\"GET\",\n                 \"url\":\"https://localhost:3000/users/list\"\n                 }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "No",
            "description": "<p>valid entry found for provided id: <code>id</code></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTPS/1.1 404 Not Found\n    { \n         message: \"No valid entry found for provided ID\" \n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/user/list/:id"
      }
    ]
  }
] });
