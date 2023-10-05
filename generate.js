const jwt = require ('jsonwebtoken');

const generateAccessToken = (email) => {
  return jwt.sign({ email }, 'AOKWAWK', { expiresIn: '1h' });
}

module.exports = { generateAccessToken }