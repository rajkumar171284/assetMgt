const express = require('express');
const router = express.Router();
const db = require('./dbConnection');
// const { signupValidation, loginValidation } = require('./validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// // 


router.post('/addAssetConfig', (req, res) => {
    let sql;
    let todo;
    let errMessage;
    let MAC_DETAILS = []
    if (req.body.PID) {
        // update
        // console.log('update')
        sql = 'UPDATE asset_config_tbl SET CONFIG_NAME=?, ASSET_ID=?, INDUSTRIAL_TYPE=?, INDUSTRIAL_DATA_SOURCE=?, CONNECTION_TYPE=?, TRACKING_DEVICE=?, SENSOR=?, SENSOR_CATEGORY=?, SENSOR_DATA_TYPE=?, MAC_ADDRESS=?, COMPANY_ID = ?, MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.CONFIG_NAME, req.body.ASSET_ID, req.body.INDUSTRIAL_TYPE, req.body.INDUSTRIAL_DATA_SOURCE, req.body.CONNECTION_TYPE, req.body.TRACKING_DEVICE, req.body.SENSOR, req.body.SENSOR_CATEGORY, req.body.SENSOR_DATA_TYPE, req.body.MAC_ADDRESS, req.body.COMPANY_ID, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = 'updated'
    } else {
        MAC_DETAILS = req.body.MAC_DETAILS;

        sql = `INSERT INTO asset_config_tbl(PID, CONFIG_NAME, ASSET_ID, INDUSTRIAL_TYPE, INDUSTRIAL_DATA_SOURCE, CONNECTION_TYPE, TRACKING_DEVICE, SENSOR, SENSOR_CATEGORY, SENSOR_DATA_TYPE, MAC_ADDRESS, COMPANY_ID, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,? , ? )`;
        todo = ['', req.body.CONFIG_NAME, req.body.ASSET_ID, req.body.INDUSTRIAL_TYPE, req.body.INDUSTRIAL_DATA_SOURCE, req.body.CONNECTION_TYPE, req.body.TRACKING_DEVICE, req.body.SENSOR, req.body.SENSOR_CATEGORY, req.body.SENSOR_DATA_TYPE, req.body.MAC_ADDRESS, req.body.COMPANY_ID, req.body.CREATED_BY, new Date()];
        errMessage = 'added'
    }
    db.query(sql, todo, (err, result, fields) => {
        if (err) {
            // throw err;
            return res.status(400).send({
                msg: err
            });
        }
        else {
            // if update config
            if (req.body.PID) {
                res.send({
                    data: result,
                    status: 200,
                    msg: `Record ${errMessage},successfully`
                })
            } else {

                // after asset config inserted then need to save mac details in mac_tbl
                let sql2;
                let todo2;
                let errMessage2 = 'added';

                sql2 = "INSERT INTO `mac_tbl`(`PID`, `ASSET_CONFIG_ID`, `MAC_NAME`,`MAC_ADDRESS`, `MAC_STATUS`, `LOCATION`, `CREATED_BY`, `CREATED_DATE`) VALUES ?";
                todo2 = [MAC_DETAILS.map(item => ['', result.insertId, item.MAC_NAME, item.MAC_ADDRESS, item.MAC_STATUS, item.LOCATION, req.body.CREATED_BY, new Date()])]

                db.query(sql2, todo2, (err, result2) => {
                    if (err) {
                        throw err;
                        return res.status(400).send({
                            msg: err
                        });
                    }
                    else {

                        res.send({
                            data: result2,
                            status: 200,
                            msg: `Record ${errMessage2},successfully`
                        })
                    }
                })
            }

        }
    })
})

// mac add
router.post('/addMACByConfigID', (req, res) => {
    let sql;
    let todo;
    const MAC_DETAILS = req.body.MAC_DETAILS;
    let errMessage = 'added';

    sql = "INSERT INTO `mac_tbl`(`PID`, `ASSET_CONFIG_ID`, `MAC_NAME`,`MAC_ADDRESS`, `MAC_STATUS`, `LOCATION`, `CREATED_BY`, `CREATED_DATE`) VALUES ?";
    todo = [MAC_DETAILS.map(item => ['', req.body.PID, item.MAC_NAME, item.MAC_ADDRESS, item.MAC_STATUS, item.LOCATION, req.body.CREATED_BY, new Date()])]

    db.query(sql, todo, (err, result) => {

        if (err) {
            throw err;
            return res.status(400).send({
                msg: err
            });
        }
        else {
            res.send({
                data: result,
                status: 200,
                msg: errMessage
            })

        }
    })


})
router.post('/updateDeviceByID', (req, res) => {
    let sql;
    let todo;
    const MAC_DETAILS = req.body.MAC_DETAILS;
    let errMessage = 'updated';


    sql = "UPDATE mac_tbl SET MAC_NAME=?,MAC_ADDRESS=?, MAC_STATUS=?, LOCATION=?, MODIFY_BY=?, MODIFY_DATE=? WHERE PID=?";
    todo = [MAC_DETAILS[0].MAC_NAME, MAC_DETAILS[0].MAC_ADDRESS, MAC_DETAILS[0].MAC_STATUS, MAC_DETAILS[0].LOCATION, req.body.CREATED_BY, new Date(), MAC_DETAILS[0].PID];
    // todo = [MAC_DETAILS.map(item => [item.MAC_NAME, item.MAC_ADDRESS, item.MAC_STATUS, item.LOCATION, req.body.CREATED_BY, new Date(), item.PID])]
    // console.log(todo)
    db.query(sql, todo, (err, result) => {

        if (err) {
            // console.log(result, err)

            // throw err;
            return res.status(400).send({
                msg: err
            });
        }
        else {
            res.send({
                data: result,
                status: 200,
                msg: errMessage
            })

        }
    })
})


router.post('/getAllMACdetails', (req, res) => {

    let sql = "SELECT `PID`, `ASSET_CONFIG_ID`, `MAC_NAME`, `MAC_ADDRESS`, `MAC_STATUS`, `LOCATION`, `CREATED_BY`, `CREATED_DATE`, `MODIFY_BY`, `MODIFY_DATE` FROM `mac_tbl`";

    let todo = [req.body.PID]
    db.query(sql, todo, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})

router.post('/getLocationsByConfigID', (req, res) => {
    let sql3;
    sql = `SELECT DISTINCT LOCATION FROM mac_tbl WHERE ASSET_CONFIG_ID=?`

    let todo = [req.body.PID]
    db.query(sql, todo, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200,
            })

    })
})
router.post('/getDeviceDetailsByConfigID', (req, res) => {
    let sql3;
    let sql = "SELECT * FROM `mac_tbl` WHERE ASSET_CONFIG_ID=?"

    let todo = [req.body.PID]
    db.query(sql, todo, (err, result) => {
        if (err) throw err;
        else
            sql3 = `SELECT DISTINCT LOCATION FROM mac_tbl WHERE ASSET_CONFIG_ID=?`
        db.query(sql3, todo, (err3, result3) => {
            if (err3) throw err3;
            else
                res.send({
                    data: result,
                    status: 200,
                    totalLocation: result3,
                })
        })

    })
})

router.get('/getAllAssetsConfig/:COMPANY_ID', (req, res) => {

    if (req.params.COMPANY_ID == 0) {
        // no company id passing then all asset config
        let sql = `SELECT company_tbl.COMPANY_NAME, asset_config_tbl.PID,asset_config_tbl.CONFIG_NAME,asset_config_tbl.ASSET_ID,asset_config_tbl.INDUSTRIAL_TYPE,asset_config_tbl.INDUSTRIAL_DATA_SOURCE,asset_config_tbl.CONNECTION_TYPE,asset_config_tbl.TRACKING_DEVICE,sensor_type_tbl.NAME,asset_config_tbl.SENSOR,asset_config_tbl.SENSOR_DATA_TYPE,asset_config_tbl.MAC_ADDRESS,asset_config_tbl.COMPANY_ID ,sensor_type_tbl.NAME,asset_tbl.NAME,asset_config_tbl.SENSOR  FROM asset_config_tbl LEFT JOIN  sensor_type_tbl ON asset_config_tbl.SENSOR = sensor_type_tbl.PID LEFT JOIN asset_tbl ON asset_config_tbl.ASSET_ID=asset_tbl.PID LEFT JOIN company_tbl ON company_tbl.PID=asset_config_tbl.COMPANY_ID`;

        db.query(sql, (err, result) => {
            if (err) throw err;
            else
                res.send({
                    data: result,
                    status: 200
                })
        })
    } else {
        const COMPANY_ID = req.params.COMPANY_ID;
        let sql = `SELECT asset_config_tbl.PID,asset_config_tbl.CONFIG_NAME,asset_config_tbl.ASSET_ID,asset_config_tbl.INDUSTRIAL_TYPE,asset_config_tbl.INDUSTRIAL_DATA_SOURCE,asset_config_tbl.CONNECTION_TYPE,asset_config_tbl.TRACKING_DEVICE,asset_config_tbl.SENSOR,asset_config_tbl.SENSOR_CATEGORY,asset_config_tbl.SENSOR_DATA_TYPE,asset_config_tbl.MAC_ADDRESS,asset_config_tbl.COMPANY_ID ,sensor_type_tbl.NAME,asset_tbl.NAME  FROM asset_config_tbl LEFT JOIN  sensor_type_tbl ON asset_config_tbl.SENSOR = sensor_type_tbl.PID LEFT JOIN asset_tbl ON asset_config_tbl.ASSET_ID=asset_tbl.PID WHERE COMPANY_ID=?`;
        let todo = [COMPANY_ID]
        db.query(sql, todo, (err, result) => {
            if (err) throw err;
            else
                res.send({
                    data: result,
                    status: 200
                })
        })
    }

})

router.post('/deleteAssetConfig/:PID', (req, res) => {
    const PID = req.params.PID;

    let sql = `DELETE FROM asset_config_tbl WHERE PID=${PID}`;
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
// connections starts
router.post('/addConnection', (req, res) => {
    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // console.log('update')
        sql = 'UPDATE asset_connection_type_tbl SET CONN_NAME = ?,IP = ?, MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.CONN_NAME, req.body.IP, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = 'Record updated,successfully'
    } else {
        // add new
        sql = `INSERT INTO asset_connection_type_tbl(PID, CONN_NAME,IP, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?)`;
        todo = ['', req.body.CONN_NAME, req.body.IP, req.body.CREATED_BY, new Date()];
        errMessage = 'Record added,successfully';

    }

    db.query(sql, todo, (err, result) => {
        // console.log(result)
        if (err) {
            throw err;
            return res.status(400).send({
                msg: err
            });
        }
        else {
            res.send({
                data: result,
                status: 200,
                msg: errMessage
            })

        }
    })
})
router.get('/getAssetConnections', (req, res) => {
    const COMPANY_ID = req.params.COMPANY_ID;
    let sql = `SELECT * FROM asset_connection_type_tbl`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})
router.post('/deleteConnection/:PID', (req, res) => {
    const PID = req.params.PID;

    let sql = `DELETE FROM asset_connection_type_tbl WHERE PID=${PID}`;
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

// sensor starts

router.get('/getAllSensors', (req, res) => {
    const COMPANY_ID = req.params.COMPANY_ID;
    let sql = `SELECT * FROM sensor_type_tbl`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})
router.post('/addSensor', (req, res) => {
    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // update
        // console.log('update')
        sql = 'UPDATE sensor_type_tbl SET NAME = ?, MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.NAME, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = 'Record updated,successfully'
    } else {
        // console.log('add')
        // add new
        sql = `INSERT INTO sensor_type_tbl(PID, NAME, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?)`;
        todo = ['', req.body.NAME, req.body.CREATED_BY, new Date()];
        errMessage = 'Record added,successfully';

    }

    db.query(sql, todo, (err, result) => {
        // console.log(result)
        if (err) {
            throw err;
            return res.status(400).send({
                msg: err
            });
        }
        else {
            res.send({
                data: result,
                status: 200,
                msg: errMessage
            })

        }
    })
})
router.post('/addSensorSubCatg', (req, res) => {

    const sql = `INSERT INTO sensor_subcategory_tbl(PID, SENSOR_TYPE_ID, CATEGORY_NAME, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?)`;
    const todo = ['', req.body.SENSOR_TYPE_ID, req.body.CATEGORY_NAME, req.body.CREATED_BY, new Date()];

    db.query(sql, todo, (err, result) => {
        // console.log(result)
        if (err) {
            throw err;
            return res.status(400).send({
                msg: err
            });
        }
        else {
            res.send({
                data: result,
                status: 200,
                msg: 'Record added,successfully'
            })

        }
    })
})
router.get('/getSubCatgSensorByID/:SENSOR_TYPE_ID', (req, res) => {
    const SENSOR_TYPE_ID = req.params.SENSOR_TYPE_ID;
    let sql = `SELECT * FROM sensor_subcategory_tbl WHERE SENSOR_TYPE_ID=${SENSOR_TYPE_ID}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})

// assets starts
router.get('/getAllAssets', (req, res) => {
    const COMPANY_ID = req.params.COMPANY_ID;
    let sql = `SELECT * FROM asset_tbl`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})
// add asset
router.post('/addAsset', (req, res) => {

    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // update
        sql = 'UPDATE asset_tbl SET NAME = ?,ASSET_TYPE=?,COMPONENTS=?,MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.NAME, req.body.ASSET_TYPE, req.body.COMPONENTS, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = 'updated'
    } else {
        // add new
        sql = `INSERT INTO asset_tbl(PID, NAME,ASSET_TYPE,COMPONENTS, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?,?)`;
        todo = ['', req.body.NAME, req.body.ASSET_TYPE, req.body.COMPONENTS, req.body.CREATED_BY, new Date()];

        errMessage = ' added';

    }
    db.query(sql, todo, (err, result) => {
        // console.log(result)
        if (err) {
            throw err;
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
router.post('/deleteAssetByID', (req, res) => {
    const PID = req.body.PID;

    let sql = `DELETE FROM asset_tbl WHERE PID=${PID}`;
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
// chart request
router.post('/addChartRequest', (req, res) => {

    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // update
        sql = 'UPDATE widget_request_tbl SET WIDGET_TYPE=?,WIDGET_IMG=?, ASSET_CONFIG_ID=?,CHART_NAME = ?,WIDGET_DATA=?,WIDGET_SIZE=?,SQL_QUERY=?,IS_DRAGGED=?,MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.WIDGET_TYPE, req.body.WIDGET_IMG, req.body.ASSET_CONFIG_ID, req.body.CHART_NAME, req.body.WIDGET_DATA, req.body.WIDGET_SIZE, req.body.SQL_QUERY, req.body.IS_DRAGGED, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = ' updated'
    } else {
        // add new
        sql = `INSERT INTO widget_request_tbl(PID,WIDGET_TYPE,WIDGET_IMG, ASSET_CONFIG_ID,CHART_NAME,WIDGET_DATA,WIDGET_SIZE,SQL_QUERY,IS_DRAGGED, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
        todo = ['', req.body.WIDGET_TYPE, req.body.WIDGET_IMG, req.body.ASSET_CONFIG_ID, req.body.CHART_NAME, req.body.WIDGET_DATA, req.body.WIDGET_SIZE, req.body.SQL_QUERY, req.body.IS_DRAGGED, req.body.CREATED_BY, new Date()];

        errMessage = ' added';

    }
    db.query(sql, todo, (err, result) => {
        if (err) {
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

// get widget details by config Id
router.post('/AssetConfigDetailsByID', (req, res) => {

    // const IS_DRAGGED = 1;
    let sql = `SELECT DISTINCT MAC_ADDRESS FROM mac_tbl WHERE ASSET_CONFIG_ID=?`
    let todo = [req.body.ASSET_CONFIG_ID];
    var sql2;

    // only dragged & dropped list-get all locations & total device list
    db.query(sql, todo, (err, result) => {
        if (err) throw err;
        else
            sql2 = `SELECT DISTINCT LOCATION FROM mac_tbl WHERE ASSET_CONFIG_ID=?`;
        db.query(sql2, todo, (err2, result2) => {
            if (err2) throw err2;
            else
                res.send({
                    data: {
                        "totalDevice": result,
                        "Locations": result2
                    },
                    status: 200,

                })

        })
    })
})
router.get('/getLocationsByID/:ASSET_CONFIG_ID', (req, res) => {

    let sql = `SELECT LOCATION ,MAC_ADDRESS ,ASSET_CONFIG_ID FROM mac_tbl WHERE ASSET_CONFIG_ID=?`;
    let todo = [req.params.ASSET_CONFIG_ID];

    db.query(sql, todo, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })

    })
})
// get all chart requests
router.get('/allChartRequest/:IS_DRAGGED', (req, res) => {

    let sql = `SELECT widget_request_tbl.*,asset_config_tbl.CONFIG_NAME,asset_config_tbl.CONNECTION_TYPE  FROM widget_request_tbl LEFT JOIN asset_config_tbl ON asset_config_tbl.PID=widget_request_tbl.ASSET_CONFIG_ID WHERE widget_request_tbl.IS_DRAGGED=? `
    let todo = [req.params.IS_DRAGGED];
    let sql2;
    let locations = [];
    db.query(sql, todo, (err, result) => {
        // console.log(rows)
        if (err) throw err;
        else
            //     console.log(req.params.IS_DRAGGED)
            // if (req.params.IS_DRAGGED == 1) {
            //     rows.forEach(async item => {
            //         item.LOCATION = [];
            //         // console.log(item)
            //         sql2 = `SELECT LOCATION FROM mac_tbl WHERE ASSET_CONFIG_ID=?`;
            //         let todo2 = [item.ASSET_CONFIG_ID];
            //         await db.query(sql2, todo2, (err2, result2) => {
            //             if (err2)
            //                 throw err2;
            //             else
            //                 console.log(result2);
            //             // locations = result2;
            //             item.LOCATION.push(result2);

            //         })
            //         //write query with await
            //     });
            //     db.end();
            //     // for (var i in rows) {
            //     //     rows[i].LOCATION=[];
            //     //     // only dragged
            //     //     sql2 = `SELECT LOCATION FROM mac_tbl WHERE ASSET_CONFIG_ID=?`;
            //     //     let todo2 = [rows[i].ASSET_CONFIG_ID];

            //     //     db.query(sql2, todo2, (err2, result2) => {
            //     //         if (err2) throw err2;
            //     //         else
            //     //             console.log(result2)
            //     //         // locations = result2;
            //     //         rows[i].LOCATION = result2;

            //     //     })


            //     // }
            //     res.send({
            //         data: rows,
            //         status: 200,

            //     })
            //     // db.end();
            // }
            // else {
            //     // those are not dragged from right panel
            //     res.send({
            //         data: result,
            //         status: 200
            //     })
            // }
            res.send({
                data: result,
                status: 200
            })


    })
})


router.post('/chartRequestChangeStatus', (req, res) => {

    let sql = `UPDATE widget_request_tbl SET IS_DRAGGED=? WHERE PID=?`;
    const todo = [req.body.IS_DRAGGED, req.body.PID]
    db.query(sql, todo, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200,
                msg: 'Record updated.'
            })
    })
})
router.post('/deleteChartRequest/:PID', (req, res) => {
    const PID = req.params.PID;

    let sql = `DELETE FROM widget_request_tbl WHERE PID=${PID}`;
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

// 

router.get('/getMACstatusByAssetConfigID/:ASSET_CONFIG_ID', (req, res) => {
    let sql;
    let todo
    sql = `SELECT * FROM mac_address_status_tbl WHERE ASSET_CONFIG_ID=?`

    todo = [req.params.ASSET_CONFIG_ID]
    db.query(sql, todo, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})


router.get('/getAllMACstatus', (req, res) => {
    let sql;
    sql = `SELECT device_history_tbl.* ,asset_config_tbl.CONFIG_NAME FROM device_history_tbl LEFT JOIN asset_config_tbl on asset_config_tbl.PID= device_history_tbl.ASSET_CONFIG_ID ORDER BY LAST_UPDATE_TIME`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})

// history
router.post('/addDeviceHistory', (req, res) => {
    let sql;
    let todo;
    let errMessage;
    sql = `INSERT INTO device_history_tbl(PID, ASSET_CONFIG_ID, DEVICE_ID, VALUE,UNITS, STATUS, LATITUDE,LONGITUDE, LOCATION, LAST_UPDATE_TIME) VALUES (?,?,?,?,?,?,?,?,?,?)`;
    todo = ['', req.body.ASSET_CONFIG_ID, req.body.DEVICE_ID, req.body.VALUE, req.body.UNITS, req.body.STATUS, req.body.LATITUDE, req.body.LONGITUDE, req.body.LOCATION, new Date()];
    errMessage = 'added'
    db.query(sql, todo, (err, result, fields) => {
        if (err) {
            // throw err;
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

// filter
router.post('/getDeviceHistory', (req, res) => {
    let sql;
    let sql2;
    let sql3, sql4;
    //AND LOCATION=? 

    sql = `SELECT device_history_tbl.* FROM device_history_tbl WHERE ASSET_CONFIG_ID=? AND LOCATION=? AND DEVICE_ID=? AND LAST_UPDATE_TIME>=? AND LAST_UPDATE_TIME<=?`
    let todo = [req.body.ASSET_CONFIG_ID]
    // req.body.LOCATION,
    let todo2 = [req.body.ASSET_CONFIG_ID, req.body.LOCATION, req.body.DEVICE_ID,req.body.START_DATE, req.body.END_DATE]

    db.query(sql, todo2, (err, result) => {
        if (err) throw err;
        else
            sql2 = `SELECT DISTINCT DEVICE_ID FROM device_history_tbl WHERE ASSET_CONFIG_ID=?`

        db.query(sql2, todo, (err2, result2) => {
            if (err2) throw err2;
            else
                sql3 = `SELECT DISTINCT LOCATION FROM device_history_tbl WHERE ASSET_CONFIG_ID=?`
            db.query(sql3, todo, (err3, result3) => {
                if (err3) throw err3;
                else
                    sql4 = `SELECT asset_config_tbl.CONFIG_NAME,asset_config_tbl.COMPANY_ID,asset_connection_type_tbl.CONN_NAME,asset_connection_type_tbl.IP FROM asset_config_tbl LEFT JOIN asset_connection_type_tbl ON asset_connection_type_tbl.PID=asset_config_tbl.CONNECTION_TYPE WHERE asset_config_tbl.PID=?`
                let todo = [req.body.ASSET_CONFIG_ID]

                db.query(sql4, todo, (err4, result4) => {
                    if (err4) throw err4;
                    else
                        res.send({
                            data: result,
                            status: 200,
                            totalDevice: result2,
                            locations: result3,
                            protocol: result4
                        })
                })
            })
        })
    })
})
router.get('/getDeviceCurrStatusByConfigID/:ASSET_CONFIG_ID', (req, res) => {
    let sql;
    let sql2;
    let sql3, sql4;
    sql = `SELECT device_history_tbl.* FROM device_history_tbl WHERE ASSET_CONFIG_ID=?`
    let todo = [req.params.ASSET_CONFIG_ID]
    db.query(sql, todo, (err, result) => {
        if (err) throw err;
        else
            sql2 = `SELECT DISTINCT DEVICE_ID FROM device_history_tbl WHERE ASSET_CONFIG_ID=?`

        db.query(sql2, todo, (err2, result2) => {
            if (err2) throw err2;
            else
                sql3 = `SELECT DISTINCT LOCATION FROM device_history_tbl WHERE ASSET_CONFIG_ID=?`
            db.query(sql3, todo, (err3, result3) => {
                if (err3) throw err3;
                else
                    sql4 = `SELECT asset_config_tbl.CONFIG_NAME,asset_config_tbl.COMPANY_ID,asset_connection_type_tbl.CONN_NAME,asset_connection_type_tbl.IP FROM asset_config_tbl LEFT JOIN asset_connection_type_tbl ON asset_connection_type_tbl.PID=asset_config_tbl.CONNECTION_TYPE WHERE asset_config_tbl.PID=?`
                let todo = [req.params.ASSET_CONFIG_ID]

                db.query(sql4, todo, (err4, result4) => {
                    if (err4) throw err4;
                    else
                        res.send({
                            data: result,
                            status: 200,
                            totalDevice: result2,
                            locations: result3,
                            protocol: result4
                        })
                })
            })
        })
    })
})
router.post('/getDeviceCurrStatusByDeviceID', (req, res) => {
    let sql;
    sql = `SELECT * FROM device_history_tbl WHERE DEVICE_ID=? ORDER BY LAST_UPDATE_TIME`;
    let todo = [res.body.DEVICE_ID]
    db.query(sql, todo, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})

module.exports = router;