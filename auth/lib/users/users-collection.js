'use strict';

const schema = require('./usersSchema');
const Model = require('../mongoModel.js');

class User extends Model {
  constructor() {
    super(schema);
  }
   
}

module.exports = new User();