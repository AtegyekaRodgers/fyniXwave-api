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
        // Checking for needed returns
        expect(body).to.contain.property('token');
        expect(body).to.contain.property('user');
        expect(status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // User logs out
  it('user logs out', (done) => {
    request(app)
      .get('/auth/logout')
      .then((res) => {
        const { body, status } = res;
        expect(body.message).to.deep.equal('log out successful');
        expect(body.user).to.deep.equal(null);
        expect(body.token).to.deep.equal(null);
        expect(status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // User resets password
  it('user resets password', (done) => {
    request(app)
      .post('/auth/resetPassword')
      .send({
        username: 'myUsername',
        password: 'myPassword',
        newPassword: 'newPassword',
      })
      .then((res) => {
        const { body, status } = res;
        expect(body.message).to.equal('Password has been reset. Please log in');
        expect(body.user).to.deep.equal(null);
        expect(body.token).to.deep.equal(null);
        expect(status).to.equal(204);
        done();
      })
      .catch((err) => done(err));
  });

  // New password logs user in
  it('new password logs user in', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        username: 'myUsername',
        password: 'newPassword',
      })
      .then((res) => {
        const { body, status } = res;
        // Checking for needed returns
        expect(body).to.contain.property('token');
        expect(body).to.contain.property('user');
        expect(status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});
