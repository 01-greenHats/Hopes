'use strict';

const mongoose = require('mongoose');

const users = mongoose.Schema({    
  name: { type: String,required:true},
  password: {type: String, required: true},
  nationalNo: {type: Number, required: true},
  email: {type: String, required: true},
  payPal: {type: String, required: true},
  dob: {type: Date, required: true},
  familyCount: {type: Number, required: true},
  socialStatus: {type: String, required: true,enum: ['single', 'married', 'widowed', 'divorced']},
  healthStatus: {type: String, required: true,enum: ['good', 'disabled', 'chronic disease']},
  healthDesc: {type: String, required: true},
  income: {type: Number, required: true},
  expencsies: {type: Number, required: true},
  isActive: {type: Number, required: true}
});

module.exports = mongoose.model('users', users);
