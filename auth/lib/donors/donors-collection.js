'use strict';

const schema = require('./donorsSchema.js');
const Model = require('../mongoModel.js');

class Donor extends Model {
  constructor() {
    super(schema);
  }
   
}

module.exports = new Donor();