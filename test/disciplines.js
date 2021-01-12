const { expect } = require('chai');
const request = require('supertest');
const {
  before, after, describe, it,
} = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('disciplines tests', () => {
  let token = null;
  let disciplineId = null;
  before((done) => {
    dbConnect()
      .then(() => done())
      .catch((err) => done(err));
    request(app)
      .post('/auth/login')
      .send({
        email: 'mentor@delv.ac.ug',
        password: '*******',
      })
      .then((res) => {
        token = res.body.token;
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
        keywords: ['code', 'IDE', 'python', 'syntax', 'errors', 'debugging'],
      })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(201);
        disciplineId = res.body._id;
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
