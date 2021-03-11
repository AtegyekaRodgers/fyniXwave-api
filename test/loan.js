const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('loan tests', () => {
  let memberId;
  let loanId;
  
  before((done) => {
    dbConnect().then(() => {}).catch((err) => done(err));
    // first retreive all member, take note of the id of the first one
    request(app)
      .get('/member')
      .then((res) => {
        memberId = res.body[0]._id;
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
    
  }); 
  
  after((done) => {
    dbClose()
      .then(() => done())
      .catch((err) => done(err));
  });

  // Gets all---
  it('retreiving all loan records', (done) => {
    request(app)
      .get('/loan')
      .then((res) => {
        loanId = res.body[0]._id;
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets one ---
  it('retreiving a specific loan record', (done) => {
    if(loanId){
    request(app)
      .get(`/loan/${loanId}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
      }else{ done(); }
  });
  
  //Retrieve loans for a particular member
  it('retrieving loans for a particular member', (done) => {
    if(memberId){
    request(app)
      .get(`/loan/filtered/${memberId}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
     }else{ done(); }
  });

  
});






