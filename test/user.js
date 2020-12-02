process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const request = require('supertest');
const {
  before, after, describe, it,
} = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('user tests', () => {
  before((done) => {
    dbConnect()
      .then(() => done())
      .catch((err) => done(err));
    // Creating dummy test user
    request(app).post('/user/')
      .send({
        firstname: 'authFName',
        lastname: 'authLName',
        username: 'myUsername',
        password: 'myPassword',
        email: 'auth@delv.ac.ug',
        phonenumber: '256-999-123456',
        usercategory: 'mentor',
      })
      .catch((err) => done(err));
  });

  after((done) => {
    dbClose()
      .then(() => done())
      .catch((err) => done(err));
  });
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

  // User logs in
  it('user logs in', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        username: 'myUsername',
        password: 'myPassword',
      })
      .then((res) => {
        const { body, status } = res;
        // Checking for needed return data
        expect(body.message).to.equal('log in successful', 'return message failed');
        expect(body).to.contain.property('token', 'token not sent');
        expect(body).to.contain.property('user', 'username not sent');
        expect(status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});
