
//PROTEKSI MIDDLEWARE
const jwt = require ('jsonwebtoken');
// const accessToken = require('../routes/users')

function authenticateToken(req, res, next) {
  const tokenHeader = req.headers.authorization || req.cookies.accessToken;
  console.log(tokenHeader);

  if (!tokenHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  let token = tokenHeader;
  
  // apakah token ada "Bearer " jika ya maka hilangin
  if (tokenHeader.startsWith('Bearer ')) {
    token = tokenHeader.slice(7);
  }

  //apakah token berasal dari AOKWKWK
  jwt.verify(token, 'AOKWAWK', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'token salah' });
    }
    req.user = user;
    next();
  });
}


module.exports = { authenticateToken };

