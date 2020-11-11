'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('../users/usersSchema');

const donors = mongoose.Schema({    
  name: { type: String,required:true},
  imgURL:{type: String, required: true,default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"},
  password: {type: String, required: true},
  email: {type: String, required: true},
  favUsers: [{ type: Schema.Types.ObjectId, ref: 'user'}],
  
});

module.exports = mongoose.model('donors', donors);