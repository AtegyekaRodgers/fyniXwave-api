const mongoose = require('mongoose');
const { Mockgoose } = require('mockgoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

const dbConnect = () => new Promise((resolve, reject) => {
  if (process.env.NODE_ENV === 'test') {
    const mockgoose = new Mockgoose(mongoose);
    mockgoose.helper.setDbVersion('4.2.10');
    mockgoose.prepareStorage()
      .then(() => {
        mongoose.connect(process.env.DATABASE, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        })
          .then((res, err) => {
            if (err) return reject(err);
            return resolve();
          });
      }).catch(reject);
  } else {
    mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
      .then((res, err) => {
        if (err) return reject(err);
        return resolve();
      });
  }
});

const dbClose = () => mongoose.disconnect();

module.exports = { dbConnect, dbClose };
