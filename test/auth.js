// process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const request = require('supertest');
const {
  before, after, describe, it,
} = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('auth tests', () => {
  before((done) => {
    // Connecting to mock database
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
        // Checking for needed return
        console.log(body);
        expect(status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
  // User logs out
  it.skip('user logs out', (done) => {
    request(app)
      .get('/auth/logout')
      .then((res) => {
        const { body, status } = res;
        expect(body.message).to.equal('log out successful', 'return message failed');
        expect(body).to.not.contain.property('token', 'token maintained after log out');
        expect(status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
  // User resets password
  it.skip('user resets password', (done) => {
    request(app)
      .post('/auth/resetpassword')
      .send({
        password: 'newPassword',
      })
      .then((res) => {
        const { body, status } = res;
        expect(body.message).to.equal('password reset successful', 'return message failed');
        expect(body).to.not.contain.property('token', 'token maintained after password reset');
        expect(status).to.equal(204);
        done();
      })
      .catch((err) => done(err));
  });
});
