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
  const email = req.body.email;
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

//REGISTER
//Logika : ambil id terakhir dari database lalu ID terakhir tsb ditambah 1 menjadi newId
//newId tersebut akan menjadi Id user baru yang akan didaftarkan
//mendaftar perlu memasukan email, gender, password, role
router.post('/register', async (req, res) => {
  const { email, gender, password, role } = req.body;

  try {
    // Mengambil ID terakhir dari database
    const lastUser = await pool.query('SELECT id FROM users ORDER BY id DESC LIMIT 1');
    let newId = 1;

    // newId = id terakhir + 1
    if (lastUser.rows.length > 0) {
      newId = lastUser.rows[0].id + 1;
    }

    // Insert pengguna baru ke database
    await pool.query('INSERT INTO users (id, email, gender, password, role) VALUES ($1, $2, $3, $4, $5)', [
      newId,
      email,
      gender,
      password,
      role,
    ])

    res.status(201).json({ message: 'Pengguna terdaftar' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});



/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Sign in and generate JWT
 *     description: Generates a JSON Web Token (JWT) after successful sign-in.
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful sign-in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided details.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               gender:
 *                 type: string
 *                 description: Gender of the user
 *               password:
 *                 type: string
 *                 description: Password for the user
 *               role:
 *                 type: string
 *                 description: Role of the user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request, missing or invalid input
 *       500:
 *         description: Internal server error

 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SigninRequest:
 *       type: object
 *       properties:
 *         gmail:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - gmail
 *         - password
 *     SigninResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */


module.exports = router