
const { makePaymentDb } = require('./payment-db');

const paymentDb = makePaymentDb();

module.exports = { paymentDb };
