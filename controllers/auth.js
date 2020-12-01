const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = require('../config/jwt');
const User = require('../models/user');

const login = () => {};
const logout = () => {};
const resetPassword = () => {};

module.exports = {
  login, logout, resetPassword,
};
