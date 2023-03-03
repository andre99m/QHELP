var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findByPk(id).then((user) => {
        done(null, user);
    })
        .catch((err) => {
            done(err, null);
        })
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('password', 'Invalid password').isLength({min:4});
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
           messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({where:{'email': email}}).then((user) => {
        if(user){
            return done(null, false, {message: 'Email is already in use.'});
        }
        else {
            var newUser = User.build({});
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.name=req.body.name;
            newUser.surname=req.body.surname;
            newUser.role=req.body.role;
            var options={
                url:  "https://maps.googleapis.com/maps/api/geocode/json?address=+"+req.body.indirizzo_via+"+"+req.body.indirizzo_citta+"+"+req.body.indirizzo_numero+",%20,+IT&key="+process.env.MAP_KEY
            }
            function callback(error,responde,body){
                var info=JSON.parse(body);
                if(!error && responde.statusCode==200 && info.results.length!=0){
                    newUser.citta=info.results[0].address_components[3].long_name;
                    newUser.indirizzo=info.results[0].address_components[1].long_name+", "+info.results[0].address_components[0].long_name;
                    newUser.long=info.results[0].geometry.location.lng;
                    newUser.lat=info.results[0].geometry.location.lat;
                    newUser.save().then((result) => {
                        const htmlstring1 = "<h1 style='color: green;'><b>QuarantineHelp</b> ti da il benvenuto!</h1>"
                        const htmlstring2 = "<h3 style='color: black;'><i>Grazie per esserti unito a noi ed al nostro team</i></h3>"
                        const htmlstring3 = "<img style='width: 8cm; heigth: 8cm'src='https://apertor.net/wp-content/uploads/2018/10/young-hand-holding-older-one-PMWL2WD.jpg'>"
                        const htmlstring4 = "<a style='text-align:center;' href='https://localhost:" + process.env.PORT + "/'>Home</h3><br>"
                        htmlString= htmlstring1+htmlstring2+htmlstring3+htmlstring4;
                       })
                       .then(result => {
                        return done(null, newUser);
                    })
                       .catch((err)=>{
                            return done(err);
                       })
                }
                else if(error){
                    return done(null, false, {message: 'Nessuna città trovata, inserisci di nuovo'});
                }
                else if(responde.statusCode!=200){
                    return done(null, false, {message: 'Nessuna città trovata, inserisci di nuovo'});
                }
                else if(info.results.length==0){
                    return done(null, false, {message: 'Nessuna città trovata, inserisci di nuovo'});
                }
            }
            request.get(options,callback);
    }})}));
    


passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({ where: { 'email': email } }).then((user) => {
        if (!user) {
            return done(null, false, { message: 'No user found.' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Wrong password.' });
        }
        return done(null, user);
    })
        .catch((err) => {
            return done(err);
        })
}
));






