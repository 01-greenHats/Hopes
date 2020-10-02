'use strict';

const schema = require('./postsSchema');
const Model = require('../mongoModel.js');

class Post extends Model {
  constructor() {
    super(schema);
  }
   
}

module.exports = new Post();