const { expect } = require('chai');
const request = require('supertest');
const { describe, it, afterEach } = require('mocha');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const app = require('../app');

describe('create user', () => {
  it('should create new user', async () => {
    const res = await request(app).post('/user/')
      .send({
        firstname: 'FName',
        lastname: 'LName',
        username: 'Username',
        password: '*******',
        email: 'mentor@delv.ac.ug',
        phonenumber: '07xxxxxxxx',
        usercategory: 'mentor',
      });
    expect(res.status).to.equal(200);
  });
  afterEach(async () => {
    await User.deleteOne({ firstname: 'FName' });
  });
});
