'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('../users/usersSchema');

const commentsSchema = mongoose.Schema({
    name:{type: String, required: true},
    imgURL:{type: String, required: true,default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"},
    content: { type: String, required: true },

});

// const authorSchema = mongoose.Schema({
//     name:{type: String, required: true},
//     imgURL:{type: String, required: true,default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"},

// });

const posts = mongoose.Schema({
    // author: { type: Schema.Types.ObjectId, ref: 'user', required: true  },
    author: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: Array },
    createdTime: { type: Date, required: true, default: new Date() },
    comments: [{
        type: commentsSchema
    }]
});

module.exports = mongoose.model('posts', posts);