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
        country: 'Uganda',
        usercategory: 'mentor',
      })
      .catch((err) => done(err));
  });

  after((done) => {
    dbClose()
      .then(() => done())
      .catch((err) => done(err));
  });

  let token; // will hold the headers bearer token on login

  // User logs in
  it('user logs in', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        email: 'auth@delv.ac.ug',
        password: 'myPassword',
      })
      .then((res) => {
        const { body, status } = res;
        // Checking for needed returns
        token = res.body.token;
        expect(body).to.contain.property('token');
        expect(body).to.contain.property('user');
        expect(status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // auth.authorize(grant access) works
  it('auth.authorize (grant access) works', (done) => {
    request(app)
      .get('/user/')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        const { status } = res;
        expect(status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // User resets password
  it('user resets password', (done) => {
    request(app)
      .post('/auth/resetpassword')
      .send({
        email: 'auth@delv.ac.ug',
        password: 'myPassword',
        newPassword: 'newPassword',
      })
      .then((res) => {
        const { body, status } = res;
        expect(body.message).to.equal('Password has been reset. Please log in');
        expect(body.user).to.deep.equal(null);
        expect(body.token).to.deep.equal(null);
        expect(status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // New password logs user in
  it('new password logs user in', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        email: 'auth@delv.ac.ug',
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

  // auth.authorize (deny access) works
  it('auth.authorize (deny access) works', (done) => {
    request(app)
      .get('/user/')
      .then((res) => {
        const { status } = res;
        expect(status).to.equal(403);
        done();
      })
      .catch((err) => done(err));
  });
});
