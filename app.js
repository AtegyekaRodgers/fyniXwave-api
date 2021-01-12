const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { dbConnect } = require('./config/db');

const app = express();
app.use(cors());
// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type
app.use(bodyParser.urlencoded({ extended: true }));

const user = require('./routes/user');
const auth = require('./routes/auth');
const content = require('./routes/contentRoutes');
const session = require('./routes/session');
const disciplines = require('./routes/disciplines');

// require routes
// const uploadContentRoutes = require('./routes/contentRoutes');

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to delv api' });
});

// Routes
app.use('/user', user);
app.use('/auth', auth);
app.use('/contents', content);
app.use('/sessions', session);
app.use('/disciplines', disciplines);

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
