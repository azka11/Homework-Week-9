const Pool = require('pg').Pool;

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'movies_db',
    password: 'popok098',
    port: 5432
})

module.exports = pool;