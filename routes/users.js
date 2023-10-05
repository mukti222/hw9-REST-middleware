var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var pool = require('../db/query');
router.use(bodyParser.json());
var { generateAccessToken } = require ('../generate')
var cookieParser = require('cookie-parser')




//SIGNIN
// Sign in and generate JWT // ENKRIPSI EMAIL PASSWORD MENJADI TOKEN RANDOM
router.use(cookieParser());
router.post('/signin', async (req, res) => {
  const email = req.body.gmail;
  const password = req.body.password;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);

    // Generate and return a JWT using the imported function
    const accessToken = generateAccessToken(result.rows[0].email);
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router