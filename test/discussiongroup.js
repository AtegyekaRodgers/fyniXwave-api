const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('discussion groups testing', () => {
  let token; 
  let discussionGroupId;
  
  before((done) => {
    dbConnect().then(() => {}).catch((err) => done(err));
    request(app)
      .post('/auth/login')
      .send({
        "email": 'auth@delv.ac.ug',
        "password": 'newPassword',
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
  
  //Creates---
  it('creating a discussion group', (done) => {
    request(app)
     .post('/discussiongroup')
     .send({
          "groupName": "discussion group one",
          "admins": ["603f47b30659d72147b9506a"]
      })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        discussionGroupId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });
  
  
  it('joining a discussion group', (done) => {
    request(app)
     .post('/discussiongroup/joingroup')
     .send({
          "member": "603f47b30659d72147b9506a", //user id 
          "discussiongroup": "613f47b30659d72147b9506b" //group id
      })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        discussionGroupId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  // Get all---
  it('reading/retreiving all discussoin groups', (done) => {
    request(app)
      .get('/discussiongroup')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Get one ---
  it('get specific discussion group', (done) => {
    request(app)
      .get(`/discussiongroup/${discussionGroupId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});






