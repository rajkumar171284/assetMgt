const express = require('express');
const router = express.Router();
const db = require('./dbConnection');

// insert ble data
router.post('/addMACdata', (req, res) => {
    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // update
        // console.log('update')
        // sql = 'UPDATE asset_config_tbl SET CONFIG_NAME=?, ASSET_ID=?, INDUSTRIAL_TYPE=?, INDUSTRIAL_DATA_SOURCE=?, CONNECTION_TYPE=?, TRACKING_DEVICE=?, SENSOR=?, SENSOR_CATEGORY=?, SENSOR_DATA_TYPE=?, MAC_ADDRESS=?, COMPANY_ID = ?, MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        // todo = [req.body.CONFIG_NAME, req.body.ASSET_ID, req.body.INDUSTRIAL_TYPE, req.body.INDUSTRIAL_DATA_SOURCE, req.body.CONNECTION_TYPE, req.body.TRACKING_DEVICE, req.body.SENSOR, req.body.SENSOR_CATEGORY, req.body.SENSOR_DATA_TYPE, req.body.MAC_ADDRESS, req.body.COMPANY_ID, req.body.CREATED_BY, new Date(), req.body.PID];
        // errMessage = 'updated'
    } else {
        sql = `INSERT INTO mac_address_status_tbl(PID, MAC_ADDRESS_ID, VALUE, STATUS, CONNECTION_TYPE,MAC_ADDRESS, CREATED_DATE) VALUES (?,?,?,?,?,?,?)`;
        todo = ['', req.body.MAC_ADDRESS_ID, req.body.VALUE, req.body.STATUS, req.body.CONNECTION_TYPE, req.body.MAC_ADDRESS,new Date()];
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