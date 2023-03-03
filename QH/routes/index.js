var express = require('express');
const cart = require('../models/cart');
var User = require('../models/user');
var router = express.Router();
var Cart = require('../models/cart');
var Order = require('../models/order');
var Product = require('../models/product');
const {Sequelize, Op} = require('sequelize');
const { isLoggedIn } = require('../config/isLoggedIn');
const { authRole } = require('../config/authRole');
var {sendMail}= require('../config/sendMail');


router.get('/', function (req, res, next) {
  User.findAll({where: {'role': 'assistente'}}).then(users => {
    var person=[];
    for(var i=0; i<users.length; i++){
      person.push({
        longitudine: users[i].dataValues.long,
        latitudine: users[i].dataValues.lat
      });
    }
    console.log(person);
    res.render('index', {person: person, longitudine: 12.8242, latitudine: 41.4841});
  })});

router.get('/eshop', isLoggedIn, authRole('assistito'), function (req, res, next) {
  
  Product.findAll()
  .then(docs => {
    var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize) {
          productChunks.push(docs.slice(i, i + chunkSize));
      }
      User.findAll({where: {'role': 'assistente', 'citta': req.user.dataValues.citta}}).then(users => {
        var person=[];
        for(var i=0; i<users.length; i++){
          person.push({
            longitudine: users[i].dataValues.long,
            latitudine: users[i].dataValues.lat
          });
        }
        
        res.render('shop/index', {title: 'Shopping Cart', products: productChunks, longitudine: req.user.dataValues.long, latitudine: req.user.dataValues.lat, person: person});
      })})});


router.get('/add-to-cart/:id', isLoggedIn, authRole('assistito'), function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findByPk(productId).then((product) => {
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/eshop');
  })
    .catch((err) => {
      return res.redirect('/');
    });
});

router.get('/reduce/:id', isLoggedIn, authRole('assistito'), function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');

});

router.get('/remove/:id', isLoggedIn, authRole('assistito'), function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', isLoggedIn, authRole('assistito'), function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray() });
});

router.get('/checkout', isLoggedIn, authRole('assistito'), function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout');
});

router.get('/end', isLoggedIn, authRole('assistito'), function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
}
var cart = new Cart(req.session.cart);
var emailord=req.user.dataValues.email;
var idord=req.user.dataValues.id;
listitems=cart.generateArray();
var titoli=[];
var quantita=[];
var htmlstring="<h1>Lista Acquisti:</h1><ul>";

for(var i=0; i<listitems.length;i++){
  titoli.push(listitems[i].item.title);
  htmlstring+="<li>prodotto: <i>"+listitems[i].item.title+"</i><br>quantità: x"+listitems[i].qty+"</li>";
  quantita.push(listitems[i].qty);
}
htmlstring+="</ul>"
User.findAll({
where: {
  [Op.and]: [
    { role: 'assistente' },
    { citta: req.user.dataValues.citta },
    {[Op.not]: [{email: req.user.dataValues.email}]}
  ]
}
})
.then((users) => {
  if(users){
  var arr=[];
  var calcolo;
  for(var i=0;i<users.length;i++){
    calcolo=Math.abs((parseFloat(users[i].dataValues.long)+parseFloat(users[i].dataValues.lat))-(parseFloat(req.user.long)+parseFloat(req.user.lat)));
      arr.push([users[i].dataValues.email,calcolo]);
  }
  if(arr.length==0){
    res.render('errore');
  }
  else{
  var minimo=arr[0][1];
  var ris=arr[0];
  for(var i=0; i<arr.length; i++){
      if(arr[i][1]<minimo){
          minimo=arr[i][1];
          ris=arr[i];
      }
  }
  Order.create({
    emailuser: emailord,
    iduser: idord,
    cartTitoli: titoli,
    cartQuantita: quantita,
    emailassistente: ris[0],
    stato: 'incoda',
    rifiuti: [],
    indirizzo: req.user.dataValues.indirizzo
  })
  .then(order =>{
  console.log(sendMail(emailord,'Riepilogo Ordini',htmlstring+"<br><p>Per: "+ris[0]+"<p>"));
  console.log(sendMail(ris[0],'Nuova Richiesta',htmlstring+"<br><p>Da: "+emailord+"<p>"+"<br>Indirizzo<p>"+req.user.dataValues.indirizzo+"</p>"));
  req.flash('success', 'Successfully bought product!');
  req.session.cart = null;
  res.redirect('/eshop');
  });
  
}
}
});
});


module.exports = router;


