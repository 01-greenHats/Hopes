'use strict';

const schema = require('./admin-shema');
const Model = require('../mongoModel.js');

class Admin extends Model {
  constructor() {
    super(schema);
  }
   
}

module.exports = new Admin();