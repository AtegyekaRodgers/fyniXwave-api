const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('course tests', () => {
  let token; 
  let courseId;
  
  before((done) => {
    dbConnect().then(() => {}).catch((err) => {if (err) throw err; done(); });
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
      .catch((err) => {if (err) throw err; done(); }); 
  });
  
  after((done) => {
    dbClose()
      .then(() => done())
      .catch((err) => {if (err) throw err; done(); });
  });
  
  //Creates---
  it('create a course entity', (done) => {
    request(app)
     .post('/course')
     .send({
        "courseName": "Systems analysis and design", 
        "courseCode": "BSE1201",
        "discipline": "IT",
        "specialization": "Software engineering",
        "institution": "Makerere",
        "trainers": [],
        "skills": [],
        "accessibility": "open"
     })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        courseId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets all---
  it('get all courses', (done) => {
    request(app)
      .get('/course')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets one ---
  it('get a specific course', (done) => {
    request(app)
      .get(`/course/${courseId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});






