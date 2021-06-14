const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('payment tests', () => {
  let memberId;
  let loanId;
  let paymentId;
  
  before((done) => {
    dbConnect().then(() => {}).catch((err) => done(err));
    // first retreive all member, take note of the id of the first one
    request(app)
      .get('/member')
      .then((res) => {
        memberId = res.body[0]._id;
        expect(res.status).to.equal(200);
        //done();
      })
      .catch((err) => done(err));
      
      //retreive a loan record for the member above
      request(app)
      .get(`/loan/filtered/${memberId}`)
      .then((res) => {
        loanId = (res.body.length && res.body.length>0)?res.body[0]._id : null;
        expect(res.status).to.equal(200);
        //done();
      })
      .catch((err) => done(err));
      
      //let the member make a payment for the loan above
      request(app)
         .post('/payment')
         .send({
            "member_id": memberId,
            "loan_id": loanId,
            "amountPaid": 28000
         })
          .then((res) => {
            paymentId = res.body.newpayment._id;
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

  // Gets all---
  it('retreiving all payment records', (done) => {
    request(app)
      .get('/payment')
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Gets one ---
  it('retreiving a specific payment record', (done) => {
    if(paymentId){
    request(app)
      .get(`/payment/${paymentId}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
      }else{ done(); }
  });
  
  //Retrieve payments by a particular member and for a particular loan
  it('retrieving payments for a particular member', (done) => { 
    if(memberId && loanId){
    request(app)
      .get(`/payment/filtered/${memberId}?loan_id=${loanId}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
     }else{ done(); }
  });
  

  
});






