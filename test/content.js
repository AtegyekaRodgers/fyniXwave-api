const { expect } = require('chai');
const request = require('supertest');
const {
  before, after, describe, it,
} = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('content tests', () => {
  let token;
  before((done) => {
    dbConnect().catch((err) => done(err));
    request(app)
      .post('/auth/login')
      .send({
        email: 'auth@delv.ac.ug',
        password: 'newPassword',
      })
      .then((res) => {
        token = res.body.token;
        expect(res.body).to.contain.property('token');
        done();
      })
      .catch((err) => done(err));
  });
  after((done) => {
    dbClose()
      .then(() => done())
      .catch((err) => done(err));
  });

  // Gets related content
  it('Gets related content', (done) => {
    request(app)
      .get('/contents/relatedContent/600e8c7b9e7efb6374fd0bb7')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});
