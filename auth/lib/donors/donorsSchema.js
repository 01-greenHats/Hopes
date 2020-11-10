'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('../users/usersSchema');

const donors = mongoose.Schema({    
  name: { type: String,required:true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  favUsers: [{ type: Schema.Types.ObjectId, ref: 'user'}],
  
});

module.exports = mongoose.model('donors', donors);