const express = require('express');
const router = express.Router();
const db = require('./dbConnection');
// const { signupValidation, loginValidation } = require('./validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/getAllUsersByCompanyID', (req, res) => {
    const id = req.body.COMPANY_ID;
    let sql = `SELECT * FROM user_tbl WHERE COMPANY_ID=${id}`;
    let todo =[id]
    db.query(sql,todo, (err, result) => {
        // console.log(result)
        if (err) throw err;
        else
            res.send({
                data:result,
                status:200
            })
    })
})


router.post('/addUser', (req, res) => {
    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // update
        // console.log('update')
        sql = 'UPDATE user_tbl SET FIRST_NAME=?, LAST_NAME=?, LOGIN_NAME=?, PASSWORD=?, ROLE=?, WIDGETS_RIGHTS=?, COMPANY_ID = ?, MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.FIRST_NAME, req.body.LAST_NAME, req.body.LOGIN_NAME, req.body.PASSWORD, req.body.ROLE, req.body.WIDGETS_RIGHTS, req.body.COMPANY_ID, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = 'updated'
    } else {

        sql = `INSERT INTO user_tbl(PID, FIRST_NAME, LAST_NAME, PASSWORD, ROLE, WIDGETS_RIGHTS, COMPANY_ID, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?,?,?,?,?)`;
        todo = ['', req.body.FIRST_NAME, req.body.LAST_NAME, req.body.LOGIN_NAME, req.body.PASSWORD, req.body.ROLE, req.body.WIDGETS_RIGHTS,req.body.COMPANY_ID, req.body.CREATED_BY, new Date()];
        errMessage = 'added'
    }
    db.query(sql, todo, (err, result, fields) => {
        if (err) {
            throw err;
            return res.status(400).send({
                msg: err
            });
        }
        else {
            // if update config
                res.send({
                    data: result,
                    status: 200,
                    msg: `Record ${errMessage},successfully`
                })
        
        }
    })
})
module.exports = router;