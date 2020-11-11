'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
// this class includes some functions that we used more than once
//username:pass
class MultiFunctions {
    getToken(userObj,userType) { // expires after half and hour (900 seconds = 15 minutes)
        console.log('hhhhhhhhhhhhhhhhhh userObj', userObj);
        console.log('the user type is : ',userType)
        return jwt.sign({
            name: userObj.name,
            imgURL: userObj.imgURL,
            userId: userObj._id,
            nationalNo: userObj.nationalNo || '123',
            userType : userType
        }, process.env.TOKEN_SECRET);
  //  }, process.env.TOKEN_SECRET, {expiresIn: '4500s'});

    }
    async hash(string){
        let hashedPass = await bcrypt.hash(string, 5);
        console.log('hashedPass', hashedPass);
        return hashedPass;
    }
    async comparePasswprds(pass,hasedPass){
        console.log('????????valid?????????');
        let valid = await bcrypt.compare(pass,hasedPass)
        return valid ? valid :  null;
    }

    async authoraizeUser  (token) {
        if (! token) {
            return Promise.reject();
        }
        let jwtVarification = jwt.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
            if (err) {
                console.log('myError 1 : ', err);
                return false;
            }
            return decode
        });
        console.log("jwtVarification",jwtVarification)
        console.log("jwtVarification.exp",jwtVarification.exp)
        if (jwtVarification.exp) {
            var dateNow = new Date();
            if(jwtVarification.exp<dateNow.getTime()/1000){
                console.log('the session time is out');
                return false;
            }
            }
            // console.log('> >>>>>>>> jwtVarification ', jwtVarification);
     if (jwtVarification) {
        console.log("heyyyyyyyjwtVarification",jwtVarification)
         return jwtVarification
                // let user = await req.module.findOne({name: jwtVarification.name})
                // console.log('>>>>>>>>>>>>>>',{user: user});
                // return user ? Promise.resolve({user: jwtVarification}).catch(error => {
                //     console.log(error);
                // }) : false;
               
            }
            console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
            return false;
    }
};


module.exports = new MultiFunctions();
