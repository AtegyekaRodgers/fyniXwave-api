const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('course tests', () => {
  let token; 
  let courseId;
  let learnerId;
  
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
        //done();
      })
      .catch((err) => {if (err) throw err; done(); });
      
      //create alerner for testing pourpose
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
        "institution": "603f8a84efc9d14364393f0a",
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
  
  // enroll an learner into this course
  it('enroll a learner into course', (done) => {
    request(app)
     .post('/course/enroll')
     .send({
        "learner_id": `${learnerId}`,
        "course_id": `${courseId}`
     })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
  
});






