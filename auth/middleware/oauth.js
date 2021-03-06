/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
const superagent = require('superagent');
// const users = require('../users.js');
const donors = require('../lib/donors/donors-collection');
const multiFunctions = require('../lib/multiFunctions')

const {
    CLIENT_ID,
    CLIENT_SECRET,
} = process.env;
const API_SERVER = 'https://gazahopes.herokuapp.com/api/v1/donor/oauth';

module.exports = async function(req, res, next) {
    console.log('start OAuth');
    try {
        const {
            code,
        } = req.query;
        console.log('(1) CODE:', code);

        const remoteToken = await exchangeCodeForToken(code);
        console.log('(2) ACCESS TOKEN:', remoteToken);

        const remoteUser = await getRemoteUserInfo(remoteToken);
        console.log('(3) GOOGLE USER', remoteUser);

        const [user, token] = await getUser(remoteUser);
        req.basicAuth = {
                token: token,
                user: user
            }
            // req.token = token;
            // req.user = user;

        console.log('(4) LOCAL USER', user);
        next();
    } catch (e) {
        next(`ERROR: ${e.message}`);
    }
    console.log('finish OAuth');

};

// this will use the access_token google api endpoint
async function exchangeCodeForToken(code) {
    const tokenResponse = await superagent.post('https://www.googleapis.com/oauth2/v4/token')
        .send({
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: API_SERVER,
            grant_type: 'authorization_code',
        });

    console.log('exchangeCodeForToken Out');

    const {
        access_token,
    } = tokenResponse.body;
    return access_token;
}

// this will use the user api endpoint to get user info/repo info
async function getRemoteUserInfo(token) {
    // this will use the access token to get user details
    const userResponse = await superagent.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`)
        .set('user-agent', 'express-app')
        .set('Authorization', `token ${token}`);

    const user = userResponse.body;
    return user;
}

async function getUser(remoteUser) {
    const userRecord = {
        name: remoteUser.email.split('@')[0],
        password: 'oauthpassword',
        email: remoteUser.email
    };
    console.log('RecordUser >>>>>>>>> : ', userRecord);
    const user = await donors.create(userRecord);
    const token = multiFunctions.getToken(user);
    return [user, token];
}