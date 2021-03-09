const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('classs tests', () => {
  let token;
  let parentCourseID; 
  let jobId;
  
  before((done) => {
    dbConnect().then(() => {}).catch((err) => done(err));
    request(app)
      .post('/auth/login')
      .send({
        "email": 'auth@delv.ac.ug',
        "password": 'newPassword'
      })
      .then((res) => {
        token = res.body.token;
        expect(res.body).to.contain.property('token');
        //done(); 
      })
      .catch((err) => done(err));
      
      request(app)
      .post('/course')
      .send({
        "courseName": "Programming",
        "discipline": "IT",
        "specialization": "Software engineering",
        "tags": ["Software","Engineering","Programming","Development"]
     })
      .then((res) => {
        expect(res.status).to.equal('201');
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
  it('creating a classs entity', (done) => {
    let days = 20;
    let endDate = new Date(Date.now() + (days * 24*60*60*1000));
    request(app)
     .post('/classs')
     .send({
         "classsName": "Class of 2021",
         "parentCourse": parentCourseID,
         "parentInstitution": "603f8a84efc9d14364393f0a",
         "admins": ["603f47b30659d72147b9506a"],
         "startDate": Date.now(),
         "endDate": endDate
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
  it('retrieving all classses', (done) => {
    request(app)
      .get('/classs')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets one ---
  it('retrieving a specific classs', (done) => {
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






