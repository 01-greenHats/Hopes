const { model } = require('mongoose');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hopegaza12@gmail.com',
        pass: 'hope@@2020'
    }
});

// var mailOptions = {
//     from: 'hopegaza12@gmail.com',
//     to: 'hertani86@gmail.com',
//     subject: 'you hava a transfer',
//     text: `you have received a donate from ahmad`
// };

async function sendEmail(mailOptions) {
    await transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
// sendEmail(mailOptions);
module.exports = sendEmail;