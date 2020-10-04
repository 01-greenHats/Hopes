// check if the user/donor are signed in befor adding posts 

const multiFunctions = require('../lib/multiFunctions')
module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            next('missing Headers!');
            return;
        }
        let auth = req.headers.authorization.split(' ')
        if (auth[0] == 'Bearer') {
            let token = auth[1];
            multiFunctions.authoraizeUser(token).then(isUserAuthorize => {

                if (isUserAuthorize) {
                    console.log('isUserAuthorize>>>>>>>>>', isUserAuthorize.name);
                    req.model.getOne({ name: isUserAuthorize.name }).then(user => {
                        console.log('>>>>>>>>>>>>>>', { user: user });
                        if (user) {
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
    } catch (error) {
        next('this is the error : ', error);
    }
}
