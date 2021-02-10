const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('skill tests', () => {
  let token; 
  let skillId;
  
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
  });
  after((done) => {
    dbClose()
      .then(() => done())
      .catch((err) => done(err));
  });
  
  //Creates---
  it('creates an skill entity', (done) => {
    request(app)
     .post('/skill/')
     .send({
       skillName: "APIs development",
       discipline: "IT",
       specialization: "Software engineering",
       profilePicture: ""
    })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        skillId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets all---
  it('gets all skills', (done) => {
    request(app)
      .get('/skill/')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets one ---
  it('gets specific skill', (done) => {
    request(app)
      .get(`/skill/${skillId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});






