const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { dbConnect } = require('./config/db');

const app = express();

app.use(cors());

// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type
app.use(bodyParser.urlencoded({ extended: true }));

const member = require('./routes/member');
const loan = require('./routes/loan');
const payment = require('./routes/payment');

// Routes
app.use('/member', member);
app.use('/loan', loan);
app.use('/payment', payment);

// For non existent requests
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Making database connection to api
try {
  dbConnect();
  console.log('Mongoose connection open');
} catch (error) {
  console.error(`Connection error: ${error.message}`);
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;


