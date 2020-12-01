const { expect } = require('chai');
const { describe, it } = require('mocha');
const request = require('supertest');
const app = require('../app');

describe('index', () => {
  it('gives welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.body.message).to.equal('Welcome to delv api');
    expect(res.status).to.equal(200);
  });
});
