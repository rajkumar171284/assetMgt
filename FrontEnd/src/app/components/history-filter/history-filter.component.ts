import { Component, EventEmitter, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, Output } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice, _dateFilters } from '../../myclass';
import { interval } from 'rxjs';
import * as moment from 'moment'
var date = new Date()
interface _device {
  DEVICE_ID: any
}
class widgetResponse {
  totalLocations: [] | undefined;
  locations: [] | undefined;
  protocol: {} | undefined;
  data: [] | undefined;
  status: '' | undefined;
  totalDevice: [] | undefined

};
@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryFilterComponent implements OnInit, OnChanges, OnDestroy {
  dateFilters = _dateFilters;
  @Input() WIDGET_REQUEST: any;
  @Output() sendToParent = new EventEmitter();
  @Output() setLoader = new EventEmitter();
  errMessage: string = '';
  labelMessage2: any;
  deviceType: string = '';
  chartName: any;
  @Input('pMap') pMap: any;
  @Input() name: any;
  filterBy: any[] = ['KM', 'SPEED'];
  newForm: FormGroup;
  filterXaxes: any[] = ['DEVICE', 'LOCATION'];




  widgetResponse: any = new widgetResponse()
  loading = false;
  newDevice: __addAssetDevice = {
    PID: 0,
    ASSET_CONFIG_ID: 0,
    DEVICE_ID: undefined,
    VALUE: undefined,
    UNITS: undefined,
    STATUS: undefined,
    LATITUDE: undefined,
    LONGITUDE: undefined,
    LOCATION: undefined,
    LAST_UPDATE_TIME: undefined
  };
  myInterval: Subscription | undefined;
  filterShow1: boolean = false;
  filterShow2: boolean = false;
  todayStartDate = date.setDate(date.getDate() - 1);
  // todayStartDate: any = moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss").toString();
  todayEndDate: any = moment().endOf('day').toString();
  deviceList: _device[] = [];
  showGuage = false;
  constructor(private fb: FormBuilder, private dataService: AuthService, private ref: ChangeDetectorRef) {

    this.newForm = this.fb.group({
      PLOT_XAXES: [''],
      PLOT_TYPE: [''],
      LOCATION: ['', this.filterShow2 ? Validators.required : ''],
      START_DATE: ['', this.filterShow2 ? Validators.required : ''],
      END_DATE: ['', this.filterShow2 ? Validators.required : ''],
      DEVICE_ID: [''],
      filterStep: ['']
    })
    this.newForm.patchValue({
      // START_DATE: new Date(this.todayStartDate),
      // END_DATE: new Date(this.todayEndDate),
      filterStep: this.dateFilters[0]
    })

  }

  ngOnInit(): void {
    if (this.WIDGET_REQUEST.CHART_NAME == "gauge" || this.WIDGET_REQUEST.CHART_NAME == "line") {
      this.filterShow2 = true;
      this.filterShow1 = false;

    } else {
      this.filterShow1 = true;
      this.filterShow2 = true;

    }

  }
  ngOnDestroy(): void {
    this.myInterval?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.WIDGET_REQUEST)
    // 
    if (this.WIDGET_REQUEST) {
      this.widgetResponse = new widgetResponse();

      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      if (this.WIDGET_REQUEST.WIDGET_TYPE) {
        this.dataService.getAllLocationsByConfigID(this.WIDGET_REQUEST).subscribe(locations => {

          if (locations && locations.data.length > 0) {

            this.widgetResponse.totalLocations = locations.data;
            this.newForm.patchValue({

              LOCATION: this.widgetResponse.totalLocations[0].LOCATION,
              DEVICE_ID: this.widgetResponse.totalLocations[0].MAC_ADDRESS

            })
            this.filterSrc()

            //     this.errMessage = 'No Data found..';
            // // no record found then 
            // this.sendToParent.emit(false);
            // this.ref.detectChanges();

          }
        })


      }

    }

  }

  get VALUES() {
    return this.newForm.value;
  }
  getDateSteps() {

    let enddate = moment().format("YYYY-MM-DD HH:mm:ss").toString();

    let state: any = `${this.VALUES.filterStep.state}`;
    let step: any = this.VALUES.filterStep.step;
    let startdate = moment().subtract(step, state).format("YYYY-MM-DD HH:mm:ss").toString();
    console.log(startdate);
    return {
      START_DATE: startdate, END_DATE: enddate,
    }

    
    // console.log('end', end, step)
    // if(this.VALUES.filterStep.state=='min'){

    // }else if(this.VALUES.filterStep.state=='hr'){
    //   moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss").toString();
    // }
    // else if(this.VALUES.filterStep.state=='day'){
    //   moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss").toString();
    // }


  }
  async filterSrc() {
    // this.loading = true;
    this.setLoader.emit(true);
    this.errMessage = '';
    this.WIDGET_REQUEST.LOCATION = this.VALUES.LOCATION;
    if (this.VALUES.filterStep) {
      const dates = await this.getDateSteps();
      // console.log(dates)
      this.WIDGET_REQUEST.START_DATE = moment(dates.START_DATE).format("YYYY-MM-DD HH:mm:ss").toString();
      this.WIDGET_REQUEST.END_DATE = moment(dates.END_DATE).format("YYYY-MM-DD HH:mm:ss").toString();

    } 
    
    else if(this.VALUES.START_DATE && this.VALUES.END_DATE){
      this.WIDGET_REQUEST.START_DATE = moment(this.VALUES.START_DATE).format("YYYY-MM-DD 00:00:00").toString();
      this.WIDGET_REQUEST.END_DATE = moment(this.VALUES.END_DATE).format("YYYY-MM-DD 23:59:00").toString();
  

      this.newForm.patchValue({
        filterStep:''
      })
    }
    this.WIDGET_REQUEST.DEVICE_ID = this.VALUES.DEVICE_ID;
    console.log('this.WIDGET_REQUEST-charts', this.WIDGET_REQUEST)
    this.getDeviceLog();
  }

  getDeviceLog() {
    // loader
    this.dataService.getDeviceHistoryByFilter(this.WIDGET_REQUEST).subscribe(result => {
      // console.log(result)
      if (result && result.data.length > 0) {
        this.widgetResponse.data = result.data;
        this.widgetResponse.protocol = result.protocol;
        this.widgetResponse.totalDevice = result.totalDevice;

        const protocol = result.protocol;
        // console.log('MQTT',protocol)
        if (protocol && protocol[0].CONN_NAME == 'MQTT') {
          // written api for tat power data
          this.getMQTTdata()
        }


        for (let device of this.widgetResponse.totalDevice) {
          device.history = [];
          device.unitsArr = [];
          device.history = this.widgetResponse.data.filter((obj: any) => {
            return obj.DEVICE_ID == device.DEVICE_ID;
          }).map((resp: any) => {
            let VALUE = resp.VALUE;
            resp.newVALUE = '';
            try {
              const newVALUE = JSON.parse(VALUE);
              // update date 
              newVALUE.LAST_UPDATE_TIME = resp.LAST_UPDATE_TIME;
              resp.newVALUE = newVALUE;
            } catch (err) {
              const newVALUE = JSON.stringify(VALUE);

              JSON.parse(newVALUE).LAST_UPDATE_TIME = resp.LAST_UPDATE_TIME;
              resp.newVALUE = newVALUE;
            }
            return resp.newVALUE;
          })
          // setup unique object
          let index = this.widgetResponse.data.findIndex((obj: any) => {
            return obj.DEVICE_ID == device.DEVICE_ID;
          })
          if (index != -1) {

            let VALUE = this.widgetResponse.data[index].VALUE;
            try {
              VALUE = JSON.parse(VALUE);
              device.VALUE = VALUE;

            } catch (err) {
              VALUE = JSON.stringify(VALUE);
              device.VALUE = VALUE;

            }
            for (let a of Object.keys(VALUE)) {
              // dynamic key wise getting value 
              let key: any = a;
              if (key != 'location' && key != 'date' && key != 'sensorId') {
                var object: any = {};
                object.key = key;
                object.totalValue = 0;
                object.data = [];
                device.unitsArr.push(object);

              }
            }
          }

          // get total units value
          for (let unit of device.unitsArr) {
            device.history.forEach((Item: any) => {
              let vIndex = 0;
              for (let v of Object.keys(Item)) {

                if (v === unit.key) {
                  unit.totalValue = unit.totalValue + Object.values(Item)[vIndex];
                  unit.data.push(Object.values(Item)[vIndex]);
                }
                vIndex++;
              }
            })
          }



        }
        this.sendToParent.emit(this.widgetResponse);
        this.ref.detectChanges();
        // console.log(this.widgetResponse)

      } else {
        this.errMessage = 'No Data found..';
        // no record found then 
        this.sendToParent.emit(false);
        this.ref.detectChanges();
      }
      // this.loading = false;
      this.setLoader.emit(false);
      this.ref.detectChanges();
    })

  }







  getMQTTdata() {
    const time = interval(6000);
    this.myInterval = time.subscribe(() => {
      this.dataService.getMqtt({}).subscribe(response => {
        // console.log('getMqtt',)
        if (response) {

          const res = response.data;
          const value = JSON.parse(JSON.stringify(response.data));

          this.newDevice.ASSET_CONFIG_ID = this.WIDGET_REQUEST.ASSET_CONFIG_ID;
          this.newDevice.DEVICE_ID = res.sensorId;
          this.newDevice.STATUS = true;
          this.newDevice.VALUE = JSON.stringify(value);
          this.newDevice.LOCATION = res.location;
          this.newDevice.LAST_UPDATE_TIME = res.date;

          // console.log(this.newDevice)

          this.dataService.saveDeviceHistory(this.newDevice).subscribe(resp => {
            // console.log(resp)

          })

        }
      })
    })
  }


  async getParsed(data: any) {
    if (!data) return;
    let VALUE = data.VALUE;
    try {
      VALUE = JSON.parse(VALUE);
      data.VALUE = VALUE;
      return data;

    } catch (err) {
      VALUE = JSON.parse(VALUE);
      data.VALUE = VALUE;
      return data;

    }

  }

}
