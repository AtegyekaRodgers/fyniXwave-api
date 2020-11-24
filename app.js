const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { dbConnect } = require('./config/db');
require('./models/user');

const user = require('./routes/user');

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type
app.use(bodyParser.urlencoded({ extended: true }));

// require routes
const mentorsRoutes = require('./routes/mentorsroutes');

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to delv api' });
});

// simple route
app.use('/user', user);
app.use('/addcontent', mentorsRoutes);

// Making database connection to delv
try {
  dbConnect();
  console.log('Mongoose connection open');
} catch (error) {
  console.error(`Connection error: ${error.message}`);
}

// path
app.use('/public/content', express.static(path.join(__dirname, 'public/content')));

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
