const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAIL_KEY);
function sendMail(to, subject, htmltext) {
        const msg = {
            to: to,
            from: 'QuarantineHelp@outlook.it',
            subject: subject,
            html: htmltext,
          }
          sgMail
            .send(msg)
            .then(() => {
              return('Email sent');
            })
            .catch((error) => {
              return(error);
            });
        }
      module.exports = {
          sendMail
      }