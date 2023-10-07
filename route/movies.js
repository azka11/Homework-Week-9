const express = require('express');
const router = express.Router();
const pool = require('../queries.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.get('', authMiddleware, (req, res) => {
    const num = req.query.page - 1;
    const limit = 10;
    const offset = num * limit;

    pool.query(`SELECT * FROM movies ORDER BY id ASC OFFSET ${offset} LIMIT ${limit}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json( {message: "Terjadi Kesalahan Server"} );
        }
        res.status(200).json(result.rows);
    })
});

router.get('/:id', (req, res) => {
   const moviesId = req.params.id

    pool.query(`SELECT * FROM movies WHERE id = $1`, [moviesId], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json( {message: "Terjadi Kesalahan Server"} );
        }
        res.status(200).json( {message: "Data Movies Connected" , movies: result.rows[0]} );
    })
});

router.post('/', authMiddleware, (req, res) => {
    const { id, title, genres, year } = req.body;
    if(!title || !genres || !year){
        res.status(400);
        res.json( {message: "Bad Request"} );
    }

    pool.query(`INSERT INTO movies(id, title, genres, year) VALUES ($1, $2, $3, $4) RETURNING *`, [id, title, genres, year], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json( {message: "Terjadi Kesalahan Server"} );
        }
        res.status(200).json( {message: "New Movie Created", movies: result.rows[0]} );
    })
    
});

router.put('/:id', authMiddleware, (req, res) => {
    const movieId = req.params.id;
    const {title, genres, year } = req.body;
    if (!title || !genres || !year) {
        res.status(400);
        res.json( {message: "Bad Request"} );
    } 

    pool.query(`UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4 RETURNING *`, [title, genres, year, movieId], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json( {message: "Terjadi Kesalahan Server"} );
        }

        if (result === 0) {
            return res.status(404).json( {message: "Film Tidak Ditemukan"} );
        }
        res.status(200).json( {message: "Movie New Update", movies: result.rows[0]} );
    })
    
});

router.delete('/:id', authMiddleware, (req, res) => {
    const movieId = req.params.id;

    pool.query(`DELETE FROM movies WHERE id = $1 RETURNING *`, [movieId], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json( {message: "Terjadi Kesalahan Server"} );
        }
        
        if(result === 0){
            return res.status(404).json( {message: "Film Tidak Ditemukan"} );

        }
        res.status(200).json( {message: "Movie Deleted", movies: result.rows[0]} );
    })

});

module.exports = router;