const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('learner tests', () => {
  let token; 
  let learnerId;
  let userId;
  
  before((done) => {
    dbConnect().catch((err) => done(err));
    request(app)
      .post('/auth/login')
      .send({
        "email": 'auth@delv.ac.ug',
        "password": 'newPassword',
      })
      .then((res) => {
        token = res.body.token;
        userId = res.body.user._id;
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
  it('create a learner entity', (done) => {
    request(app)
     .post('/learner')
     .send({
        "email": "kabagambe@yahoo.com",
        "phone": "+256706123303",
        "country": "Uganda",
        "firstname": "Kabagambe",
        "lastname": "Kened",
        "username": "kabagambe@yahoo.com",
        "password": "kenedpass",
        "discipline": null,
        "specialization": "Software engineering",
        "institution": "603f8a84efc9d14364393f0a",
        "userId": "603f47b30659d72147b9506a",
        "courses": ["Systems analysis and design", "Golang", "React"],
        "skills": ["PHP", "Laravel", "CSS"],
        "classes": ["Evening class"]
    })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        learnerId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets all---
  it('get all learners', (done) => {
    request(app)
      .get('/learner')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets one ---
  it('get specific learner', (done) => {
    request(app)
      .get(`/learner/${learnerId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
  
  //Marketing courses to a learner
  it('marketing courses to a learner, relevant to them', (done) => {
    request(app)
     .post('/marketcourses')
     .send({
        "userId": userId
    })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
  
  //Marketing jobs to a learner
  it('marketing jobs to a learner, relevant to them', (done) => {
    request(app)
     .post('/marketjobs')
     .send({
        "userId": userId
    })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
  
  
});






