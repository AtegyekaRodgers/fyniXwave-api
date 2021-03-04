const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('trainer tests', () => {
  let token; 
  let trainerId;
  
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
  it('create trainer entity', (done) => {
    request(app)
     .post('/trainer/')
     .send({
        "email": "atrodgers7@gmail.com",
        "phone": "+256781224508",
        "country": "Uganda",
        "firstname": "Ategyeka",
        "lastname": "Rodgers",
        "username": "atrodgers7@gmail.com",
        "password": "mypaxwad",
        "discipline": "IT",
        "specialization": "Software engineering",
        "userId": "603f47b30659d72147b9506a",
        "institution": "Makerere",
        "courses": ["Systems analysis and design", "Golang", "React"],
        "skills": ["Backend", "APIs development", "Systems modeling"]
    })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        trainerId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets all---
  it('gets all trainers', (done) => {
    request(app)
      .get('/trainer/')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets one ---
  it('gets specific trainer', (done) => {
    request(app)
      .get(`/trainer/${trainerId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});






