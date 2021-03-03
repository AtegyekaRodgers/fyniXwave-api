const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('classs tests', () => {
  let token;
  let parentCourseID; 
  let classsId;
  
  before((done) => {
    dbConnect().then(() => {}).catch((err) => done(err));
    request(app)
      .post('/auth/login')
      .send({
        email: 'auth@delv.ac.ug',
        password: 'newPassword',
      })
      .then((res) => {
        token = res.body.token;
        expect(res.body).to.contain.property('token');
        //done(); 
      })
      .catch((err) => done(err));
      
      //TODO: create a new course to be sure there is a record
      request(app)
      .get('/course')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        parentCourseID = res.body[0] ? res.body[0]._id : null;
        done();
      })
      .catch((err) => done(err));
  });
  
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
      })
      .catch((err) => done(err));
      
      //TODO: create a new course to be sure there is a record
      request(app)
      .get('/course')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        parentCourseID = res.body[0] ? res.body[0]._id : null;
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
  it('creates a classs entity', (done) => {
    request(app)
     .post('/classs/')
     .send({
         classsName: "Evening class",
         parentCourse: parentCourseID
     })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        classsId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets all---
  it('get all classses', (done) => {
    request(app)
      .get('/classs/')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets one ---
  it('get specific classs', (done) => {
    request(app)
      .get(`/classs/${classsId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});






