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
        console.log('req.headers>>',req.headers);

        console.log('req.headers.authorization>>',req.headers.authorization);

        let auth = req.headers.authorization.split(' ')
        console.log('auth line>>',auth);
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
                            req.userId = user._id
                            req.name = user.name
                            req.imgURL = user.imgURL
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
