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
  // login to get details
  const logIn = (done) => {
    request(app)
      .post('/auth/login')
      .send({
        email: 'mentor@delv.ac.ug',
        password: '*******',
      })
      .then((res) => {
        user = res.body.user;
        token = res.body.token;
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  };
  //   Adds fields of interest
  it('adds fields of interest', (done) => {
    console.log(logIn());
    request(app)
      .post(`/user/interests/?id=${user._id}`)
      .send(
        '5ffefcd99327cdc1330fa69f, 5ffefc79747ae9c0b3152cc2, 5ffefccd9327cdc1330fa69e',
      )
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch((err) => done(err));
  });
});
