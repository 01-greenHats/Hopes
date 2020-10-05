'use strict';

const express = require('express');
const router = express.Router();

// schema
const donors = require('./lib/donors/donors-collection');
const users = require('./lib/users/users-collection');
const posts = require('./lib/posts/posts-collection');
const payments = require('./lib/payments/payments-collection');
const signUpMidd = require('./middleware/signUpMidd');
const basicAuth = require('./middleware/basicAuth');
const oauth = require('./middleware/oauth');
const barerAuth =require('./middleware/barerAuth');
const deleteAuth = require('./middleware/deleteAuth');

router.get('/api/v1/:model', handleGetAllItems);
router.post('/api/v1/:model', handlePostItem);
router.post('/api/v1/:model/signin',basicAuth, handleSignIn);
router.post('/api/v1/:model/signup',signUpMidd, handleSignUp);

router.get('/api/v1/donor/oauth',oauth, handleSignIn);

router.put('/api/v1/:model/:id', handlePutItem);
router.patch('/api/v1/:model/:id', handlePutItem);
router.delete('/api/v1/:model/:id', handleDeleteItem);
//posts routes to handle comments
router.post('/api/v1/:model/comments/:postId', handleAddComment);
router.delete('/api/v1/:model/comments/:postId/:commentId', handleDeleteComment);
router.patch('/api/v1/:model/comments/:postId/:commentId', handleEditComment);
// add posts routes ///api/v1/user/posts/add or //api/v1/donor/posts/add 
router.post('/api/v1/:model/posts/add', barerAuth,handleAddPostItem); 


// delete posts /api/v1/users/posts/delete/:id or /api/v1/users/posts/delete/:id //model required for baerer middleware
// send in the req the bearer token after signin  ////:id is the id of the post
router.delete('/api/v1/:model/posts/delete/:id', barerAuth,deleteAuth,handleDeleteposts)

//delete comments  /api/v1/users/comments/delete/:id/commentId or /api/v1/donors/comments/delete/:id/commentId
// send in the req the bearer token after signin //:id is the id of the post
router.delete('/api/v1/:model/comments/delete/:id/:commentId', barerAuth,deleteAuth,handleDeleteSComment)

// edit comments
// router.patch('/api/v1/:model/comments/edit/:id/:commentId',barerAuth,deleteAuth,handleEditSComment);





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
    req.model.create(req.body).then(result => {
        res.json(req.jwt);
    }).catch(next);
}
function handleSignIn(req,res) {
    if(req.basicAuth) {
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


function handleDeleteSComment(req, res) {
    // console.log('params id>>>', req.params.id);
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

function handleEditSComment(req, res) {
    // console.log('params id>>>', req.params.id);
    let commntsArray = [];
    let postId = req.params.id;
    let commentId = req.params.commentId;
    let newComment = req.body;
    posts.get(postId).then(myposts => {
        commntsArray = myposts[0].comments;
        commntsArray.forEach((comment, index) => {
            console.log("thiiiiiis issssss the commmmetsss",comment)
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
module.exports = router;