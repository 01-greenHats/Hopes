'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();


const routes = require('./auth/router');
const error404 = require('./middleware/404.js');
const error500 = require('./middleware/500.js');

const app = express();


app.use(express.json());


app.use(cors());
app.use(morgan('dev'));

app.use(routes);



app.get('/bad', (req, res) => {
    throw new Error('bad Request .... ');
});


app.use('*', error404);

app.use(error500);


module.exports = {
    server: app,
    start: port => {
        let PORT = port || process.env.PORT || 4001;
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    },
};