'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
require('dotenv').config();


const routes = require('./auth/router');
const error404 = require('./middleware/404.js');
const error500 = require('./middleware/500.js');

const app = express();


app.use(express.json());

app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index'));

// routes to handle payments
app.post('/pay', handlePayment);
app.get('/success', handleSuccess);
app.get('/cancel', (req, res) => res.send('Cancelled'));
// paypal configuration 
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AVmdpJ9EtbqxI1Q-HrmNOCCutM4GMJvnatIMILpbrOexOjcYvonivsy3-BGhdQVyNgy36FI4Zr8IyS56',
    'client_secret': 'EElBrN_xNQDE6PjBt5tN3FiLChIu20aUtKUg5MjeNqKVZw-PI0ADR8Mt3ATUVgCVyTahnHyp_7C8jGOb',
    'headers' : {
        'custom': 'header'
    }
});
// ======================================= handeling payments functions :
function handlePayment(req, res, next) {
    console.log("called");
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://return.url",
            "cancel_url": "http://cancel.url"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
       try {
        console.log("Create Payment Response");
        console.log(payment);
       } catch (error) {
           console.log(error);
       }
            res.send("test");
    });
}
function handleSuccess (req, res, next) {
    console.log('success called');
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": "25.00"
          }
      }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        console.log('execute called');
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
          res.send('Success');
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
        let PORT = port || process.env.PORT || 3030;
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    },
};