process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const request = require('supertest');
const {
  describe, it,
} = require('mocha');

require('./test_helper');
const app = require('../app');

describe('user tests', () => {
  // Creates user
  it('create users', (done) => {
    request(app).post('/user/')
      .send({
        firstname: 'FName',
        lastname: 'LName',
        username: 'Username',
        password: '*******',
        email: 'mentor@delv.ac.ug',
        phonenumber: '256-771-123456',
        usercategory: 'mentor',
      })
      .then((res) => {
        const { body, status } = res;
        expect(body).to.contain.property('message');
        expect(status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });
});
