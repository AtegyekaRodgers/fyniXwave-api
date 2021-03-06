const { expect } = require('chai');
const request = require('supertest');
const { before, after, describe, it } = require('mocha');

const app = require('../app');
const { dbConnect, dbClose } = require('../config/db');

describe('tests for discussion meetings', () => {
  let token; 
  let discussionMeetingId;
  
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
  it('creating a discussion meeting', (done) => {
    request(app)
     .post('/discussionmeeting')
     .send({
        "disMeetingName": "Discussion group 3",
        "remote": true,
        "venue": "CoCIS Makerere",
        "theme": "Encouragement at the core",
        "sponsoredBy": ["Well wisher 1", "MTN", "Delv"], //optional
        "startDate": "2021-03-17",
        "startTime": "12:00:00",
        "duration": "2 hours", //optional
        "parentMeeting": "603f7a74efc9d14364393f3b", //must be a valid group id
        "meetingLink": "https://zoom.meetings.com/d/78587732"  //url link to external meeting platform such as zoom
    })
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        discussionMeetingId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  // Get all---
  it('reading/retreiving all discussoin meetings', (done) => {
    request(app)
      .get('/discussionmeeting')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  // Get one ---
  it('get specific discussion meeting', (done) => {
    request(app)
      .get(`/discussionmeeting/${discussionMeetingId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});






