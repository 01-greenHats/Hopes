
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
const adminBarer = require('./middleware/adminBarer');
const oauth = require('./middleware/oauth');
const barerAuth = require('./middleware/barerAuth');
const deleteAuth = require('./middleware/deleteAuth');
const { post } = require('superagent');

//routes
router.get('/api/v1/getAllPosts', handleGetAllPosts);
// add fav user to a donor
router.put('/api/v1/:model/addToFav',barerAuth,handleaddToFav);
// delete fav user to a donor
router.delete('/api/v1/:model/deleteFromFav',barerAuth,handleDeleteFromFav);
// get All fav users of one donor
router.get('/api/v1/:model/getDonorFavList',barerAuth,handleGetDonorFavList);
// get All posts by Author Id :
router.get('/api/v1/:model/getAllPostsByAuthor',barerAuth, handleGetAllPostsByAuthor);
// get All posts for one author :
router.get('/api/v1/payments/:userId', handleGetPaymentsForOneUser);
// get one user's data
router.get('/api/v1/:model/getOneUser',barerAuth, handleGetOneUser);

router.get('/api/v1/:model', handleGetAllItems);
router.post('/api/v1/:model', handlePostItem);
// registration routes :
router.post('/api/v1/:model/signin', basicAuth, handleSignIn);
router.post('/api/v1/:model/signup', signUpMidd, handleSignUp);
router.get('/api/v1/donor/oauth', oauth, handleSignIn);

router.put('/api/v1/:model/:id', handlePutItem);
router.patch('/api/v1/:model/:id', handlePutItem);
router.delete('/api/v1/:model/:id', handleDeleteItem);
//posts routes to handle comments
// /api/v1/posts/comments/:postId
// router.post('/api/v1/:model/comments/:postId', handleAddComment);
router.delete('/api/v1/:model/comments/:postId/:commentId', handleDeleteComment);
router.patch('/api/v1/:model/comments/:postId/:commentId', handleEditComment);
// add posts routes ///api/v1/user/posts/add or //api/v1/donor/posts/add 
router.post('/api/v1/:model/posts/add', barerAuth, handleAddPostItem);

// add comments auth ///api/v1/user/comments/add/:postId
router.post('/api/v1/:model/comments/add/:postId', barerAuth, handleAddComment);

// routes to handle payments
router.post('/pay', handlePayment);
router.get('/success', handleSuccess);
router.get('/cancel', (req, res) => res.send('Cancelled'));
router.get('/pay', getPayments);
// routes to handle admin approvals
// delete posts /api/v1/users/posts/delete/:id or /api/v1/users/posts/delete/:id //model required for baerer middleware
// send in the req the bearer token after signin  ////:id is the id of the post
router.delete('/api/v1/:model/posts/delete/:id', barerAuth, deleteAuth, handleDeleteposts)
    //delete comments  /api/v1/users/comments/delete/:id/commentId or /api/v1/donors/comments/delete/:id/commentId
    // send in the req the bearer token after signin //:id is the id of the post
router.delete('/api/v1/:model/comments/delete/:id/:commentId', barerAuth, deleteAuth, handleDeleteSComment)
    // edit comments
router.patch('/api/v1/:model/comments/edit/:id/:commentId', barerAuth, deleteAuth, handleEditSComment);

// edit post 
router.patch('/api/v1/:model/posts/edit/:id', barerAuth, deleteAuth, handleEditPost);





router.put('/api/v1/:model/user/:id', adminBarer, usersApproval);

function usersApproval(req, res, next) {
    // console.log(req.body);
    users.update(req.params.id, { isActive: 2 }).then(result => {
        res.json(result);
    });
}
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
        case 'admin':
            req.model = admin;
            next();
            break;
        default:
            next('Invalid Model!!! ');
            break;
    }
}
/**
 * to get only one user data
 * needs bearer auth only
 * @param {*} req 
 * @param {*} res 
 */
function handleGetOneUser(req, res) {
    let _id = req.userId;
    console.log({ _id });
    users.getOne({ _id }).then(result =>{
    console.log('handleaddToFav called',result);       
        res.json(result)
    // }
    })
}
/**
 * to push new user to the favorit users list for a donor
 * needs bearer auth only
 * @param {*} req 
 * @param {*} res 
 */
function handleDeleteFromFav(req, res) {
    let _id = req.userId;
    console.log({ _id });
    donors.getOne({ _id }).then(result =>{
    console.log('handleaddToFav called',result);
    // if(result.favUsers.includes(req.body.favUsers)){
        // if the givin Id is already exist
        // res.json({Error: 'already exist'})
    // }else{        
        donors.updateOne({ _id },{ $pull: { favUsers: req.body.favUsers } }).then(donor =>{
            res.json(donor)
        });
    // }
    })
}
/**
 * to push new user to the favorit users list for a donor
 * needs bearer auth only
 * @param {*} req 
 * @param {*} res 
 */
function handleaddToFav(req, res) {
    let _id = req.userId;
    console.log({ _id });
    donors.getOne({ _id }).then(result =>{
    console.log('handleaddToFav called',result);
    if(result.favUsers.includes(req.body.favUsers)){
        // if the givin Id is already exist
        res.json({Error: 'already exist'})
    }else{        
        donors.updateOne({ _id },{ $push: { favUsers: req.body.favUsers } }).then(donor =>{
            res.json(donor)
        });
    }
    })
}
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */
function handleGetDonorFavList(req, res, next) {
    let _id = req.userId;
    console.log('Donor ID : ',_id)
    donors.getAllUsersByDonorId({ _id }).then(results => {
        let count = results.length;
        res.json({ count, results });
        // res.json({DonorID : req.params});
    });
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */
function handleGetAllPostsByAuthor(req, res, next) {
    let id = req.userId;
    posts.getAllPosts({author : id}).then(results => {
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
function handleGetAllPosts(req, res, next) {
    posts.getAllPosts().then(results => {
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
function handleGetPaymentsForOneUser(req, res, next) {
    console.log('handleGetPaymentsForOneUser called ');
    payments.getPaymentsByUserId(req.params.userId).then(results => {
        console.log('payments result>>> ', results);
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

    console.log('start handleAddPostItem');
    // req.body.author = req.userId;
    // console.log('>>',req);
    posts.create(req.body).then(result => {
        res.json(result);
        console.log('adding post result>>',result);
    }).catch(next);
    console.log('start handleAddPostItem');

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
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */
function handleDeleteposts(req, res, next) {
    console.log('param id: ', req.params.id);
    posts.delete(req.params.id).then(result => {
        res.json(result);
    }).catch(next);
}
/**
 * 
 */
function handleSignUp(req, res, next) {
    console.log('start handleSignup');
    console.log('req.body>>>',req.body);

    req.model.create(req.body).then(result => {
        console.log('result>>',result);
        res.json({token:req.jwt,addedUser:result});
    }).catch(next);
}

function handleSignIn(req, res) {
    console.log('start handleSignIn');

    if (req.basicAuth) {
        // add the token as cookie 
        res.cookie('token', req.basicAuth.token);
        // add a header
        res.set('token', req.basicAuth.token);
        // console.log('this is token in res : ',res.token);
        // send json object with token and user record
        res.status(200).json({token:req.basicAuth,loggedUser:req.userObject});
    } else {
        res.status(403).send("invaled login");
    }
    console.log('finish handleSignIn');

}

function handleAddComment(req, res) {
    console.log('handleAddComment called');
    let newCommntsArray = [];
    let postId = req.params.postId;
    console.log({ postId });
    let newComment ={
        name : req.name,
        imgURL : req.imgURL,
        content:req.body.content
    } ;
    posts.get(postId).then(myposts => {
        console.log('/**/*/**/POST :', myposts);
        newCommntsArray = myposts[0].comments;
        newCommntsArray.push(newComment);
        posts.update(postId, { comments: newCommntsArray }).then(result => {
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

function handleDeleteSComment(req, res) {
    console.log('*****/**/*/*/*/*/*******Handle Delete Comment********/*/*/*/*/*');
    let commntsArray = [];
    let id = req.params.id;
    let commentId = req.params.commentId;
    console.log('id>>>', id);
    console.log('commentId>>>', commentId);
    posts.get(id).then(mypost => {
        commntsArray = mypost[0].comments;
        commntsArray.forEach((comment, index) => {
            console.log('coment>>>', comment._id);
            if (comment._id == commentId) {
                commntsArray.splice(index, 1);
            }
        });
        posts.update(id, { comments: commntsArray }).then(result => {
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
    console.log("handlePayment called in backend");




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
    await paypal.payment.create(create_payment_json, function(error, payment) {
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
    await paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
        console.log('execute called');
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            let obj = {
                userId: payment.transactions[0].payee.merchant_id,
                date: payment.create_time,
                donorName: payment.payer.first_name + ' ' + payment.payer.last_name,
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

function getPayments(req, res, next) {
    payments.get().then(results => {
        console.log(results);
        let count = results.length;
        res.json({ count, results });
    });
}

function handleEditSComment(req, res) {
    // console.log('params id>>>', req.params.id);
    let commntsArray = [];
    let postId = req.params.id;
    let commentId = req.params.commentId;
    let newComment = req.body;
    posts.get(postId).then(myposts => {
        commntsArray = myposts[0].comments;
        commntsArray.forEach((comment, index) => {
            console.log("thiiiiiis issssss the commmmetsss", comment)
            if (comment._id == commentId) {
                comment.content = newComment.content;
                console.log('no problem ')
            }
        });
        posts.update(postId, { comments: commntsArray }).then(result => {
            res.json(result);
        })
    })
}

function handleEditPost(req,res){
     
     let postId = req.params.id;
     let newPost = req.body;
     posts.get(postId).then(myposts => {
         console.log("my post by id ",myposts)
      
        console.log("new post after edit" ,newPost)
         posts.update(postId,  newPost ).then(result => {
             console.log("my results for edit post ",result)
             res.json(result);
         })
     })

}
module.exports = router;
