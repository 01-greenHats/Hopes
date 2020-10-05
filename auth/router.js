'use strict';

const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');

// schema
const donors = require('./lib/donors/donors-collection');
const admin = require('./lib/admin/admin-collection');
const users = require('./lib/users/users-collection');
const posts = require('./lib/posts/posts-collection');
const payments = require('./lib/payments/payments-collection');
const signUpMidd = require('./middleware/signUpMidd');
const basicAuth = require('./middleware/basicAuth');
const oauth = require('./middleware/oauth');
const barerAuth = require('./middleware/barerAuth');

router.get('/api/v1/:model', handleGetAllItems);
router.post('/api/v1/:model', handlePostItem);
router.post('/api/v1/:model/signin', basicAuth, handleSignIn);
router.post('/api/v1/:model/signup', signUpMidd, handleSignUp);

router.get('/api/v1/donor/oauth', oauth, handleSignIn);

router.put('/api/v1/:model/:id', handlePutItem);
router.patch('/api/v1/:model/:id', handlePutItem);
router.delete('/api/v1/:model/:id', handleDeleteItem);
//posts routes to handle comments
router.post('/api/v1/:model/comments/:postId', handleAddComment);
router.delete('/api/v1/:model/comments/:postId/:commentId', handleDeleteComment);
router.patch('/api/v1/:model/comments/:postId/:commentId', handleEditComment);
// add posts routes ///api/v1/user/posts/add or //api/v1/donor/posts/add 
router.post('/api/v1/:model/posts/add', barerAuth, handleAddPostItem);

// routes to handle payments
router.post('/pay', handlePayment);
router.get('/success', handleSuccess);
router.get('/cancel', (req, res) => res.send('Cancelled'));
router.get('/pay', getPayments);

// routes to handle admin approvals



router.param('model', getModel);


// How will we get the right Model? 
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */
function getModel(req, res, next) {
    let model = req.params.model;
    switch (model) {
        case 'users':
            req.model = users;
            next();
            break;
        case 'donors':
            req.model = donors;
            next();
            break;
        case 'posts':
            req.model = posts;
            next();
            break;
        case 'payments':
            req.model = payments;
            next();
            break;
        default:
            next('Invalid Model!!! ');
            break;
    }
}
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */
function handleGetAllItems(req, res, next) {
    console.log('req.model: ', req.model);
    req.model.get().then(results => {
        let count = results.length;
        res.json({ count, results });
    });
}
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */
function handlePostItem(req, res, next) {
    req.model.create(req.body).then(result => {
        res.json(result);
    }).catch(next);
}
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */

function handleAddPostItem(req, res, next) {
    posts.create(req.body).then(result => {
        res.json(result);
    }).catch(next);
}
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */
function handlePutItem(req, res, next) {
    req.model.update(req.params.id, req.body).then(result => {
        res.json(result);
    }).catch(next);
}
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */
function handleDeleteItem(req, res, next) {
    console.log('param id: ', req.params.id);
    req.model.delete(req.params.id).then(result => {
        res.json(result);
    }).catch(next);
}
/**
 * 
 */
function handleSignUp(req, res, next) {
    req.model.create(req.body).then(result => {
        res.json(req.jwt);
    }).catch(next);
}
function handleSignIn(req, res) {
    if (req.basicAuth) {
        // add the token as cookie 
        res.cookie('token', req.basicAuth.token);
        // add a header
        res.set('token', req.basicAuth.token);
        // send json object with token and user record
        res.status(200).json(req.basicAuth);
    } else {
        res.status(403).send("invaled login");
    }
}

function handleAddComment(req, res) {
    console.log('handleAddComment called');
    let newCommntsArray = [];
    let postId = req.params.postId;
    console.log({ postId });

    let newComment = req.body;

    req.model.get(postId).then(posts => {
        newCommntsArray = posts[0].comments;
        newCommntsArray.push(newComment);
        req.model.update(postId, { comments: newCommntsArray }).then(result => {
            res.json(result);
        })
    })
}


function handleDeleteComment(req, res) {
    // console.log('params id>>>', req.params.id);
    let commntsArray = [];
    let postId = req.params.postId;
    let commentId = req.params.commentId;
    console.log('postId>>>', postId);
    console.log('commentId>>>', commentId);
    req.model.get(postId).then(posts => {
        commntsArray = posts[0].comments;
        commntsArray.forEach((comment, index) => {
            console.log('coment>>>', comment._id);
            if (comment._id == commentId) {
                commntsArray.splice(index, 1);
            }
        });
        req.model.update(postId, { comments: commntsArray }).then(result => {
            res.json(result);
        })
    })
}

function handleEditComment(req, res) {
    // console.log('params id>>>', req.params.id);
    let commntsArray = [];
    let postId = req.params.postId;
    let commentId = req.params.commentId;
    let newComment = req.body;
    req.model.get(postId).then(posts => {
        commntsArray = posts[0].comments;
        commntsArray.forEach((comment, index) => {
            if (comment._id == commentId) {
                comment.content = newComment.content;
            }
        });
        req.model.update(postId, { comments: commntsArray }).then(result => {
            res.json(result);
        })
    })
}

// ======================================= handeling payments functions :

// paypal configuration 
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET,
    'headers': {
        'custom': 'header'
    }
});

async function handlePayment(req, res, next) {
    console.log("handlePayment called");
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "price": "25.00",
                    "currency": "USD",
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "25.00"
            },
            "description": "Hat for the best team ever"
        }]
    };
    await paypal.payment.create(create_payment_json, function (error, payment) {
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

async function handleSuccess(req, res, next) {
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
    await paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        console.log('execute called');
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            let obj = {
                userId: payment.transactions[0].payee.merchant_id,
                date: payment.create_time,
                donorName: payment.payer.first_name + ' ' + payment.payer.last_name ,
                amount: payment.transactions[0].amount.total,
                currency: payment.transactions[0].amount.currency
                    }
            payments.create(obj).then(result => {
                console.log(result);
                res.send('Success');
            });
        }
    });
}

function getPayments (req, res, next) {
    payments.get().then(results => {
        console.log(results);
        let count = results.length;
        res.json({ count, results });
    });
}


module.exports = router;