import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
const headers = new HttpHeaders().set('content-type', 'application/json').set('Access-Control-Allow-Origin', 'http://localhost:4200').set("Access-Control-Allow-Methods", "POST,GET,PUT,PATCH,DELETE,OPTIONS");

// let headers = new HttpHeaders()
 
// headers=headers.append('content-type','application/json')
// headers=headers.append('Access-Control-Allow-Origin', '*')
// headers=headers.append('content-type','application/x-www-form-urlencoded')
const options = {
  headers: headers
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }


  getSessionData() {
    const session = JSON.parse(JSON.stringify(sessionStorage.getItem('session')));
    return JSON.parse(session);
  }
  authLogin(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/login`, params, options).pipe(map(response => {
      return response;
    }))
  }

  // asset config starts
  addAssetConfig(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/addAssetConfig`, params, options).pipe(map(response => {
      return response;
    }))
  }

  getAssetConfig(params: any): Observable<any> {
    return this.http.get(`${environment.url}/asset/getAllAssetsConfig/${params.COMPANY_ID}`, options).pipe(map(response => {
      return response;
    }))
  }
  deleteAssetConfigByID(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/deleteAssetConfig/${params.PID}`, options).pipe(map(response => {
      return response;
    }))
  }
  // device details


  getAllLocationsByConfigID(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/getLocationsByConfigID`, params, options).pipe(map(response => {
      return response;
    }))
  }
  getMACByConfigID(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/getMACdetailsByConfigID`, params, options).pipe(map(response => {
      return response;
    }))
  }
  addMACByConfigID(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/addMACByConfigID`, params, options).pipe(map(response => {
      return response;
    }))
  }
  getDeviceCurrStatusByConfigID(params: any): Observable<any> {
    return this.http.get(`${environment.url}/asset/getDeviceCurrStatusByConfigID/${params.ASSET_CONFIG_ID}`, options).pipe(map(response => {
      return response;
    }))
  }
  // updateDeviceByID(params: any): Observable<any> {
  //   return this.http.post(`${environment.url}/asset/updateDeviceByID`,params, options).pipe(map(response => {
  //     return response;
  //   }))
  // }

  updateDeviceByID(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/updateDeviceByID`, params, options).pipe(map(response => {
      return response;
    }))
  }
  // asset connection starts
  addConnection(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/addConnection`, params, options).pipe(map(response => {
      return response;
    }))
  }
  getAssetConn(params: any): Observable<any> {
    return this.http.get(`${environment.url}/asset/getAssetConnections`, options).pipe(map(response => {
      return response;
    }))
  }
  deleteConn(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/deleteConnection/${params.PID}`, options).pipe(map(response => {
      return response;
    }))
  }
  getAllSensors(params: any): Observable<any> {
    return this.http.get(`${environment.url}/asset/getAllSensors`, options).pipe(map(response => {
      return response;
    }))
  }


  addSensor(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/addSensor`, params, options).pipe(map(response => {
      return response;
    }))
  }
  addSubSensor(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/addSensorSubCatg`, params, options).pipe(map(response => {
      return response;
    }))
  }
  getSubSensorCatg(params: any): Observable<any> {
    return this.http.get(`${environment.url}/asset/getSubCatgSensorByID/${params.SENSOR_TYPE_ID}`, options).pipe(map(response => {
      return response;
    }))
  }

  // assets starts
  getAllAssets(params: any): Observable<any> {
    return this.http.get(`${environment.url}/asset/getAllAssets`, options).pipe(map(response => {
      return response;
    }))
  }
  // addAsset starts
  addAsset(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/addAsset`, params, options).pipe(map(response => {
      return response;
    }))
  }
  deleteAsset(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/deleteAssetByID`, params, options).pipe(map(response => {
      return response;
    }))
  }

  // chart request add

  addChartRequest(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/addChartRequest`, params, options).pipe(map(response => {
      return response;
    }))
  }
  getAllChartRequests(params: any): Observable<any> {
    return this.http.get(`${environment.url}/asset/allChartRequest/${params.IS_DRAGGED}`, options).pipe(map(response => {
      return response;
    }))
  }
  deleteChartRequests(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/deleteChartRequest/${params.PID}`, options).pipe(map(response => {
      return response;
    }))
  }
  chartRequestChangeStatus(params: any): Observable<any> {
    return this.http.post(`${environment.url}/asset/chartRequestChangeStatus`, params, options).pipe(map(response => {
      return response;
    }))
  }
  // mac 
  getMACstatusByAssetConfigID(params: any): Observable<any> {
    return this.http.get(`${environment.url}/asset/getMACstatusByAssetConfigID/${params.ASSET_CONFIG_ID}`, options).pipe(map(response => {
      return response;
    }))
  }
  getAllMACstatus(): Observable<any> {
    return this.http.get(`${environment.url}/asset/getAllMACstatus`, options).pipe(map(response => {
      return response;
    }))
  }
  getLiveLocationByCity(params: any): Observable<any> {
    params.LOCATION = params.LOCATION.toLowerCase();
    return this.http.get(`${environment.vtsURL}${params.LOCATION}/loc`, options).pipe(map(response => {
      return response;
    }))
  }

  // users starts
  getAllUsersByCID(params: any): Observable<any> {
    return this.http.post(`${environment.url}/users/getAllUsersByCompanyID`, params, options).pipe(map(response => {
      return response;
    }))
  }
  createUser(params: any): Observable<any> {
    return this.http.post(`${environment.url}/users/addUser`, params, options).pipe(map(response => {
      return response;
    }))
  }
}
