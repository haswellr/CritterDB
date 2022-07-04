var config = require("../config");
var nodemailer = require('nodemailer');
const { google } = require('googleapis');

exports.sendEmail = async function(mailOptions) {
    const OAuth2Client = new google.auth.OAuth2(
        config.email.clientId,
        config.email.clientSecret,
        config.email.redirectUri,
    );
    OAuth2Client.setCredentials({ refresh_token: config.email.refreshToken });

    // Generate the accessToken on the fly
    const accessToken = await OAuth2Client.getAccessToken();

   // Create the email envelope (transport)
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.email.address,
        clientId: config.email.clientId,
        clientSecret: config.email.clientSecret,
        refreshToken: config.email.refreshToken,
        accessToken: accessToken,
      },
    });

    // Set up the email options and delivering it
    const result = await transport.sendMail(mailOptions);
    return result;
}