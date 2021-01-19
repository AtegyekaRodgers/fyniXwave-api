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
  });

  after((done) => {
    dbClose()
      .then(() => done())
      .catch((err) => done(err));
  });
  // Creates user
  it('create users', (done) => {
    request(app)
      .post('/user/')
      .send({
        firstname: 'FName',
        lastname: 'LName',
        username: 'Username',
        password: '*******',
        email: 'mentor@delv.ac.ug',
        country: 'Uganda',
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

  let user;
  let token;
  // Getting created user's data
  it('getting users token and details', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        password: '*******',
        email: 'mentor@delv.ac.ug',
      })
      .then((res) => {
        token = res.body.token;
        user = res.body.user;
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  //   Adds fields of interest
  it('adds fields of interest', (done) => {
    request(app)
      .put(`/user/interests/?id=${user._id}`)
      .send({
        interests: '5ffefcd99327cdc1330fa69f, 5ffefc79747ae9c0b3152cc2, 5ffefccd9327cdc1330fa69e',
      })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch((err) => done(err));
  });
});
