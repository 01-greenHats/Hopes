'use strict';
const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
    userid: { type: String, required: true },
    content: { type: String, required: true },

});
const posts = mongoose.Schema({
    userid: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    createdTime: { type: String, required: true },
    comments: [{
        type: commentsSchema
    }]
});

module.exports = mongoose.model('posts', posts);