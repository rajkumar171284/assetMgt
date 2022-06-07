const express = require('express');
const router = express.Router();
const db = require('./dbConnection');
// const { signupValidation, loginValidation } = require('./validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/getAllUsersByCompanyID/:cid', (req, res) => {
    const id = req.params.cid;
    let sql = `SELECT * FROM user_tbl WHERE COMPANY_ID=${id}`;
    db.query(sql, (err, result) => {
        // console.log(result)
        if (err) throw err;
        else
            res.send({
                data:result,
                status:200
            })
    })
})


module.exports = router;