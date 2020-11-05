  'use strict';
  require('dotenv').config();
  const mongoose = require('mongoose');

  const serverModule = require('./server');

  const MONGOOSE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/hopes'; 

  // const mongooseOptions = {
  //   useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false,
  //   useUnifiedTopology: true,
  // };
  // mongoose.connect(MONGOOSE_URL, mongooseOptions);


    // connect to cloud DB
   const uri = process.
   +"mongodb+srv://ahmad:hopes2020@cluster0.vagkk.mongodb.net/hopes?retryWrites=true&w=majority";
   mongoose.connect(uri, {
           useNewUrlParser: true,
           useUnifiedTopology: true
       })
       .then(() => {
           console.log('MongoDB Connected…')
       })
       .catch(err => console.log(err))


  serverModule.start();