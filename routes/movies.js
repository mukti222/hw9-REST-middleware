var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var pool = require('../db/query.js');
const {authenticateToken} = require('../middleware/middleware.js')


//PAGINATION GET DONE /SELECT
router.get('/', authenticateToken ,(req, res) => {
    // Extract query parameters 'page' and 'limit' from the request
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Calculate the offset based on the 'page' and 'limit'
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
router.use(bodyParser.json());
router.post('/', authenticateToken,(req, res) => {
  const { id, title, genres, year } = req.body;

  if (!id || !title || !genres || !year) {
    return res.status(400).json({ error: 'All fields required.' });}
  const query = 'INSERT INTO movies (id, title, genres, year) VALUES ($1, $2, $3, $4) RETURNING *';

  pool.query(query, [id, title, genres, year], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error inserting data into the database');
    }
    res.status(201).json(result.rows[0]); // Return the newly inserted movie
  });
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

