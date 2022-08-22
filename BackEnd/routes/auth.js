const express = require('express');
const router = express.Router();
const db = require('./dbConnection');
// const { signupValidation, loginValidation } = require('./validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// // auth
router.post('/asset/login', (req, res) => {

    const LOGIN_NAME = req.body.LOGIN_NAME;
    const PASSWORD = req.body.PASSWORD;

    const sql = 'SELECT user_tbl.*,company_tbl.COMPANY_TYPE,company_tbl.COMPANY_NAME FROM user_tbl LEFT JOIN company_tbl ON user_tbl.COMPANY_ID= company_tbl.PID WHERE user_tbl.LOGIN_NAME=? AND user_tbl.PASSWORD=?';
    let todo = [LOGIN_NAME, PASSWORD];
    db.query(sql, todo, (err, result) => {

        if (err) {
            // throw err;
            // return res.status(400).send({
            //     msg: err
            // });
            err.statusCode = err.statusCode || 401;
            return res.status(err.statusCode).send({ message: err.message });
        }
        else {
            // console.log('LoggedIn', result)
            if (result.length > 0) {
                // found
                res.send({
                    data: result,
                    status: 200
                })

            } else {
                // no user match
                res.send({
                    data: result,
                    status: 201,
                    msg: 'No user exists.'
                })
            }
        }
    })
})



module.exports = router;