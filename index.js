var express = require('express');
var bodyParser = require('body-parser');
// var morgan = require('morgan');
var app = express();
var pool = require('./db/query.js')

// app.use(morgan('common'));
// require('dotenv').config();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


var movies = require('./routes/movies');
var users = require('./routes/users.js');


app.use('/movies', movies);
app.use('/users', users);

pool.connect((err, res) => {
    if(err){
        console.log(err.message);
    } else {
        console.log('res - connected');
    }
})

app.listen(3000, () => {
    console.log(`Server runned`);
  });