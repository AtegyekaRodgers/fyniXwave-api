const { expect } = require('chai');
const request = require('supertest');
const {
  before, after, describe, it,
} = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('disciplines tests', () => {
  let token;
  let disciplineId;
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
  // Creates disciplines
  it('creates disciplines', (done) => {
    request(app)
      .post('/disciplines/')
      .send({
        discipline: 'Programming',
      })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        disciplineId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  // Add tags to discipline
  it('adds tags to discipline', (done) => {
    request(app)
      .put(`/disciplines/?id=${disciplineId}`)
      .send({
        tags: 'code, syntax, debug, IDE, javascript',
      })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets disciplines
  it('gets disciplines', (done) => {
    request(app)
      .get('/disciplines/')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets specific discipline
  it('gets specific discipline', (done) => {
    request(app)
      .get(`/disciplines/${disciplineId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});
