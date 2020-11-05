// check if the user/donor are signed in befor adding posts 
'use strict';
const multiFunctions = require('../lib/multiFunctions')
module.exports = (req, res, next) => {
    console.log('start Bearer Auth');

    try {
        console.log('start try in Bearer Auth');
        if (!req.headers.authorization) {
            next('missing Headers!');
            return;
        }
        let auth = req.headers.authorization.split(' ')
        if (auth[0] == 'Bearer') {
            console.log(' auth[0] == Bearer');
            let token = auth[1];
            console.log('received token>>> ',token);
            multiFunctions.authoraizeUser(token).then(isUserAuthorize => {

                if (isUserAuthorize) {
                    // console.log('isUserAuthorize>>>>>>>>>', isUserAuthorize.name);
                    req.model.getOne({ name: isUserAuthorize.name }).then(user => {
                        console.log('>>>>>>>>>>>>>>', { user: user });
                        if (user) {
                            console.log("bearer auth done")
                            next();
                            return;
                        } else {
                            next('Wrong Token !!')
                        }

                    })
                } else {
                    return next('Invalid Login, No Headers !!');
                }

            })

        }
        console.log('finish try in Bearer Auth');

    } catch (error) {
        next('this is the error : ', error);
    }
    console.log('finish Bearer Auth');

}
