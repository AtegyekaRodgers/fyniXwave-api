const { expect } = require('chai');
const {
  before, after, describe, it,
} = require('mocha');
const request = require('supertest');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('user tests', () => {
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
  it('gives welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.body.message).to.equal('Welcome to delv api');
    expect(res.status).to.equal(200);
  });
});
