/* eslint-disable no-undef */
'use strict';
const multiFunctions = require("../lib/multiFunctions");
const base64 = require('base-64');
module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            console.log('req.headers>>>>>>', req.headers)
            next('missing Headers!');
            return;
        }
        const auth = req.headers.authorization.split(' ');

        // console.log('Hiiiiiiiiii',auth);
        if (auth[0] == 'Basic') {
            const [username, password] = base64.decode(auth[1]).split(':');
            req.model.getOne({ name: username }).then(userObj => {
                console.log('Hi there i aM HERE >>>>>>>>>>>>>>', userObj);
                req.userObject=userObj;
                multiFunctions.comparePasswprds(password, userObj.password).then(validUser => {
                    // console.log('>>>>>>>validUser : ', validUser);
                    if (!validUser) {
                        return next('Wrong Useranem or Password');
                    }
                    let token = multiFunctions.getToken(userObj,req.params.model);
                    // console.log('token >>>>>>>', token);
                    if (token) {
                        req.basicAuth = {
                            token: token,
                            user: validUser
                        }
                    }
                    next();

                }).catch(err => next(err));
            }).catch(err => next(err));
            // multiFunctions.authenticateBasic(username, password).then(validUser =>{

        } else {
            next('Invalid Login!! ');
        }
    } catch (error) {
        next('this is the error : ', error);
    }
}