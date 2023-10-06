var express = require('express');
var morgan = require('morgan');
var app = express();
var pool = require('./db/query.js')
var swaggerjsdoc = require('swagger-jsdoc')
var swaggerui = require('swagger-ui-express')

app.use(morgan('tiny'));
app.use(morgan('common'));

//swagger
//JWT HEADER authorization WAJIB PAKE COMPONENT SECURITY
const options = {
    definition: {
        openapi: "3.0.0",
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT", 
                },
            },
        },
        
        security: {
            bearerAuth: []
        },
        info: {
        title: "CRUD movies users - Haryo Mukti",
        version: "1.0.0",
        description: "berisi dokumentasi CRUD postman operasi moviesdatabase",
        },
        servers: [
            {
                url: "http://localhost:3000/",
            },
        ],
    },
apis: ["./routes/*.js"],}
const spacs = swaggerjsdoc(options)
app.use(
    "/api-docs",
    swaggerui.serve,
    swaggerui.setup(spacs)
)

//hubungin routes ke sini
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



