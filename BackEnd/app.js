const express = require('express');
// const mysql = require('mysql');
const createError = require('http-errors');
const PORT = process.env.PORT | 4201;
const app = express();
const cors = require('cors');
const authRouter = require('./routes/auth.js');
const usersRouter = require('./routes/users.js');
const assetRouter = require('./routes/assets.js');
const bleRouter = require('./routes/ble.js');
const mqttRouter = require("./routes/mqtt.js");
const mapRouter = require("./routes/maps.js");

const fileUpload = require('express-fileupload');

var bodyParser = require('body-parser')
var http = require('http');
const server = http.createServer(app)

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(function (req, res, next) {
//     res.header('Content-Type', 'application/json');
//     next();
// });
app.use(fileUpload());

app.use(cors({
    origin: '*'
}));


app.use('/api', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/asset', assetRouter);
app.use('/api/asset', bleRouter);
app.use('/api/mqtt', mqttRouter);
app.use('/api/maps', mapRouter);
// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

// app.listen(PORT, () => {
//     console.log('server on ',PORT)
// })
server.listen(PORT, '127.0.0.1', function () {
    server.close(function () {
        server.listen(8001, '10.1.1.139')
    })
})