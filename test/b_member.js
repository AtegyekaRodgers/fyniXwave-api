const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('member tests', () => {
  let memberId;
  let loanId;
  
  before((done) => {
    dbConnect().then(() => {}).catch((err) => done(err));
    //create a new member
    request(app)
     .post('/member')
     .send({
        "firstname": "Tumwine",
        "lastname": "Robert"
     })
      .then((res) => {
        memberId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  }); 
  
  after((done) => {
    dbClose()
      .then(() => done())
      .catch((err) => done(err));
  });
  
  //Member takes a loan---
  it('member takes a loan', (done) => {
    request(app)
     .post('/member/takeloan')
     .send({
        "member_id": memberId,
        "principalAmount": 200000
     })
      .then((res) => {
        loanId = res.body.newloan._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets all---
  it('retreiving all members', (done) => {
    request(app)
      .get('/member')
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets one ---
  it('retreiving a specific member', (done) => {
    request(app)
      .get(`/member/${memberId}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  
});






