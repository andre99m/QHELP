var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var { Sequelize } = require('sequelize');
//di base express session salva le sessioni in memoria locale e non andrebbe fatto
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var PgStore = require('connect-pg-simple')(session);
require('dotenv').config();
var routes = require('./routes/index');
var userRoutes = require('./routes/user');
var productRoutes = require("./routes/products");
var orderRoutes = require("./routes/orders");
var eventRoutes= require("./routes/prova");
const { model } = require('./config/connection');
var app = express();
var User = require('./models/user');
var Help = require('./models/message');

//inizio gestione websocket
const WebSocket = require('ws');
const { measureMemory } = require('vm');

const wss = new WebSocket.Server({ port: 9998 });

// var active_connection = null;
var array=[];

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    var mex=message.split("|")[0];
    var from=message.split("|")[1];
    var to=message.split("|")[2];

    if(mex=="l \'altro utente è andato offline :("){
      for(var i=0; i<array.length; i++){
        if(array[i].socket==ws){
          array.splice(i);
        }
      }
      
    }
    else{

    var vero=false;
    for(var i=0; i<array.length; i++){
      if(array[i].from==from){
        array[i]={socket: ws, from: from, to: to}
        vero=true;
      }
    }
    if(vero==false)array.push({socket: ws, from: from, to: to});
    var online=false;
    for(var i=0; i<array.length; i++){
      if(array[i].from==to){
        array[i].socket.send(mex+"|"+from);
        online=true;
    }
  }
  if(online==false){

    console.log("\n Ecco il to: "+to);
    Help.create({
      from: from, 
      message: mex, 
      to: to
    });
  }
  ws.send('Messaggio inoltrato a '+to);
      console.log("sent");

}
  });
  //active_connection = ws;
  
  //test();
});
//fine gestione web socket
require('./config/passport');
require('./config/passport-facebook');
require('./config/passport-google');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static(__dirname+'/public'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new PgStore({
    conString: process.env.CONNECTION_URL,
    tableName: 'ussessions'
  }),
  cookie: {maxAge: 180 * 60 * 1000}
}));
//la sessione vive per tre ore 
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//variabili globali che modificano le view in base a se sono registrato e alla sessione
app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    if(res.locals.login==true){
      res.locals.assistito = req.user.role=="assistito";
      res.locals.assistente = req.user.role=="assistente";
      User.findByPk(req.session.passport.user).then(ris => {
        res.locals.email=ris.email;
        console.log(res.locals.email);
      });

    }
    else{
      res.locals.assistito = false;
      res.locals.assistente = false;
    }
    next();
});


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET");
    return res.status(200).json({});
  }
  next();
});

//non invertire l'ordine
app.use("/addEvent", eventRoutes);
app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use("/orders", orderRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

