import { Component, ViewChild, ElementRef, EventEmitter, OnInit, Input, OnDestroy, DoCheck, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, Output } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription, Observable, of, from, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice, _dateFilters } from '../../myclass';
import { interval } from 'rxjs';
import * as moment from 'moment';
import { XAxisService } from '../../services/x-axis.service';
import { ThemeService } from '../../services/theme.service';

import { delay, tap, map, filter, mergeMap, startWith } from "rxjs/operators";
var date = new Date()
interface _device {
  DEVICE_ID: any
}
interface _filterKey {
  name: any
}
class widgetResponse {
  totalLocations: [] | undefined;
  locations: [] | undefined;
  protocol: {} | undefined;
  data: [] | undefined;
  status: '' | undefined;
  totalDevice: [] | undefined;
  totalParameters: [] | undefined
};
@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HistoryFilterComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  dateFilters = _dateFilters;
  @Input() WIDGET_REQUEST: any;
  @Input() xAxisName: any;
  isDarkTheme: Observable<boolean> | undefined;
  @ViewChild("divBoard") divBoard!: ElementRef;

  @Output() sendToParent = new EventEmitter();
  @Output() setLoader = new EventEmitter();
  errMessage: string = '';
  labelMessage2: any;
  deviceType: string = '';
  chartName: any;
  @Input('pMap') pMap: any;
  @Input() name: any;
  @Input() reLoad: any;
  filterBy: any[] = ['KM', 'SPEED'];
  newForm: FormGroup;
  filterXaxes: any[] = ['DEVICE', 'LOCATION'];
  widgetResponse: any = new widgetResponse();
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
    LAST_UPDATE_TIME: undefined,
  };
  myInterval: Subscription | undefined;
  filterShow1: boolean = false;
  filterShow2: boolean = false;
  todayStartDate = date.setDate(date.getDate() - 1);
  todayEndDate: any = moment().endOf('day').toString();
  deviceList: _device[] = [];
  showGuage = false;
  isLOCATIONS = false;
  myLOCATIONS: any = [];
  mySENSORS: any = [];
  expandFilter: boolean = false;

  xAxisData$!: Observable<any>;
  constructor(public xaxisService: XAxisService, private fb: FormBuilder, private dataService: AuthService, private ref: ChangeDetectorRef) {

    this.newForm = this.fb.group({
      PLOT_XAXES: [''],
      PLOT_TYPE: [''],
      LOCATION: ['', !this.isLOCATIONS ? Validators.required : ''],
      SENSOR: ['', this.isLOCATIONS ? Validators.required : ''],
      START_DATE: ['', this.filterShow2 ? Validators.required : ''],
      END_DATE: ['', this.filterShow2 ? Validators.required : ''],
      DEVICE_ID: [''],
      filterStep: ['']
    })
    this.newForm.patchValue({
      filterStep: this.dateFilters[10]
    })

  }
  ngDoCheck(): void {


  }
  ngOnInit(): void {
    // this.xAxisData$=
    // this.xaxisService.getValue().subscribe(x=>{
    //   console.log(x)
    // });
    // console.log(this.xAxisData$)
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
    console.log(this.WIDGET_REQUEST, this.reLoad)
    // 
    if (this.WIDGET_REQUEST && this.reLoad) {

      this.widgetResponse = new widgetResponse();
      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      if (this.WIDGET_REQUEST.WIDGET_TYPE) {
        this.dataService.getAllLocationsByConfigID(this.WIDGET_REQUEST).subscribe(locations => {

          if (locations && locations.data.length > 0) {
            // console.log(this.WIDGET_REQUEST.CONFIG_NAME)
            
            // get active or usable parameters
            this.dataService.getAllParametersByConfigID(this.WIDGET_REQUEST).subscribe(params => {
              // console.log(params)
              if (params.data) {
                this.widgetResponse.totalParameters = JSON.parse(params.data).filter((item: any) => item).map((x: any) => {
                  return {
                    tag:x.INPUT_NAME,status:x.INPUT_STATUS
                  }
                });
              }
              // console.log(this.widgetResponse)
            })

            this.widgetResponse.totalLocations = locations.data;
            this.newForm.patchValue({

              LOCATION: this.widgetResponse.totalLocations[0].LOCATION,
              DEVICE_ID: this.widgetResponse.totalLocations[0].MAC_ADDRESS

            })
            this.filterSrc()

          }
        })


      }

    } else {
      this.setLoader.emit(false);
    }

  }

  get VALUES() {
    return this.newForm.value;
  }
  async getDateSteps() {

    let enddate = moment().format("YYYY-MM-DD HH:mm:ss").toString();

    let state: any = `${this.VALUES.filterStep.state}`;
    let step: any = this.VALUES.filterStep.step;
    let startdate = moment().subtract(step, state).format("YYYY-MM-DD HH:mm:ss").toString();
    return {
      START_DATE: startdate, END_DATE: enddate,
    }

  }
  async filterSrc() {
    this.setLoader.emit(true);
    this.errMessage = '';
    this.WIDGET_REQUEST.LOCATION = this.VALUES.LOCATION;
    if (this.VALUES.filterStep) {
      const dates = await this.getDateSteps();

      this.WIDGET_REQUEST.START_DATE = moment(dates.START_DATE).format("YYYY-MM-DD HH:mm:ss").toString();
      this.WIDGET_REQUEST.END_DATE = moment(dates.END_DATE).format("YYYY-MM-DD HH:mm:ss").toString();

    }

    else if (this.VALUES.START_DATE && this.VALUES.END_DATE) {
      this.WIDGET_REQUEST.START_DATE = moment(this.VALUES.START_DATE).format("YYYY-MM-DD 00:00:00").toString();
      this.WIDGET_REQUEST.END_DATE = moment(this.VALUES.END_DATE).format("YYYY-MM-DD 23:59:00").toString();
      this.newForm.patchValue({
        filterStep: ''
      })
    }
    this.WIDGET_REQUEST.DEVICE_ID = this.VALUES.DEVICE_ID;
    this.getDeviceLog();
    this.expandFilter = false;
  }

  getDeviceLog() {
    // loader
    // if (this.xAxisName) {
    //   this.WIDGET_REQUEST.LOCATION = null;

    // }
    this.dataService.getDeviceHistoryByFilter(this.WIDGET_REQUEST).subscribe(result => {
      // console.log('history',result)
      if (result && result.data) {
        // console.log('history result found',this.WIDGET_REQUEST.PID)
        // console.log(this.WIDGET_REQUEST.CONFIG_NAME)
        of(result).pipe(map(a => a)).subscribe(resdata => {
          this.widgetResponse.data = resdata.data;
          this.widgetResponse.protocol = resdata.protocol;
          this.widgetResponse.totalDevice = result.totalDevice;
          const protocol = result.protocol;
          if (protocol && protocol[0].CONN_NAME == 'MQTT') {
            // written api for tat power data
            // console.log(protocol)
            this.getMQTTdata(protocol[0])
          }


          // get formatt edhistory 
          this.formattedHistory();
        })

      } else {
        // console.log('result not found',this.WIDGET_REQUEST.PID)
        this.errMessage = 'No Data found..';
        // no record found then 
        this.sendToParent.emit(false);
        this.ref.detectChanges();
      }
      this.getFilterArr();

      // this.setLoader.emit(false);
      this.expandFilter = false;
      this.ref.detectChanges();
    })

  }






  formattedHistory() {
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
          const parsed = JSON.parse(newVALUE);
          // console.log(parsed)
          let newJSON: any = {};
          newJSON = parsed;
          newJSON.LAST_UPDATE_TIME = '';

          newJSON.LAST_UPDATE_TIME = resp.LAST_UPDATE_TIME;
          resp.newVALUE = newJSON;
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
            object.selected = false;
            device.unitsArr.push(object);

          }
        }
      }

      // get total units value
      let j = 0;
      for (let unit of device.unitsArr) {
        if (this.widgetResponse.totalParameters && this.widgetResponse.totalParameters.length > 0){
          // if parameter onboarded
          this.widgetResponse.totalParameters.find((p: any) => {
            if (p.tag == unit.key) {
              unit.status = true;//is usable flag then
            }
          });
        }
        if (j == 0) {
          unit.selected = true;
        }
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
        j++;
      }



    }

    this.sendToParent.emit(this.widgetResponse);
    this.ref.detectChanges();
  }



  getMQTTdata(protocol: any) {
    const time = interval(3000);
    const params = protocol;
    this.myInterval = time.subscribe(() => {

      this.dataService.getMqtt(params).subscribe(response => {
        // console.log('getMqtt',)
        if (response) {
          // console.log(this.WIDGET_REQUEST.CONFIG_NAME)
         
          const res = response.data;

          const value = JSON.parse(JSON.stringify(response.data));

          this.newDevice.ASSET_CONFIG_ID = this.WIDGET_REQUEST.ASSET_CONFIG_ID;
          this.newDevice.DEVICE_ID = res.sensorId;
          this.newDevice.STATUS = true;
          this.newDevice.VALUE = JSON.stringify(value);
          this.newDevice.LOCATION = res.location;
          this.newDevice.LAST_UPDATE_TIME = res.date;

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

  getFilterArr() {


    this.isLOCATIONS = false;

    this.myLOCATIONS = this.widgetResponse.totalLocations.map((z: any) => {
      return {
        name: z.LOCATION
      }
    });

  }
  // hideFilterStep:boolean=false;
  addEvent(_change: any, event: any) {
    // console.log(this.VALUES)
    this.newForm.patchValue({
      filterStep: ''
    })
    // this.hideFilterStep=true;
  }
  resetDatePickerVal(event: any) {
    this.newForm.patchValue({
      START_DATE: null, END_DATE: null
    })
    // this.hideFilterStep=false;
  }
}
