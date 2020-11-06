// in this middleware we will check that the one whoes signin is the same one to delete or edit the post/comment
// req.model: users/donors

'use strict';
const posts = require('../lib/posts/posts-collection')
const multiFunctions = require('../lib/multiFunctions')
module.exports = (req, res, next) => {
    try {
        let auth = req.headers.authorization.split(' ')
        if (auth[0] == 'Bearer') {
            let token = auth[1];
            multiFunctions.authoraizeUser(token).then(results => { //results is the decoded token which has the user name 
                console.log("resulttttttttts", results)
                console.log("helooooo  iam the results.name", results.name)
                //  get the post from db by its id from params 
                posts.get(req.params.id).then(obj => {
                    console.log("??????obj", obj)
                    console.log("helooooo  iam the obj[0].name", obj[0].author)
                    console.log("helooooo  iam the results.name", results.name)
                    // for delete comments 
                    if (req.params.commentId) {
                        obj[0].comments.forEach(comment => {
                            console.log("commmmmmmment", comment)
                            console.log("commmmmmmmentname", comment.name)
                            console.log("results.name", results.name)
                            if (comment.name === results.name) {
                                console.log("delete auth done")
                                next();
                            }
                        });
                    } else {
                        //for delete posts
                        if (results.name === obj[0].author) {
                            // console.log("helooooo hiiiiii iam the  obj[0].userid", obj[0].userid)
                            // console.log("helooooo  iam the results.name", results.name)
                            console.log("inside next")
                            next();
                        }
                        else {
                            console.log("outsideeeeee")
                            next('Wrong user you cant acsses this action  !!')
                        }

                    }

                })
            })
        }
    } catch (error) {
        next('this is the error : ', error);
    }
}
