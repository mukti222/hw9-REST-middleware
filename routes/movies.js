const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../db/query.js');
const { authenticateToken } = require('../middleware/middleware.js');
const cookieParser = require('cookie-parser'); // Add this line

// Use cookie-parser middleware
router.use(cookieParser());


//PAGINATION GET DONE /SELECT
router.get('/', authenticateToken ,(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const offset = (page - 1) * limit;
  
    pool.query(
      'SELECT * FROM movies LIMIT $1 OFFSET $2',
      [limit, offset],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error fetching data from the database');
        } else {
          res.json(results.rows);
        }
      }
    );
  });


//POST DONE / INSERT
//Logika : ambil id terakhir dari database lalu ID terakhir tsb ditambah 1 menjadi newId
//newId tersebut akan menjadi Id user baru yang akan didaftarkan
//mendaftar perlu memasukan title, genres, year
router.use(bodyParser.json());
router.post('/', authenticateToken, async (req, res) => {
  const { title, genres, year } = req.body;

  try {
    // Mengambil ID terakhir dari database
    const lastMovie = await pool.query('SELECT id FROM movies ORDER BY id DESC LIMIT 1');
    let newId = 1; // Nilai default jika tabel kosong

    if (lastMovie.rows.length > 0) {
      newId = lastMovie.rows[0].id + 1;
    }

    const query = 'INSERT INTO movies (id, title, genres, year) VALUES ($1, $2, $3, $4) RETURNING *';
    
    // Insert data baru ke database
    const result = await pool.query(query, [newId, title, genres, year]);

    res.status(201).json(result.rows[0]); // Mengembalikan data movie yang baru dimasukkan
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});


//PUT/ UPDATE DONE
router.put('/:id', authenticateToken,(req, res) => {
  const { id } = req.params;
  const { title, genres, year } = req.body;

  if (!title || !genres || !year) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = 'UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4 RETURNING *';
  pool.query(query, [title, genres, year, id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error updating data in the database');
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(result.rows[0]); // Return the updated movie
  });
});

//DELETE done
router.delete('/:id', authenticateToken,(req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM movies WHERE id = $1 RETURNING *';

  pool.query(query, [id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error deleting data from the database');
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  });
});


module.exports = router


/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get a list of movies
 *     description: Retrieve a list of movies with pagination. but first you need to AUTHORIZE (green lock icon) using accessToken
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *   post:
 *     summary: Create a new movie
 *     description: Create a new movie with the provided details.
 *     tags:
 *       - Movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genres:
 *                   type: string
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: string
 *                 year:
 *                   type: integer
 * /movies/:id:
 *   put:
 *     summary: Update a movie by ID
 *     description: Update a movie's title, genres, and year by ID.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the movie to update
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: movie
 *         description: Movie data to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: New title of the movie
 *             genres:
 *                 type: string
 *             year:
 *               type: integer
 *               description: New release year of the movie
 *     responses:
 *       200:
 *         description: Successful update, returns the updated movie
 *       400:
 *         description: Bad request, missing or invalid input
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a movie by ID
 *     description: Delete a movie record from the database by its ID.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the movie to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         genres:
 *             type: string
 *         year:
 *           type: integer
 */

