const express = require('express');
const morgan = require('morgan');

const app = express(); 

const bodyParser = require('body-parser');
const pool = require('./queries.js');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const documentation = require('./documentation/swagger.json')
const movies = require('./route/movies.js');
const users = require('./route/users.js');

app.use(morgan('common'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentation, { explorer: true }));

app.get('/', (req, res) => {
    res.send('Halaman Utama !!')
});

pool.connect((err, res) => {
    if (err){
        throw err;
    }
    console.log('Connected');
});

app.use('/movies', movies);
app.use('/users', users);

app.listen(3000, function(){
    console.log('Server OK !');
});