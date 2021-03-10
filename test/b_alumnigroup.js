const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('tests for alumni groups', () => {
  let token; 
  let alumniGroupId;
  
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
  it('creating alumni group', (done) => {
    request(app)
     .post('/alumnigroup')
     .send({
        "groupName": "Delv alumni",
        "started": "01/01/2000",
        "parentInstitution": "603f8a84efc9d14364393f0a",
        "admins": ["603f47b30659d72147b9506a"]
      })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        alumniGroupId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  // Get all---
  it('reading/retreiving all alumni groups', (done) => {
    request(app)
      .get('/alumnigroup')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Get one ---
  it('get specific alumni group', (done) => {
    request(app)
      .get(`/alumnigroup/${alumniGroupId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});






