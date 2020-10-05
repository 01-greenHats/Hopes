'use strict';

const { server } = require('../server');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const jwt = require('jsonwebtoken');

describe('server', () => {
    const mockDonor ={
        name: 'Ahmad',
        password: '123',
        email: 'ahmedsh717@gmail.com',
    }
    const mockUser = {
        name: 'Testy',
        password: '123321',
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
    it('users can sign up', () => {
        mockRequest.post('users/signup')
            .send(mockUser)
            .then(result => {
                console.log('>>>>>>>result : ',result);
                expect(result.status).toBe(201);
            })
    });
    it('users can sign in', () => {
        mockRequest.post('users/singup').send(mockUser).then(data => {
            mockRequest.post('users/signin').send(mockUser).then(result => {
                expect(result.status).toBe(200);
            })
        })
    });
    it('donors can sign up',()=>{
        mockRequest.post('donors/signup').send(mockDonor).then(result=>{
            expect(result.status).toBe(201)
        });
    });
    it('donors can sing in',()=>{
        mockRequest.post('donors/signup').send(mockDonor).then(result=>{
            expect(result.status).toBe(201)
            mockRequest.post('donors/signin').auth('Ahmad','123').then(result =>{
                expect(result.status).toBe(200)
            })
        });
    });
    it('any one can see all the users',()=>{
        mockRequest.get('/users').then(result =>{
            expect(result.status).toBe(200);
        })
    });
    // it('both users and donors can post on the general board',()=>{
    //     mockRequest.post('posts/add').
    // })
})