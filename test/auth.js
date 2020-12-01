process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const request = require('supertest');
const {
  before, after, describe, it,
} = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('auth tests', () => {
  before((done) => {
    dbConnect()
      .then(() => done())
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
      .post('/auth/')
      .send({
        username: 'Username',
        password: '*******',
      })
      .then((res) => {
        const { body, status } = res;
        expect(body.message).to.equal('loglog in successfullog in successful in successful');
        expect(status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
  // User logs out
  it('user logs out', (done) => {
    request(app)
      .get('/auth/')
      .then((res) => {
        const { body, status } = res;
        expect(body.message).to.equal('log out successful');
        expect(status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
  // User resets password
  it('user resets password', (done) => {
    request(app)
      .post('/auth/reset')
      .send({
        username: 'Username',
        password: '*******',
      })
      .then((res) => {
        const { body, status } = res;
        expect(body.message).to.equal('password reset successful');
        expect(status).to.equal(204);
        done();
      })
      .catch((err) => done(err));
  });
});
