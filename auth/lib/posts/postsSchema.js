'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('../users/usersSchema');

const commentsSchema = mongoose.Schema({
    name:{type: String, required: true},
    imgURL:{type: String, required: true,default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"},
    content: { type: String, required: true },

});
// const posts = mongoose.Schema({
//     userid: { type: String, required: true },
//     content: { type: String, required: true },
//     imageUrl: { type: String },
//     createdTime: { type: String, required: true, default: Date.now },
//     comments: [{
//         type: commentsSchema
//     }]
// });

const posts = mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true  },
    content: { type: String, required: true },
    imageUrl: { type: Array },
    createdTime: { type: Date, required: true, default: new Date() },
    comments: [{
        type: commentsSchema
    }]
});

module.exports = mongoose.model('posts', posts);