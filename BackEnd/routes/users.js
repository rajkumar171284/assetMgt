const express = require('express');
const router = express.Router();
const db = require('./dbConnection');
// const { signupValidation, loginValidation } = require('./validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
var uuid = require('uuid');
const config = require('../config');
var path = require("path");
const url = require("url");

// img upload
// const multer = require('multer');
// var fileExtension = require('file-extension')

// Configure Storage
// const DIR = '../public';
// var storage = multer.diskStorage({

//     // Setting directory on disk to save uploaded files
//     destination: function (req, file, cb) {
//         cb(null, DIR)
//     },

//     // Setting name of file saved
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
//     }
// })

// var upload = multer({
//     storage: storage,
//     limits: {
//         // Setting Image Size Limit to 2MBs
//         fileSize: 20000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             //Error 
//             cb(new Error('Please upload JPG and PNG images only!'))
//         }
//         //Success 
//         cb(undefined, true)
//     }
// })

// const storageFile = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, DIR)
//     },
//     filename: (req, file, cb) => {
//         console.log(file)
//         let fileName = file.originalname.toLowerCase().split(' ').join('-');
//         fileName = fileName.replace(/(\.[\w\d_-]+)$/i, '_' + Date.now() + '$1');
//         cb(null, file)
//     }
// });
// const uploadFile = multer({
//     storage: storageFile, limits: {
//         fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
//             cb(null, true);
//         } else {
//             req.fileTypeErr = 'Only png,jpeg,jpg';
//             // cb(null,false);
//             return cb(null, false, req.fileTypeErr);
//         }
//     }
// });


router.post('/getCompanyByID', (req, res) => {
    let sql = 'SELECT * FROM company_tbl WHERE PID=?';
    let todo = [req.body.COMPANY_ID]
    db.query(sql, todo, (err, result) => {

        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})

router.post('/getAllCompanyByType', (req, res) => {
    let sql = 'SELECT * FROM company_tbl WHERE COMPANY_TYPE=?';
    let todo = [req.body.COMPANY_TYPE]
    db.query(sql, todo, (err, result) => {

        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})
router.get('/getAllCompanies', (req, res) => {
    let sql = 'SELECT * FROM company_tbl';
    let todo = [req.body.COMPANY_TYPE]
    db.query(sql, todo, (err, result) => {

        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})

// const uploadNew = multer({ dest: DIR });

// router.post('/uploadfile', uploadNew.single('logo'), function (req, res) {
//     console.log(req);
//     const file = req.file
//     //
//     if (!file) {
//         const error = new Error('Please upload a file')
//         error.httpStatusCode = 400
//         return error
//     }
//     res.status(200).send({
//         statusCode: 200,
//         status: 'success',
//         uploadedFile: file
//     })

// }, (error, req, res, next) => {
//     res.status(400).send({
//         error: error.message
//     })
// })

router.post('/addCompanyLogo', function (req, res) {

    if (!req.files) {
        return res.status(400).send('No file uploaded..');
    }
    let filepath;
    let file;
    file = req.files.logo;
    
    if (file.mimetype != "image/jpeg" && file.type != "image/jpg" && file.mimetype != "image/png") {
        return res.status(302).send('Only png,jpg & jpeg allowed..');
    }

    filepath = path.join(__dirname, "../");
    filepath = filepath + "/images/" + file.name;
    // console.log(filepath)
    // use mv function to save in serve folder
    file.mv(filepath, function (err) {
        if (err) return res.status(500).send(err)
        res.send({ msg: 'Upload done.', status: 200 })
    });


});
router.post('/addCompany', (req, res) => {
    let sql;
    let todo;
    let errMessage;
    let file = req.body.LOGO;

    var imgsrc = file;
    if (req.body.PID) {
        // update
        sql = 'UPDATE company_tbl SET COMPANY_NAME=?, COMPANY_ADDRESS_LINE1=?, COMPANY_ADDRESS_LINE2=?, COMPANY_TYPE=?, STATUS=?, LOGO=?,APP_SOLUTION_NAME=?, MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.COMPANY_NAME, req.body.COMPANY_ADDRESS_LINE1, req.body.COMPANY_ADDRESS_LINE2, req.body.COMPANY_TYPE, req.body.STATUS, imgsrc, req.body.APP_SOLUTION_NAME, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = 'updated';
    } else {

        sql = `INSERT INTO company_tbl(PID, COMPANY_NAME, COMPANY_ADDRESS_LINE1, COMPANY_ADDRESS_LINE2, COMPANY_TYPE, STATUS, LOGO,APP_SOLUTION_NAME, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        todo = ['', req.body.COMPANY_NAME, req.body.COMPANY_ADDRESS_LINE1, req.body.COMPANY_ADDRESS_LINE2, req.body.COMPANY_TYPE, req.body.STATUS, imgsrc, req.body.APP_SOLUTION_NAME, req.body.CREATED_BY, new Date()];
        errMessage = 'added';
    }
    db.query(sql, todo, (err, result, fields) => {
        if (err) {
            // throw err;
            return res.status(400).send({
                msg: err
            });
        }
        else {
            res.send({
                data: result,
                status: 200,
                msg: `Record ${errMessage},successfully`
            })
        }
    })
})

router.post('/deleteCompany/:PID', (req, res) => {
    const PID = req.params.PID;

    let sql = `DELETE FROM company_tbl WHERE PID=${PID}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200,
                msg: 'Record deleted.'
            })
    })
})
router.post('/deleteUserByID/:PID', (req, res) => {
    const PID = req.params.PID;

    let sql = `DELETE FROM user_tbl WHERE PID=${PID}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200,
                msg: 'Record deleted.'
            })
    })
})
router.post('/getAllUsersByCompanyID', (req, res) => {
    const id = req.body.COMPANY_ID;
    let sql = `SELECT * FROM user_tbl WHERE COMPANY_ID=${id}`;
    let todo = [id]
    db.query(sql, todo, (err, result) => {
        // console.log(result)
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})


router.post('/addUser', (req, res) => {
    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // update

        sql = 'UPDATE user_tbl SET FIRST_NAME=?, LAST_NAME=?, LOGIN_NAME=?, PASSWORD=?, ROLE=?, WIDGETS_RIGHTS=?, COMPANY_ID = ?, MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.FIRST_NAME, req.body.LAST_NAME, req.body.LOGIN_NAME, req.body.PASSWORD, req.body.ROLE, req.body.WIDGETS_RIGHTS, req.body.COMPANY_ID, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = 'updated'
    } else {

        sql = `INSERT INTO user_tbl(PID, FIRST_NAME, LAST_NAME,LOGIN_NAME, PASSWORD, ROLE, WIDGETS_RIGHTS, COMPANY_ID, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        todo = ['', req.body.FIRST_NAME, req.body.LAST_NAME, req.body.LOGIN_NAME, req.body.PASSWORD, req.body.ROLE, req.body.WIDGETS_RIGHTS, req.body.COMPANY_ID, req.body.CREATED_BY, new Date()];
        errMessage = 'added'
    }
    db.query(sql, todo, (err, result, next) => {
        if (err) {
            // throw err;
            err.statusCode = err.statusCode || 401;
            return res.status(err.statusCode).send({ message: err.message });
            // return res.status(400).send({
            //     msg: err
            // });
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