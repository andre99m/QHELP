const {google} = require('googleapis');
var express = require('express');
var Order = require('../models/order');
var { Sequelize, Op } = require('sequelize');
var router = express.Router();
const { route } = require('.');
const { isLoggedIn } = require('../config/isLoggedIn');
const { authRole } = require('../config/authRole');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const url = require('url');
let userCredential = null;

router.use('/:id', authRole('assistente'), isLoggedIn, async function(req,res,next){
    Order.findByPk(req.params.id).then(async risposta =>{
      const oAuth2Client = new google.auth.OAuth2('45151686057-39n3vkrpq3sno698g4gshlquhcdtk5is.apps.googleusercontent.com', "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", 'https://localhost:3000/addEvent/'+req.params.id+'/callback');
      if (req.url.includes('callback')) {
        // Handle the OAuth 2.0 server response
        let q = url.parse(req.url, true).query;
        if (q.error) { // An error response e.g. error=access_denied
          console.log('Error:' + q.error);
        } else { // Get access and refresh tokens (if access_type is offline)
            let { tokens } = await oAuth2Client.getToken(q.code);
            oAuth2Client.setCredentials(tokens);
            userCredential = tokens;
            //inizio gestione calendar
            const calendar = google.calendar({version: 'v3', auth: oAuth2Client});
            var now = new Date();
            var msNow = now.getTime();
            var timeMax = new Date(msNow + 60 * 60 * 1000); //  "now" plus one hour
            var timeMin = new Date(msNow); //  "now" minus one hour
          
            var event = {
              'summary': 'Nuova Richiesta',
              'location': risposta.dataValues.indirizzo+", "+req.user.dataValues.citta,
              'description': "da: "+risposta.dataValues.emailuser,
              'start': {
                'dateTime': timeMin,
                'timeZone': 'Europe/Rome',
              },
              'end': {
                'dateTime': timeMax,
                'timeZone': 'Europe/Rome',
              },
              'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=1'
              ],
              "attendees": [
                {
                  "email": req.user.dataValues.email
                }
              ],
              'reminders': {
                'useDefault': false,
                'overrides': [
                  {'method': 'email', 'minutes': 24 * 60},
                  {'method': 'popup', 'minutes': 10},
                ],
              },
            };
            console.log(event);
            calendar.events.insert({
              auth: oAuth2Client,
              calendarId: 'primary',
              resource: event,
            }, function(err, event) {
              if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
              }
              console.log('Event created\n');
              console.log(event.htmlLink);
            });



            
             //fine gestione calendar



        }
        res.redirect('/user/profile');
       }
      else{
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
        });
        res.redirect(authUrl);


      }
    });
});
  

  



module.exports = router;
