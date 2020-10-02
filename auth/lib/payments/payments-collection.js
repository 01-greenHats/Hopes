'use strict';

const schema = require('./paymentsSchema');
const Model = require('../mongoModel.js');

class Paymet extends Model {
  constructor() {
    super(schema);
  }
   
}

module.exports = new Paymet();