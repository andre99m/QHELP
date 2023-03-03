const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
var {sendMail}= require('../config/sendMail');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findByPk(id).then((user) => {
        done(null, user);
    })
    .catch((err)=>{
        done(err,null);
    })
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
    callbackURL: process.env.GOOGLE_CALLBACKURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({where:{email: profile._json.email}}).then((user) => {
        if(user){
            done(null, user);
        } 
        else {
            var newUser = User.build({});
            newUser.email = profile._json.email;
            newUser.password = newUser.encryptPassword(profile+"");
            newUser.name=profile._json.given_name;
            newUser.surname=profile._json.family_name;
            //questi campi devo farli inserire in un form html middlewhere
            newUser.role=null;
            newUser.indirizzo=null;
            newUser.citta=null;
            newUser.long=null;
            newUser.lat=null;
            newUser.save().then((result) => {
                        const htmlstring1 = "<h1 style='color: green;'><b>QuarantineHelp</b> ti da il benvenuto!</h1>"
                        const htmlstring2 = "<h3 style='color: black;'><i>Grazie per esserti unito a noi ed al nostro team</i></h3>"
                        const htmlstring3 = "<img style='width: 8cm; heigth: 8cm'src='https://apertor.net/wp-content/uploads/2018/10/young-hand-holding-older-one-PMWL2WD.jpg'>"
                        const htmlstring4 = "<a style='text-align:center;' href='https://localhost:" + process.env.PORT + "/'>Home</h3><br>"
                        htmlString= htmlstring1+htmlstring2+htmlstring3+htmlstring4;
                        console.log(sendMail(profile._json.email,'Benvenuto!',htmlString));
               })
               .then(result => {
                   return done(null, newUser);
               })
               .catch((err)=>{
                    return done(err);
               })
           
}})}));