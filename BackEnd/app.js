const express = require('express');
// const mysql = require('mysql');
const createError = require('http-errors');
// const PORT=3306;
const PORT=process.env.PORT | 3000;
const app = express();
const cors = require('cors');
const authRouter = require('./routes/auth.js');
const usersRouter = require('./routes/users.js');
const assetRouter = require('./routes/assets.js');
const bleRouter = require('./routes/ble.js');

var bodyParser = require('body-parser')
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(cors({
    origin: '*'
}));


app.use('/api', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/asset', assetRouter);
app.use('/api/asset', bleRouter);
// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

app.listen(PORT, () => {
    console.log('server on ',PORT)
})



// app.get('/getAllUsersByCompanyID/:cid', (req, res) => {
//     const id = req.params.cid;
//     let sql = `SELECT * FROM user_tbl WHERE COMPANY_ID=${id}`;
//     db.query(sql, (err, result) => {
//         console.log(result)
//         if (err) throw err;
//         else
//             res.send({
//                 data:result,
//                 status:200
//             })
//     })
// })
