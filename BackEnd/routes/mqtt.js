var mqtt = require('mqtt');
const express = require('express');
const router = express.Router();
const db = require('./dbConnection');

var protocol = {};
var options = {
    // port: 1883,
    // host: 'mqtt://13.126.193.19',
    port: protocol.PORT,
    host: `mqtt://${protocol.IP}`,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'isliot',
    password: 'Isl@iot',
    keepalive: 60,
    reconnectPeriod: 1000,
    // path: '/mqtt',
    // protocolId: 'MQIsdp',
    // protocolVersion: 3,
    // clean: true,
    // encoding: 'utf8'
};
const topic = '/nodejs/mqtt'
var client = mqtt.connect('mqtt://13.126.193.19', options)

client.on("connect", function () {
    console.log("mqtt connected  " + client.connected);
    // client.subscribe([topic], () => {
    //     console.log(`Subscribe to topic '${topic}'`)
    // })
    // client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    //     if (error) {
    //         console.error(error)
    //     }
    // })
})

var finalData;

function ambientTemp() {
    var data = Math.random() * (45.5 - 2.5) + 2.5;
    return parseFloat(data.toFixed(5));
}

function oilTempsensor() {
    var data = Math.random() * (32.2 - 8.5) + 8.5;
    return parseFloat(data.toFixed(5));
}

function oilWaterActivity() {
    var data = Math.random() * (0.29 - 0.2) + 0.2;
    return parseFloat(data.toFixed(5));
}

function oilMoisture() {
    var data = Math.random() * (15 - 8) + 8;
    return parseFloat(data.toFixed(5));
}

function activePower() {
    var data = Math.random() * (20 - 1) + 1;
    return parseFloat(data.toFixed(5));
}

function voltageRY() {
    var data = Math.random() * (220 - 40) + 40;
    return parseFloat(data.toFixed(5));
}

function voltageYB() {
    var data = Math.random() * (190 - 35.5) + 35.5;
    return parseFloat(data.toFixed(5));
}

function voltageBR() {
    var data = Math.random() * (250 - 45) + 45;
    return parseFloat(data.toFixed(5));
}

function cbStatus() {
    var data = Math.random() * (1 - 0) + 0;
    return parseFloat(data.toFixed(5));
}

function windingTemp() {
    var data = Math.random() * (50 - 20) + 20;
    return parseFloat(data.toFixed(5));
}

function oilTemp() {
    var data = Math.random() * (50 - 20) + 20;
    return parseFloat(data.toFixed(5));
}

function tapPosition() {
    var data = Math.random() * (4 - 1) + 1;
    return parseFloat(data.toFixed(5));
}

function rphCurrent() {
    var data = Math.random() * (110 - 18) + 18;
    return parseFloat(data.toFixed(5));
}

function yphCurrent() {
    var data = Math.random() * (110 - 18) + 18;
    return parseFloat(data.toFixed(5));
}

function bphCurrent() {
    var data = Math.random() * (110 - 18) + 18;
    return parseFloat(data.toFixed(5));
}

function powerFactor() {
    var data = Math.random() * (1 - 0) + 0;
    return parseFloat(data.toFixed(5));
}


function reactivePower() {
    var data = Math.random() * (3.2 - (-0.5)) + (-0.5);
    return parseFloat(data.toFixed(5));
}

function location() {

    var textArray = [
        'Azadpur',
        'Wazipur',
        'Poothkhurd',
        'Rohini'
    ];
    var randomloc = Math.floor(Math.random() * textArray.length);
    return textArray[randomloc];
}

function sensorId() {

    var textArray = [
        'sensor001',
        'sensor002',
        'sensor003',
        'sensor004'
    ];
    var randomloc = Math.floor(Math.random() * textArray.length);
    return textArray[randomloc];
}

function sensor_data() {
    var sensor_data = {

        activePower: activePower(),
        voltageRY: voltageRY(),
        voltageYB: voltageYB(),
        voltageBR: voltageBR(),
        cbStatus: cbStatus(),
        windingTemp: windingTemp(),
        oilTemp: oilTemp(),
        tapPosition: tapPosition(),
        rphCurrent: rphCurrent(),
        yphCurrent: yphCurrent(),
        bphCurrent: bphCurrent(),
        powerFactor: powerFactor(),
        reactivePower: reactivePower(),
        ambientTemp: ambientTemp(),
        oilTempsensor: oilTempsensor(),
        oilWaterActivity: oilWaterActivity(),
        oilMoisture: oilMoisture(),
        location: location(),
        sensorId: sensorId(),
        date: new Date()
    }
    return sensor_data;
}



function mqtt_pub() {

    finalData = sensor_data()
    finalData = JSON.stringify(finalData)
    // console.log(finaData)
    client.publish('tatapower', finalData)
    //client.end();
    finalData = "";
    return null;
}

mqtt_pub()
var dataF = setInterval(mqtt_pub, 3000);
router.get('/:PID', (req, res) => {
    // console.log(req.params)
    const protocolID = req.params.PID;
    // get protocol details by passing PID
    let sql = `SELECT * FROM asset_connection_type_tbl WHERE PID=?`;
    let todo = [protocolID]
    db.query(sql, todo, (err, result) => {
        if (err) throw err;
        else
        // console.log(result)
            protocol.IP = result[0].IP;
            protocol.PORT = result[0].PORT;
        finalData = sensor_data()
        finalData = JSON.stringify(finalData)
        client.publish('tatapower', finalData);
        res.send({
            data: JSON.parse(finalData),
            status: 200,
            msg: `Record received,successfully`
        })
    })




});
module.exports = router;