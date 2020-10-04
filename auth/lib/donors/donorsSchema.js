'use strict';
const mongoose = require('mongoose');

const donors = mongoose.Schema({    
  name: { type: String,required:true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  
});

module.exports = mongoose.model('donors', donors);