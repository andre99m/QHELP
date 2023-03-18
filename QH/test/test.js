process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs

let chai = require('chai');
let chaiHttp = require('chai-http');
const { truncate } = require('fs');
let should = chai.should();
chai.use(chaiHttp);

var { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    dialect:  'postgres',
    logging: false
});
//definizione degli oggetti nel DB
var schema = sequelize.define('product',{
    imagePath: {type: Sequelize.STRING, allowNull: false},
    title: {type: Sequelize.STRING, allowNull: false},
    description: {type: Sequelize.STRING, allowNull: false},
    category: {type: Sequelize.STRING}
});
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

const Product = sequelize.models.product;
const Order = sequelize.models.order;
const User= sequelize.models.user;
//inizio tests


describe('/GET products', () => {
    it('it should GET all the products and their number', (done) => {
        Product.destroy({
            where: {},
            truncate: true
        }).then(()=>{
            Product.create({ 
                imagePath: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/714z0Rc2QbL._AC_SL1500_.jpg",
                title: "Dixan",
                description: "prodotto bagno",
                category: "Bagno"
            }).then(newprod =>{
                chai.request('https://localhost:3000')
                .get('/products')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count');
                    res.body.should.have.property('products');
                    
                    res.body.products[0].should.have.property('id');
                    res.body.products[0].id.should.be.eql(newprod.dataValues.id);
                    res.body.products[0].should.have.property('imagePath');
                    res.body.products[0].imagePath.should.be.eql(newprod.dataValues.imagePath);
                    res.body.products[0].should.have.property('title');
                    res.body.products[0].title.should.be.eql(newprod.dataValues.title);
                    res.body.products[0].should.have.property('description');
                    res.body.products[0].description.should.be.eql(newprod.dataValues.description);
                    res.body.products[0].should.have.property('category');
                    res.body.products[0].category.should.be.eql(newprod.dataValues.category);
                    Product.destroy({
                        where: {},
                        truncate: true
                    }).then(()=>{
                        Product.create({ 
                            imagePath: "https://www.ilmiostore.eu/wp-content/uploads/2020/07/felceazzurra-bagnoschiuma-orchidea-nera.jpg",
                            title: "Bagnoschiuma Felce Azzurra",
                            description: "Bagnoschiuma al profumo di Orchidea Nera 650ml",
                            category: "Bagno"
                        })
                        Product.create({ 
                            imagePath: "https://d2f5fuie6vdmie.cloudfront.net/asset/ita/2020/25/bc50e472df83542ef4bcc48d62536d0c0014cd78.jpeg",
                            title: "Tortiglioni Barilla",
                            description: "Tortiglioni Integrali 500g",
                            category: "Alimentari"
                        })
                        Product.create({ 
                            imagePath: "https://www.spesasprint.it/img/prodotti/big/69585.jpg?v=2",
                            title: "FarmaMed Cerotti",
                            description: "Cerotti 2 formati 12pz antibatterici",
                            category: "Farmacia"
                        })
                        Product.create({ 
                            imagePath: "https://images-na.ssl-images-amazon.com/images/I/618v%2B7AhNoL._AC_SY879_.jpg",
                            title: "Mastro Lindo Lavapavimenti",
                            description: "Lavapavimenti Liquido Limone 950ml",
                            category: "Pulizia"
                        })
                    })
                 done();
          });
            })
        }
        )
    });
    it('it should GET a product from an ID', (done) => {
        Product.create({ 
            imagePath: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/714z0Rc2QbL._AC_SL1500_.jpg",
            title: "Dixan",
            description: "prodotto bagno",
            category: "Bagno"
        }).then(newprod=>{
              chai.request('https://localhost:3000')
              .get('/products/'+newprod.dataValues.id)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('product');
                res.body.product.should.have.property('id');
                res.body.product.id.should.be.eql(newprod.dataValues.id);
                res.body.product.should.have.property('imagePath');
                res.body.product.imagePath.should.be.eql(newprod.dataValues.imagePath);
                res.body.product.should.have.property('title');
                res.body.product.title.should.be.eql(newprod.dataValues.title);
                res.body.product.should.have.property('description');
                res.body.product.description.should.be.eql(newprod.dataValues.description);
                res.body.product.should.have.property('category');
                res.body.product.category.should.be.eql(newprod.dataValues.category);
                res.body.should.have.property('request');
                Product.destroy({
                    where:{id:newprod.dataValues.id},
                });
                done();
              });
        })
    });
});

describe('/GET users', () => {
    it('it should GET all the users and their number', (done) => {
        User.destroy({
            where: {},
            truncate: true
        }).then(()=>{
            User.create({ 
                email: "qualcheemail",
                password: "qualchepassword",
                name: "qualchenome",
                surname: "qualchecognome",
                citta:"qualchecitta",
                long: 1,
                lat: 1,
                role:  "qualcheruolo",
                indirizzo:  "qualcheindirizzo",
            }).then(newprod =>{
                chai.request('https://localhost:3000/user')
                .get('/list')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count');
                    res.body.should.have.property('users');
                    res.body.users[0].should.have.property('email');
                    res.body.users[0].email.should.be.eql(newprod.dataValues.email);
                    res.body.users[0].should.have.property('name');
                    res.body.users[0].name.should.be.eql(newprod.dataValues.name);
                    res.body.users[0].should.have.property('surname');
                    res.body.users[0].surname.should.be.eql(newprod.dataValues.surname);
                    res.body.users[0].should.have.property('citta');
                    res.body.users[0].citta.should.be.eql(newprod.dataValues.citta);
                    res.body.users[0].should.have.property('long');
                    res.body.users[0].long.should.be.eql(newprod.dataValues.long);
                    res.body.users[0].should.have.property('lat');
                    res.body.users[0].lat.should.be.eql(newprod.dataValues.lat);
                    res.body.users[0].should.have.property('role');
                    res.body.users[0].role.should.be.eql(newprod.dataValues.role);
                    res.body.users[0].should.have.property('indirizzo');
                    res.body.users[0].indirizzo.should.be.eql(newprod.dataValues.indirizzo);
                    User.destroy({
                        where: {},
                        truncate: true
                    })
                 done();
          });
            })
        }
        )
    });
   it('it should GET a user from an ID', (done) => {
        User.create({ 
            email: "qualcheemail",
            password: "qualchepassword",
            name: "qualchenome",
            surname: "qualchecognome",
            citta:"qualchecitta",
            long: 1,
            lat: 1,
            role:  "qualcheruolo",
            indirizzo:  "qualcheindirizzo",
        }).then(newprod=>{
              chai.request('https://localhost:3000/user')
              .get('/list/'+newprod.dataValues.id)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('user');
                res.body.user.should.have.property('id');
                res.body.user.id.should.be.eql(newprod.dataValues.id);
                res.body.user.should.have.property('email');
                res.body.user.email.should.be.eql(newprod.dataValues.email);
                res.body.user.should.have.property('name');
                res.body.user.name.should.be.eql(newprod.dataValues.name);
                res.body.user.should.have.property('surname');
                res.body.user.surname.should.be.eql(newprod.dataValues.surname);
                res.body.user.should.have.property('citta');
                res.body.user.citta.should.be.eql(newprod.dataValues.citta);
                res.body.user.should.have.property('long');
                res.body.user.long.should.be.eql(newprod.dataValues.long);
                res.body.user.should.have.property('lat');
                res.body.user.lat.should.be.eql(newprod.dataValues.lat);
                res.body.user.should.have.property('role');
                res.body.user.role.should.be.eql(newprod.dataValues.role);
                res.body.user.should.have.property('indirizzo');
                res.body.user.indirizzo.should.be.eql(newprod.dataValues.indirizzo);
                res.body.should.have.property('request');
                User.destroy({
                    where:{id:newprod.dataValues.id},
                });
                done();
              });
        })
    });
});


describe('/GET orders', () => {
    it('it should GET all the orders and their number', (done) => {
        Order.destroy({
            where: {},
            truncate: true
        }).then(()=>{
            Order.create({ 
                emailuser: "qualchemail",
                iduser: "222",
                cartTitoli: [],
                cartQuantita: [],
                emailassistente: "qualchealtramail",
                stato: "qualchestato",
                rifiuti: [],
                indirizzo: "qualcheindirizzo"
            }).then(newprod =>{
                chai.request('https://localhost:3000')
                .get('/orders')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count');
                    res.body.should.have.property('orders');
                    res.body.orders[0].should.have.property('emailuser');
                    res.body.orders[0].emailuser.should.be.eql(newprod.dataValues.emailuser);
                    res.body.orders[0].should.have.property('iduser');
                    res.body.orders[0].iduser.should.be.eql(newprod.dataValues.iduser);
                    res.body.orders[0].should.have.property('cartTitoli');
                    res.body.orders[0].cartTitoli.should.be.eql(newprod.dataValues.cartTitoli);
                    res.body.orders[0].should.have.property('cartQuantita');
                    res.body.orders[0].cartQuantita.should.be.eql(newprod.dataValues.cartQuantita);
                    res.body.orders[0].should.have.property('emailassistente');
                    res.body.orders[0].emailassistente.should.be.eql(newprod.dataValues.emailassistente);
                    res.body.orders[0].should.have.property('stato');
                    res.body.orders[0].stato.should.be.eql(newprod.dataValues.stato);
                    res.body.orders[0].should.have.property('rifiuti');
                    res.body.orders[0].rifiuti.should.be.eql(newprod.dataValues.rifiuti);
                    res.body.orders[0].should.have.property('indirizzo');
                    res.body.orders[0].indirizzo.should.be.eql(newprod.dataValues.indirizzo);
                    Order.destroy({
                        where: {},
                        truncate: true
                    })
                 done();
          });
            })
        }
        )
    });
   it('it should GET an order from an ID', (done) => {
    Order.create({ 
        emailuser: "qualchemail",
        iduser: "222",
        cartTitoli: [],
        cartQuantita: [],
        emailassistente: "qualchealtramail",
        stato: "qualchestato",
        rifiuti: [],
        indirizzo: "qualcheindirizzo"
    }).then(newprod=>{
              chai.request('https://localhost:3000')
              .get('/orders/'+newprod.dataValues.id)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('order');
                res.body.order.should.have.property('id');
                res.body.order.id.should.be.eql(newprod.dataValues.id);
                res.body.order.should.have.property('emailuser');
                res.body.order.emailuser.should.be.eql(newprod.dataValues.emailuser);
                res.body.order.should.have.property('iduser');
                res.body.order.iduser.should.be.eql(newprod.dataValues.iduser);
                res.body.order.should.have.property('cartTitoli');
                res.body.order.cartTitoli.should.be.eql(newprod.dataValues.cartTitoli);
                res.body.order.should.have.property('cartQuantita');
                res.body.order.cartQuantita.should.be.eql(newprod.dataValues.cartQuantita);
                res.body.order.should.have.property('emailassistente');
                res.body.order.emailassistente.should.be.eql(newprod.dataValues.emailassistente);
                res.body.order.should.have.property('stato');
                res.body.order.stato.should.be.eql(newprod.dataValues.stato);
                res.body.order.should.have.property('rifiuti');
                res.body.order.rifiuti.should.be.eql(newprod.dataValues.rifiuti);
                res.body.order.should.have.property('indirizzo');
                res.body.order.indirizzo.should.be.eql(newprod.dataValues.indirizzo);
                res.body.should.have.property('request');
                Order.destroy({
                    where:{id:newprod.dataValues.id},
                });
                done();
              });
        })
    });
});








