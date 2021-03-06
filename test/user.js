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
        interests: 'law,social media,sales',
      })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
  
  // request To Join institution/lumni-group/classs/discussion-group
  it('requesting to join institution/lumni-group/classs/discussion-group', (done) => {
    request(app)
      .post('/user/requesttojoin')
      .send({
        "userId": "603f47b30659d72147b9506a",
        "fullName": "Rodgers Ategyeka",
        "whatToJoin": "discoussiongroup",
        "idOfWhatToJoin": "612f44b30659d72147b9503b",
        "nameOfWhatToJoin": "Discussion group two",
        "toJoinAs": "member",
        "canBeAcceptedBy": ["603f47b30659d72147b95062","413e47b30659d72147b95033"]
      })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        requestId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });
  
  
});
