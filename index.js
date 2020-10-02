  
'use strict';

const mongoose = require('mongoose');

const serverModule = require('./server'); 

const MONGOOSE_URL = 'mongodb://localhost:27017/hopes'; 

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
mongoose.connect(MONGOOSE_URL, mongooseOptions);


serverModule.start();

