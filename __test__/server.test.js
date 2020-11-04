'use strict';
const serverModule = require('../server');
const server = serverModule.server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const jwt = require('jsonwebtoken');
describe('server', () => {
    const mockDonor = {
        name: 'Ahmad',
        password: '123',
        email: 'ahmedsh717@gmail.com',
    }
    const mockUser = {
        name: 'tesy',
        password: '1234',
        nationalNo: '010101',
        email: 'testy@gmail.com',
        payPal: '123456789',
        dob: '12/12/2012',
        familyCount: '12',
        socialStatus: 'single',
        healthStatus: 'good',
        healthDesc: 'good',
        income: '150',
        expencsies: '120',
    }
    const mockPost = {
        userid: "1223",
        title: "aaaaaaaaaaaaaaa",
        content: "hiiii",
        imageUrl: "image",
        comments: [{
            userid: "123",
            content: "new comment"
        }]
    }
    it('users can sign up', async() => {
        let result = await mockRequest.post('/api/v1/users/signup').send(mockUser)
        mockRequest.post('/api/v1/users/signup')
        expect(result.status).toBe(200);
    });
    it('users can sign in', async() => {
        let data = await mockRequest.post('/api/v1/users/singup').send(mockUser)
        let result = await mockRequest.post('/api/v1/users/signin').send(mockUser).auth('tesy', '1234')
        expect(result.status).toBe(200);
    });
    it('donors can sign up', async() => {
        let result = await mockRequest.post('/api/v1/donors/signup').send(mockDonor)
        expect(result.status).toBe(200);
    });
    it('donors can sing in', async() => {
        let data = await mockRequest.post('/api/v1/donors/singup').send(mockDonor)
        let result = await mockRequest.post('/api/v1/donors/signin').send(mockDonor).auth('Ahmad', '123')
        expect(result.status).toBe(200);
    });
    it('any one can see all the users', async() => {
        let result = await mockRequest.get('/api/v1/users')
        expect(result.status).toBe(200);
    });
    it('both users and donors can post on the general board', async() => {
        await mockRequest.post('/api/v1/users/signup').send(mockUser);
        let y = await mockRequest.post('/api/v1/users/signin').auth('tesy', '1234');
        let result = await mockRequest.post('/api/v1/users/posts/add')
            .send(mockPost).auth(y.body.token, {
                type: "bearer",
            });
        expect(result.status).toBe(200);
    });
    it('both users and donors can comment on the posts', async() => {
        await mockRequest.post('/api/v1/users/signup').send(mockUser);
        let signInResponse = await mockRequest.post('/api/v1/users/signin').auth('tesy', '1234');
        let postResponse = await mockRequest.post('/api/v1/users/posts/add')
            .send(mockPost).auth(signInResponse.body.token, {
                type: "bearer",
            });
        console.log('@@@@@@@>>@@ : ', postResponse.body);
        let commentResponse = await mockRequest.post(`/api/v1/posts/comments/add/${postResponse.body._id}`)
        expect(commentResponse.status).toBe(500);
    });
    it('should respond with 404 for not found routes', () => {
        return mockRequest.get('/anythingElseMyRoutes').then(result => {
            expect(result.status).toBe(404);
        }).catch(err => {
            console.log(err);
        });
    });
    it('should respond with 500 for bad routes', () => {
        return mockRequest.get('/bad').then(result => {
            expect(result.status).toBe(500);
        }).catch(err => {
            console.log(err);
        });
    });
    it('any one can see all posts', async() => {
        let result = await mockRequest.get('/api/v1/posts')
        expect(result.status).toBe(200)
    });
});