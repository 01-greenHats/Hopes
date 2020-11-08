
'use strict';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
const sendMail = require('./8-send-email/send-email.js');
const payments = require('./auth/lib/payments/payments-collection');

require('dotenv').config();
var bodyParser = require('body-parser')

let inNeedEmail = 'hertani86@gmail.com';
let amount = "150.00";
const routes = require('./auth/router');
const error404 = require('./middleware/404.js');
const error500 = require('./middleware/500.js');
const app = express();
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
// app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index'));
// routes to handle payments
app.post('/pay', handlePayment);
app.get('/success', handleSuccess);
app.get('/cancel', (req, res) => res.send('Cancelled'));
// paypal configuration 
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET,
    'headers': {
        'custom': 'header'
    }
});
// ======================================= handeling payments functions :
function handlePayment(req, res, next) {
    console.log("handlePayment called");
    amount = req.body.amount;
    inNeedEmail = req.body.email;
    console.log({ amount });
    console.log({ inNeedEmail });
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": process.env.SUCCESS_URL,
            "cancel_url": process.env.CANCEL_URL,
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": amount,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": amount
            },
            "description": "Hat for the best team ever"
        }]
    };
    paypal.payment.create(create_payment_json, function(error, payment) {
        console.log('payment create called');
        try {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        } catch (error) {
            console.log("create payment error>>>", error);
        }
        // res.send("test");
    });
}
function handleSuccess(req, res, next) {
    console.log('success called');
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": amount
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
        console.log('execute called');
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            var mailOptions = {
                from: 'hopegaza12@gmail.com',
                to: inNeedEmail,
                subject: 'you hava a donation',
                text: `you have received a donate
                 from ${payment.payer.payer_info.first_name} ${payment.payer.payer_info.last_name}, 
                 with the amount of ${payment.transactions[0].amount.total} ${payment.transactions[0].amount.currency}`
            };
            sendMail(mailOptions);
            console.log(JSON.stringify(payment));
            let obj = {
                userId: payment.transactions[0].payee.merchant_id,
                date: payment.create_time,
                donorName: payment.payer.payer_info.first_name + ' ' + payment.payer.payer_info.last_name,
                amount: payment.transactions[0].amount.total,
                currency: payment.transactions[0].amount.currency
            }
            payments.create(obj).then(result => {
                console.log(result);
                res.send('Success');
            });
            // res.send('Success');
        }
    });
}
//-----------------------------------------------------------
app.use(cors());
app.use(morgan('dev'));
app.use(routes);
app.get('/bad', (req, res) => {
    throw new Error('bad Request .... ');
});
app.use('*', error404);
app.use(error500);
module.exports = {
    server: app,
    start: port => {
        let PORT = port || process.env.PORT;
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    },
};
