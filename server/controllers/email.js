var config = require("../config");
var nodemailer = require('nodemailer');
const { google } = require('googleapis');

exports.sendEmail = async function(mailOptions) {
   // Create the email envelope (transport)
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.email.address,
        clientId: config.email.clientId,
        clientSecret: config.email.clientSecret,
        refreshToken: config.email.refreshToken,
      }
    });

    // Set up the email options and delivering it
    const result = await transport.sendMail(mailOptions);
    return result;
}