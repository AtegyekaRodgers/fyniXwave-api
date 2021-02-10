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

const user = require('./routes/user');
const auth = require('./routes/auth');
const home = require('./routes/home');
const index = require('./routes/index');
const content = require('./routes/contentRoutes');
const session = require('./routes/session');
const disciplines = require('./routes/disciplines'); 
const institution = require('./routes/institution');
const course = require('./routes/course');
const trainer = require('./routes/trainer');
const skill = require('./routes/skill');
const learner = require('./routes/learner');
const classs = require('./routes/classs');

// Routes
app.use('/home', home);
app.use('/user', user);
app.use('/auth', auth);
app.use('/user', user);
app.use('/contents', content);
app.use('/sessions', session);
app.use('/disciplines', disciplines);
app.use('/institution', institution);
app.use('/course', course);
app.use('/trainer', trainer);
app.use('/skill', skill);
app.use('/learner', learner);
app.use('/classs', classs);
// Routes for users without accounts
app.use('/', index);

// For non existent requests
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Making database connection to delv
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
