from flask import *  
import os
import datetime
import json
import time
import random
from bson import json_util
from flask import jsonify
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)


mumbai = {
  "lat1" : "19.094607868312032, 72.89769804743888",
  "lat2" : "19.096189471764387, 72.89490855007892",
  "lat3" : "19.10117750671781, 72.89070284636699",
  "lat4" : "19.10608428868304, 72.88795626435103",
  "lat5" : "19.107016966312944, 72.89143240721498",
  "lat6" : "19.10563822360961, 72.89456522732692",
  "lat7" : "19.099758162483806, 72.89799845484687",
  "lat8" : "19.093756229423626, 72.89932883051085",
  "lat9" : "19.092134047990154, 72.9025045659668"
}

chennai = {
"lat1" : "13.03481,80.15594",
"lat2" : "13.03549,80.15456",
"lat3" : "13.03610,80.15326",
"lat4" : "13.03682,80.15347",
"lat5" : "13.03687,80.15441",
"lat6" : "13.03699,80.15599",
"lat7" : "13.03708,80.15827",
"lat8" : "13.03589,80.15688",
"lat9" : "13.03544,80.15645",
}

imei = {
"imei1" : "990391785483228",
"imei2" : "442893517734160",
"imei3" : "494990805790206",
"imei4" : "492276079564168",
"imei5" : "458970178436821",
"imei6" : "301832961217397",
"imei7" : "539013698096289",
"imei8" : "540065144825007",
"imei9" : "333939350417272",
"imei10" : "985163031210995",
}

locState = "lat9"
latitude = ""
longitude = ""

#print(locState)

def locStatus():
    global locState
    #print(locState)
    if(locState == "lat1"):
        locState = "lat2"
        return locState
    elif(locState == "lat2"):
        locState = "lat3"
        return locState
    elif(locState == "lat3"):
        locState = "lat4"
        return locState
    elif(locState == "lat4"):
        locState = "lat5"
        return locState
    elif(locState == "lat5"):
        locState = "lat6"
        return locState
    elif(locState == "lat6"):
        locState = "lat7"
        return locState
    elif(locState == "lat7"):
        locState = "lat8"
        return locState
    elif(locState == "lat8"):
        locState = "lat9"
        return locState
    elif(locState == "lat9"):
        locState = "lat1"
        return locState


def locSplit(val):
    global latitude
    global longitude
    global locselect
    locStatus()
    locselect = val
    test = ""
    if locselect == "mumbai":
        test = mumbai
    elif locselect == "goa":
        test = goa
    elif locselect == "delhi":
        test = delhi
    else :
        test = chennai
    locConv = test[locState]
    locConv1 = locConv.split(',')
    latitude = locConv1[0]
    longitude = locConv1[1]
    return latitude,longitude

def dateValue():
    now = datetime.datetime.now()
    finalDate = str(now.strftime("%Y-%m-%d %H:%M:%S"))
    #print(now)
    return finalDate

speedData = 0
def speed():
    global speedData
    speedData = random.randint(0,150)
    return speedData

batterydata = 0
def battery():
    global batterydata
    batterydata = random.randint(1,100)
    return batterydata

imeiVal = ""
def imeiUpdate():
    global imeiVal
    imeiVal = random.choice(list(imei.values()))
    return imeiVal

ignitionStatus = "OFF"

def ignitionState():
    global ignitionStatus
    if ignitionStatus == "OFF":
        ignitionStatus = "ON"
        return ignitionStatus
    elif ignitionStatus == "ON":
        ignitionStatus = "OFF"
        return ignitionStatus

  
@app.route('/chennai/loc', methods = ['GET'])  
def loc_chennai():  
    if request.method == 'GET':
        location =  locSplit("chennai")
        data = {
        "deviceId" : imeiUpdate(),
        "latitude" : float(latitude),
        "longitude" : float(longitude),
        "region":locselect,
        "reportedTime": dateValue(),
        "ignitionStatus": ignitionState(),
        "reportedMilliSeconds":int(round(time.time() * 1000)),
        "speed":speed(),
        "altitude":speed(),
        "battery":battery(),
        "odometer":17737+speedData
        }
        #print(data)
        #mydatabase = client['vehicle_tracking']
        #mycollection=mydatabase['history']
        #mydict = { "name": "John", "address": "Highway 37" }
        #rec = mycollection.insert_one(data)
        return json.loads(json_util.dumps(data))
        #return json.dumps(data)

@app.route('/mumbai/loc', methods = ['GET'])  
def loc_mumbai():  
    if request.method == 'GET':
        location =  locSplit("mumbai")
        data = {
        "deviceId" : imeiUpdate(),
        "latitude" : float(latitude),
        "longitude" : float(longitude),
        "region":locselect,
        "reportedTime": dateValue(),
        "ignitionStatus": ignitionState(),
        "reportedMilliSeconds":int(round(time.time() * 1000)),
        "speed":speed(),
        "altitude":speed(),
        "battery":battery(),
        "odometer":17737+speedData
        }
        #print(data)
        return json.loads(json_util.dumps(data))

if __name__ == '__main__':  
    app.run(port=8000, debug = True) 