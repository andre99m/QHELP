var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
require('../config/passport-facebook');
require('../config/passport-google');
var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user');
var Message = require('../models/message');
var request = require('request');
const { route } = require('.');
const { isLoggedIn } = require('../config/isLoggedIn');
const { authRole } = require('../config/authRole');
var { sendMail } = require('../config/sendMail');
var { Sequelize, Op } = require('sequelize');
var UserController = require('../controller/users');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');


/**
 * @api {get} /user/list Get All Users information
 * @apiName GetAllUsers
 * @apiGroup User
 *
 * @apiSuccess {JSON} data of all users
 *
 * @apiSuccessExample Success-Response:
 *     HTTPS/1.1 200 OK
 *      {
    "count": 1,
    "users": [
        {
            "email": "mason.andre99@gmail.com",
            "name": "Andrea",
            "surname": "Mason",
            "citta": "Cisterna di Latina",
            "long": 12.8242,
            "lat": 41.4841,
            "role": "assistente",
            "indirizzo": "Via Moscarello, 24",
            "request": {
                "type": "GET",
                "url": "https://localhost:3000/users/list/12"
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
router.get("/list", UserController.users_get_all);
/**
 * @api {get} /user/list/:id Get User information
 * @apiName GetOneUser
 * @apiGroup User
 * 
 *
 * @apiParam {Number} id Users unique ID.
 *
 *
 * @apiSuccess {JSON} data of one user
 *
 * @apiSuccessExample Success-Response:
 *     HTTPS/1.1 200 OK
 *     {
 *          "user": {
 *              "id":12,
 *              "email":"mason.andre99@gmail.com",
 *              "password":"private!",
 *              "name":"Andrea",
 *              "surname":"Mason",
 *              "citta":"Cisterna di Latina",
 *              "long":12.8242,
 *              "lat":41.4841,
 *              "role":"assistente",
 *              "indirizzo":"Via Moscarello, 24",
 *              "createdAt":"2021-05-22",
 *              "updatedAt":"2021-05-22"},
 *              
 *           },
 *          "request":{
 *                  "type":"GET",
 *                  "url":"https://localhost:3000/users/list"
 *                  }
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
router.get("/list/:userId", UserController.users_get_user);




var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/select', isLoggedIn, function (req, res, next) {
    if (!req.user.dataValues.role) res.render("../views/user/selectrole", { errori: false, csrfToken: req.csrfToken() });
    else res.redirect('/user/profile');
})



router.post('/select', isLoggedIn, function (req, res, next) {
    if (!req.user.dataValues.role) {
        var options = {
            url: "https://maps.googleapis.com/maps/api/geocode/json?address=+" + req.body.indirizzo_via + "+" + req.body.indirizzo_citta + "+" + req.body.indirizzo_numero + ",%20,+IT&key=" + process.env.MAP_KEY
        }
        function callback(error, responde, body) {
            var info = JSON.parse(body);
            console.log(info);
            if (!error && responde.statusCode == 200 && info.results.length != 0) {
                var role = req.body.role;
                var citta = info.results[0].address_components[3].long_name;
                var indirizzo = info.results[0].address_components[1].long_name + ", " + info.results[0].address_components[0].long_name;
                var long = info.results[0].geometry.location.lng;
                var lat = info.results[0].geometry.location.lat;
                User.update({ 'role': role, 'citta': citta, 'lat': lat, 'long': long, 'indirizzo': indirizzo }, { where: { 'id': req.user.id } });
                res.redirect("/user/profile");
            }
            else if (error) {
                res.render("../views/user/selectrole", { errori: true, errore: 'Nessuna città trovata, inserisci di nuovo', csrfToken: req.csrfToken() });
            }
            else if (responde.statusCode != 200) {
                res.render("../views/user/selectrole", { errori: true, errore: 'Nessuna città trovata, inserisci di nuovo', csrfToken: req.csrfToken() });
            }
            else if (info.results.length == 0) {
                res.render("../views/user/selectrole", { errori: true, errore: 'Nessuna città trovata, inserisci di nuovo', csrfToken: req.csrfToken() });
            }
        }
        request.get(options, callback);
    }
    else res.redirect("/user/profile");
});


router.get('/profile', isLoggedIn, function (req, res, next) {
    var role = req.user.dataValues.role;
    if (!role) res.redirect("/user/select");
    else if (role == 'assistente') {
        Order.findAll({ where: { emailassistente: req.user.dataValues.email }, order: [['id', 'DESC']] })
            .then(docs => {
                var gmail=0;
                if (/@gmail\.com$/.test(req.user.dataValues.email)) var gmail=1;
                var orders = [];
                var ris;
                for (var i = 0; i < docs.length; i++) {
                    ris =
                    {
                        elements: [],
                        date: '',
                        from: '',
                        to: '',
                        id: 0,
                        stato: '',
                        indirizzo: "",
                        isGmail: gmail==1
                    }
                    for (var j = 0; j < docs[i].dataValues.cartTitoli.length; j++) {
                        ris.elements.push([docs[i].dataValues.cartTitoli[j], docs[i].dataValues.cartQuantita[j]]);
                    }
                    ris.date = docs[i].dataValues.createdAt;
                    ris.from = docs[i].dataValues.emailuser;
                    ris.to = docs[i].dataValues.emailassistente;
                    ris.id = docs[i].dataValues.id;
                    ris.stato = docs[i].dataValues.stato;
                    ris.indirizzo = docs[i].dataValues.indirizzo;
                    orders.push(ris);
                }
                var completate = 0;
                var incoda = 0;
                var accettate = 0;
                for (var j = 0; j < orders.length; j++) {
                    if (orders[j].stato == "accettato") accettate += 1;
                    if (orders[j].stato == "incoda") incoda += 1;
                    if (orders[j].stato == "completato") completate += 1;
                }
                Message.findAll({where: {to: req.user.dataValues.email}, order: [['createdAt', 'DESC']] }).then(result=>{
                    
                    var messages=[];
                    for (var j = 0; j < result.length; j++) {
                        messages.push({
                            messaggio: result[j].dataValues.message,
                            data: result[j].dataValues.createdAt,
                            from: result[j].dataValues.from,
                            to: result[j].dataValues.to
                        });
                    }
                    console.log(messages);
                    res.render('user/profile_assistente',
                    {
                        orders: orders,
                        vuoto: orders.length == 0,
                        name: req.user.dataValues.name,
                        surname: req.user.dataValues.surname,
                        role: req.user.dataValues.role,
                        email: req.user.dataValues.email,
                        indirizzo: req.user.dataValues.indirizzo + ", " + req.user.dataValues.citta,
                        completate: completate,
                        accettate: accettate,
                        incoda: incoda,
                        messages: messages
                    });
                })
                .catch(err=> console.log(err));
               
            });
    }
    else {
        Order.findAll({ where: { emailuser: req.user.dataValues.email }, order: [['id', 'DESC']] })
            .then(docs => {
                var orders = [];
                var ris;
                for (var i = 0; i < docs.length; i++) {
                    ris =
                    {
                        elements: [],
                        date: '',
                        from: '',
                        to: '',
                        id: 0,
                        stato: '',
                        indirizzo: ''
                    }
                    for (var j = 0; j < docs[i].dataValues.cartTitoli.length; j++) {
                        ris.elements.push([docs[i].dataValues.cartTitoli[j], docs[i].dataValues.cartQuantita[j]]);
                    }
                    ris.date = docs[i].dataValues.createdAt;
                    ris.from = docs[i].dataValues.emailuser;
                    ris.to = docs[i].dataValues.emailassistente;
                    ris.id = docs[i].dataValues.id;
                    ris.stato = docs[i].dataValues.stato;
                    ris.indirizzo = docs[i].dataValues.indirizzo;
                    orders.push(ris);
                }
                var completate = 0;
                var incoda = 0;
                var accettate = 0;
                var rifiutate = 0;
                for (var j = 0; j < orders.length; j++) {
                    if (orders[j].stato == "accettato") accettate += 1;
                    if (orders[j].stato == "incoda") incoda += 1;
                    if (orders[j].stato == "completato") completate += 1;
                    if (orders[j].stato == "cancellata") rifiutate += 1;
                }
                Message.findAll({where: {to: req.user.dataValues.email}, order: [['createdAt', 'DESC']] }).then(result=>{
                    console.log(result);
                    var messages=[];
                    for (var j = 0; j < result.length; j++) {
                        messages.push({
                            messaggio: result[j].dataValues.message,
                            data: result[j].dataValues.createdAt,
                            from: result[j].dataValues.from,
                            to: result[j].dataValues.to
                        });
                    }
                    res.render('user/profile_assistito',
                    {
                        orders: orders,
                        vuoto: orders.length == 0,
                        name: req.user.dataValues.name,
                        surname: req.user.dataValues.surname,
                        role: req.user.dataValues.role,
                        email: req.user.dataValues.email,
                        indirizzo: req.user.dataValues.indirizzo + ", " + req.user.dataValues.citta,
                        completate: completate,
                        accettate: accettate,
                        incoda: incoda,
                        rifiutate: rifiutate,
                        messages: messages
                    });
                })
                .catch(err=> console.log(err));
                
            });
    }



});
router.get('/accept/:id', isLoggedIn, authRole('assistente'), function (req, res, next) {
    Order.findByPk(req.params.id).then((order) => {
        var status = order.dataValues.stato;
        var mail = order.dataValues.emailassistente;
        if (status == "incoda" && mail == req.user.email) {
            Order.update({ 'stato': 'accettato' }, {
                where: {
                    'id': req.params.id
                }
            });
            Order.findByPk(req.params.id).then((order) => {
                var mail_from = order.dataValues.emailuser;
                var mail_to = order.dataValues.emailassistente;
                var listatitoli = order.dataValues.cartTitoli;
                var listaquantita = order.dataValues.cartQuantita;
                var titoli = [];
                var quantita = [];
                var htmlstring = "<h1>Lista Acquisti:</h1><ul>";
                for (var i = 0; i < listatitoli.length; i++) {
                    titoli.push(listatitoli[i]);
                    htmlstring += "<li>prodotto: <i>" + listatitoli[i] + "</i><br>quantità: x" + listaquantita[i] + "</li>";
                    quantita.push(listaquantita[i]);
                }
                htmlstring += "</ul>"
                htmlstring += "<br><p>Attendi pazientemente l'arrivo del nostro utente " + mail_to + "</p";
                console.log(sendMail(mail_from, 'Ordine Accettato', htmlstring));
            })
            res.redirect('/user/profile');
        }
        else {
            res.redirect('/user/profile');
        }
    })

})


router.get('/decline/:id', isLoggedIn, authRole('assistente'), function (req, res, next) {
    Order.findByPk(req.params.id).then((order) => {
        var status = order.dataValues.stato;
        var mail = order.dataValues.emailassistente;
        if (status == "incoda" && mail == req.user.email) {
            Order.findByPk(req.params.id).then((order) => {
                var mail_from = order.dataValues.emailuser;
                var mail_to = order.dataValues.emailassistente;
                var listatitoli = order.dataValues.cartTitoli;
                var listaquantita = order.dataValues.cartQuantita;
                rifiuti = order.dataValues.rifiuti;
                rifiuti.push(mail_to);
                Order.update({ 'rifiuti': rifiuti }, {
                    where: {
                        'id': req.params.id
                    }
                });
                User.findAll({ where: { email: mail_from } }).then((users) => {
                    var city = users[0].dataValues.citta;
                    var titoli = [];
                    var quantita = [];
                    var htmlstring = "<h1>Lista Acquisti:</h1><ul>";

                    for (var i = 0; i < listatitoli.length; i++) {
                        titoli.push(listatitoli[i]);
                        htmlstring += "<li>prodotto: <i>" + listatitoli[i] + "</i><br>quantità: x" + listaquantita[i] + "</li>";
                        quantita.push(listaquantita[i]);
                    }
                    htmlstring += "</ul>"
                    htmlstring += "<br><p>Ci spiace, sembra che il nostro assistente " + mail_to + " sia troppo impegnato al momento, ma stiamo cercando altri utenti disponibili.</p";

                    console.log(sendMail(mail_from, 'Ordine Rifiutato', htmlstring));
                    var q = [
                        { role: 'assistente' },
                        { citta: city },
                        { [Op.not]: [{ email: mail_from }] },
                    ];
                    for (var i = 0; i < rifiuti.length; i++) {
                        q.push({ [Op.not]: [{ email: rifiuti[i] }] });
                    }

                    User.findAll({
                        where: {
                            [Op.and]: q
                        }
                    })
                        // SELECT * FROM post WHERE authorId = 12 AND status = 'active';

                        .then((users) => {
                            if (users) {
                                var arr = [];
                                var calcolo;
                                for (var i = 0; i < users.length; i++) {
                                    calcolo = Math.abs((parseFloat(users[i].dataValues.long) + parseFloat(users[i].dataValues.lat)) - (parseFloat(req.user.long) + parseFloat(req.user.lat)));
                                    arr.push([users[i].dataValues.email, calcolo]);
                                }
                                if (arr.length == 0) {
                                    Order.update({ 'stato': 'cancellata' }, {
                                        where: {
                                            'id': req.params.id
                                        }
                                    });
                                    Order.update({ 'emailassistente': 'nessuno' }, {
                                        where: {
                                            'id': req.params.id
                                        }
                                    });
                                    res.redirect('/user/profile');
                                }
                                else {
                                    var minimo = arr[0][1];
                                    var ris = arr[0];
                                    for (var i = 0; i < arr.length; i++) {
                                        if (arr[i][1] < minimo) {
                                            minimo = arr[i][1];
                                            ris = arr[i];
                                        }
                                    }
                                    Order.update({ 'emailassistente': ris[0] }, {
                                        where: {
                                            'id': req.params.id
                                        }
                                    });
                                    Order.update({ 'stato': 'incoda' }, {
                                        where: {
                                            'id': req.params.id
                                        }
                                    });




                                    res.redirect('/user/profile');
                                }

                            }
                        });
                })



            })

        }
        else {
            res.redirect('/');
        }
    })
})
router.get('/complete/:id', isLoggedIn, authRole('assistente'), function (req, res, next) {
    Order.findByPk(req.params.id).then((order) => {
        var status = order.dataValues.stato;
        var mail = order.dataValues.emailassistente;
        if (status == "accettato" && mail == req.user.email) {
            Order.update({ 'stato': 'completato' }, {
                where: {
                    'id': req.params.id
                }
            });
            res.redirect('/user/profile');
        }
        else {
            res.redirect("/");
        }
    })
});
router.get('/trash/:id', isLoggedIn, authRole('assistito'), function (req, res, next) {
    Order.findByPk(req.params.id).then((order) => {
        var status = order.dataValues.stato;
        var mail = order.dataValues.emailuser;
        if (status == "incoda" && mail == req.user.email) {
            Order.destroy({
                where: {
                    'id': req.params.id
                }
            });
            res.redirect('/user/profile');
        }
        else {
            res.redirect("/");
        }
    })
});

router.get('/changecity', isLoggedIn, function (req, res, next) {
    if (!req.user.dataValues.role) res.redirect("/user/select");
    else res.render('user/changecity', { csrfToken: req.csrfToken(), err: false });
});
router.get('/changecity/err', isLoggedIn, function (req, res, next) {
    if (!req.user.dataValues.role) res.redirect("/user/select");
    else res.render('user/changecity', { csrfToken: req.csrfToken(), errore: "Abbiamo riscontrato problemi con il cambio indirizzo, riprova", err: true });

});

router.post('/changecity', isLoggedIn, function (req, res, next) {
    if (!req.user.dataValues.role) res.redirect("/user/select");
    else {
        var options = {
            url: "https://maps.googleapis.com/maps/api/geocode/json?address=+" + req.body.indirizzo_via + "+" + req.body.indirizzo_citta + "+" + req.body.indirizzo_numero + ",%20,+IT&key=" + process.env.MAP_KEY
        }
        function callback(error, responde, body) {
            var info = JSON.parse(body);
            if (!error && responde.statusCode == 200 && info.results.length != 0) {
                var citta = info.results[0].address_components[3].long_name;
                var indirizzo = info.results[0].address_components[1].long_name + ", " + info.results[0].address_components[0].long_name;
                var long = info.results[0].geometry.location.lng;
                var lat = info.results[0].geometry.location.lat;
                User.update({ 'citta': citta, 'long': long, 'lat': lat, 'indirizzo': indirizzo }, {
                    where: {
                        'email': req.user.dataValues.email
                    }
                });
                console.log(sendMail(req.user.dataValues.email, 'Modifiche Effettuate', "<h1>Posizione modificata con successo</h1>"));
                res.redirect('/user/profile');
            }
            else if (error) {
                console.log(error);
                res.redirect('/user/changecity/err');
            }
            else if (responde.statusCode != 200) {
                res.redirect('/user/changecity/err');
            }
            else if (info.results.length == 0) {
                res.redirect('/user/changecity/err');
            }
        }
        request.get(options, callback);
    }

});


router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});


router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true,
    successRedirect: '/user/profile'
}));

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true,
    successRedirect: '/user/profile'
}));


router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'user_location'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: 'user/signin' }), function (req, res) {
    res.redirect('/user/select');
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
    console.log(scope);
});
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/user/signin' }), (req, res) => {
    res.redirect('/user/select');
});


module.exports = router;
function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}