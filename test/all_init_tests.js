const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('initial tests', () => {
  let memberId;
  let loanId;
  let paymentId;
  
  before((done) => {
    dbConnect().then(() => done()).catch((err) => done(err)); 
  }); 
  
  after((done) => {
    dbClose()
      .then(() => done())
      .catch((err) => done(err));
  });
  
  //Registers a member ---
  it('registering a new member', (done) => {
    request(app)
     .post('/member')
     .send({
        "firstname": "Kabagambe",
        "lastname": "Kened"
     })
      .then((res) => {
        memberId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });
  
  //Creates a new loan record ---
  it('recording a new loan', (done) => {
    request(app)
     .post('/loan')
     .send({
        "member_id": memberId,
        "principalAmount": 100000
     })
      .then((res) => {
        loanId = res.body.newloan._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });
  
  //Creates a new payment record ---
  it('recording a new payment', (done) => {
    request(app)
     .post('/payment')
     .send({
        "member_id": memberId,
        "loan_id": loanId,
        "amountPaid": 25000
     })
      .then((res) => {
        paymentId = res.body.newpayment._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

});






