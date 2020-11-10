'use strict';

const multiFunctions = require("../lib/multiFunctions");

// const donors = require('./lib/donors/donors-collection');
// const users = require('./lib/users/users-collection');

module.exports = (req,res,next)=>{
try {
    req.model.getOne({name : req.body.name }).then(result => {
        // console.log('?>>???????',result);
        if(result){
            next('already exist');
        }
        req.jwt = multiFunctions.getToken(req.body,req.params.model)
        // console.log(req.body);
         multiFunctions.hash(req.body.password).then(hashedPass=>{
            req.body.password = hashedPass
            console.log('result : ',req.body.password);
            next();
        })
    });
} catch (error) {
    next('this is the error : ',error)
}
}