const express = require('express');
const router = express.Router();
const pool = require('../queries.js');
const { signToken } = require('../utils/auth.js');
const authMiddleware = require('../middleware/authMiddleware.js');


router.get(``, authMiddleware, (req, res) => {
    const num = req.query.page - 1;
    const limit = 10;
    const offset = num * limit;

    pool.query(`SELECT * FROM users ORDER BY id ASC OFFSET ${offset} LIMIT ${limit}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json( {message: "Terjadi Kesalahan Server"} );
        }
        res.status(200).json(result.rows);
    })
});

router.post('/login', (req, res) => {
    pool.query(`SELECT * FROM users WHERE email = $1 AND password = $2`, 
    [req.body.email, req.body.password], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json( {message: "Terjadi Kesalahan Server"} );
        } else {
            const token = signToken(result.rows[0]);
            res.json({
                token: token,
            });
        }
    })
});


router.post('/register', (req, res) => {
    const {id, email, password, gender, role} = req.body;
    if(!email || !password || !gender || !role) {
        res.status(400);
        res.json( {message: "Bad Request"} );
    }

    pool.query(`INSERT INTO users(id, email, password, gender, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [id, email, password, gender, role], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json( {message: "Terjadi Kesalahan Server"} );
        }
        res.status(200).json( {message: "Register Success", users: result.rows[0]} );
    })
});

router.get('/:id', (req, res) => {
    const usersId = req.params.id
    pool.query(`SELECT * FROM users WHERE id = $1`, [usersId], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json( {message:  "Terjadi Kesalahan Server"} );
        }
        res.status(200).json( {message: "Data Users Connected" , users: result.rows[0]} );
    })
});

module.exports = router;