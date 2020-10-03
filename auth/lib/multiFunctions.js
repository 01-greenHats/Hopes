'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
// this class includes some functions that we used more than once
//username:pass
class MultiFunctions {
    getToken(userObj) { // expires after half and hour (900 seconds = 15 minutes)
        console.log('hhhhhhhhhhhhhhhhhh userObj', userObj);
        return jwt.sign({
            name: userObj.name,
            nationalNo: userObj.nationalNo || '123'
        }, process.env.TOKEN_SECRET, {expiresIn: '900s'});
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
};


module.exports = new MultiFunctions();
