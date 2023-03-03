var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');

passport.use('facebook',new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_CLIENTSECRET,
    callbackURL: process.env.FACEBOOK_CALLBACKURL,
    profileFields: ['id','displayName','name','email','location', 'address']
  },
  function(accessToken, refreshToken, profile, done) {
      User.findOne({where:{'email': profile._json.email}}).then((user) => {
        if(user){
            return done(null, user);
        }
        if(!user){
            var newUser = User.build({email:"", password: "", name: "", surname: ""});
            newUser.email = profile._json.email;
            newUser.password = newUser.encryptPassword(profile._json.email+profile._json.id+profile._json.name);
            newUser.name=profile._json.first_name;
            newUser.surname=profile._json.last_name;
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
                   })
                   .then(result => {
                    return done(null, newUser);
                })
                   .catch((err)=>{
                        return done(err);
                   })
               
}})}));