


//PROTEKSI MIDDLEWARE
const jwt = require ('jsonwebtoken');
// const accessToken = require('../routes/users')

function authenticateToken(req, res, next) {
  //ambil token dari HEADER
  const token = req.headers.authorization || req.cookies.accessToken;

  if (!token) { //tanpa token tidak diizinkan
    return res.status(401).json({ message: 'Unauthorized' });}
  //apakah token berasal dari AOKWKWK
  jwt.verify(token, 'AOKWAWK', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'token salah' });
    }
    req.user = user;
    next();
  });
}

module.exports =  {authenticateToken} ;
