const {
  before, after,
} = require('mocha');
const { dbConnect, dbClose } = require('../config/db');

before((done) => {
  // Connecting to mock database
  dbConnect()
    .then(() => done())
    .catch((err) => done(err));
});

after((done) => {
  dbClose()
    .then(() => done())
    .catch((err) => done(err));
});
