const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('institution tests', () => {
  let token; 
  let institutionId;
  
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
  it('creates an institution entity', (done) => {
    request(app)
     .post('/institution/')
     .send({
       institutionName: "Makerere",
       location: "Wandegeya",
       alumniGroup: "9858574ea5a4" 
    })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        institutionId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets all---
  it('gets all institutions', (done) => {
    request(app)
      .get('/institution/')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets one ---
  it('gets specific institution', (done) => {
    request(app)
      .get(`/institution/${institutionId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});





