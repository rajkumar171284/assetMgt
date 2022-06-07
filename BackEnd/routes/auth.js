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

    const sql = `SELECT * FROM user_tbl WHERE LOGIN_NAME='${LOGIN_NAME}'`;
    db.query(sql, (err, result) => {
        // console.log(result)
        if (err) {
            throw err;
            return res.status(400).send({
                msg: err
            });
        }
        else {
            console.log('LoggedIn')
            if (result.length > 0) {
                // found
                const sql = `SELECT * FROM user_tbl WHERE PASSWORD='${PASSWORD}'`;
                db.query(sql, (err, result) => {
                    if (err) {
                        throw err;
                        return res.status(400).send({
                            msg: err
                        });
                    }
                    else {
                        console.log('LoggedIn')
                        res.send({
                            data: result,
                            status: 200
                        })
                    }
                })

            } else {
                // no user match
                res.send({
                    data: result,
                    status: 201,
                    msg:'No User found'
                })
            }
        }
    })
})

// router.post('/asset/login2', (req, res, next) => {
//     const LOGIN_NAME = req.body.LOGIN_NAME;
//     const PASSWORD = req.body.PASSWORD;

//     let sql = `SELECT * FROM user_tbl WHERE LOGIN_NAME=${LOGIN_NAME}`;

//     db.query(sql, (err, result) => {
//         // user does not exists
//         if (err) {
//             throw err;
//             return res.status(400).send({
//                 msg: err
//             });
//         }
//         if (!result.length) {
//             return res.status(401).send({
//                 msg: 'Email or password is incorrect!'
//             });
//         }
//         // check password
//         bcrypt.compare(
//             req.body.password,
//             result[0]['password'],
//             (bErr, bResult) => {
//                 // wrong password
//                 if (bErr) {
//                     throw bErr;
//                     return res.status(401).send({
//                         msg: 'Email or password is incorrect!'
//                     });
//                 }
//                 if (bResult) {
//                     const token = jwt.sign({ id: result[0].id }, 'the-super-strong-secrect', { expiresIn: '1h' });
//                     db.query(
//                         `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
//                     );
//                     return res.status(200).send({
//                         msg: 'Logged in!',
//                         token,
//                         user: result[0]
//                     });
//                 }
//                 return res.status(401).send({
//                     msg: 'Username or password is incorrect!'
//                 });
//             }
//         );
//     }
//     );
// });

module.exports = router;