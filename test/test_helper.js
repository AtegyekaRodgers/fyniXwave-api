const {
  before, after,
} = require('mocha');
const { dbConnect } = require('../config/db');

before((done) => {
  // Connecting to mock database
  dbConnect()
    .then(() => done())
    .catch((err) => done(err));
});