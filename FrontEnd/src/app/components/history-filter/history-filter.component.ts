import { Component, EventEmitter,OnInit, Input, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, Output } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice } from '../../myclass';
import { interval } from 'rxjs';
import * as moment from 'moment'

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
export class HistoryFilterComponent implements OnInit, OnChanges, OnDestroy  {

  @Input() WIDGET_REQUEST: any;
  @Output() sendToParent= new EventEmitter();
  errMessage: string = '';
  labelMessage2: any;
  deviceType: string = '';
  chartName: any;
  @Input('pMap') pMap: any;
  @Input() name: any;
  filterBy: any[] = ['KM', 'SPEED'];
  newForm: FormGroup = this.fb.group({
    PLOT_XAXES: [''],
    PLOT_TYPE: [''],
    LOCATION: [''],
    START_DATE: [''],
    END_DATE: ['']
  })
  filterXaxes: any[] = ['DEVICE', 'LOCATION'];

  public data: any;
  public layOut: any;
  graph1: any = {
    data: [
      { x: [], y: [], type: '' },
    ],
    layout: {
      width: 420, height: 300, marginLeft: -20,
      title: ''
    },
    responsive: true
  };

  graph2 = {
    data: [
      { x: [1, 2, 3, 4, 5], y: [1, 4, 9, 4, 1], type: 'scatter' },
      { x: [1, 2, 3, 4, 5], y: [1, 3, 6, 9, 6], type: 'scatter' },
      { x: [1, 2, 3, 4, 5], y: [1, 2, 4, 5, 6], type: 'scatter' },
    ],
    layout: { title: 'Some Data to Highlight' }
  };

  interactivePlotSubject$: Subject<any> = new BehaviorSubject<any>(this.graph2.data);
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

  todayStartDate: any = moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss").toString();
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
      DEVICE_ID: ['']
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
              START_DATE: new Date(this.todayStartDate),
              END_DATE: new Date(this.todayEndDate),
              LOCATION: this.widgetResponse.totalLocations[0].LOCATION,
              DEVICE_ID:this.widgetResponse.totalLocations[0].MAC_ADDRESS

            })
            this.filterSrc()

          } else {
            // no device

          }
        })


      }

    }

  }

  get VALUES() {
    return this.newForm.value;
  }
  filterSrc() {
    this.loading = true;
    this.errMessage = '';
    this.WIDGET_REQUEST.LOCATION = this.VALUES.LOCATION;
    this.WIDGET_REQUEST.START_DATE = moment(this.VALUES.START_DATE).format("YYYY-MM-DD 00:00:00").toString();
    this.WIDGET_REQUEST.END_DATE = moment(this.VALUES.END_DATE).format("YYYY-MM-DD 23:59:00").toString();
    this.WIDGET_REQUEST.DEVICE_ID=  this.VALUES.DEVICE_ID;
    console.log('this.WIDGET_REQUEST-charts', this.WIDGET_REQUEST)
    this.getDeviceLog();
  }

  getDeviceLog() {
    // loader
    this.dataService.getDeviceHistoryByFilter(this.WIDGET_REQUEST).subscribe(result => {
      // console.log(result)
      const set = false;

      if (result && result.data.length > 0 && !set) {
        this.widgetResponse.data = result.data;
        this.widgetResponse.protocol = result.protocol;
        this.widgetResponse.totalDevice = result.totalDevice;
        
        const protocol = result.protocol;
        // console.log('MQTT',protocol)
        if (protocol && protocol[0].CONN_NAME == 'MQTT') {
          // console.log('MQTT')
          this.getMQTTdata()
        }
        console.log(this.widgetResponse)
        // const objectKeys = await result.data.map(this.getKEYS)
        for (let sensor of this.widgetResponse.totalDevice) {
          sensor.history = [];
          sensor.unitsArr = [];
          sensor.history = this.widgetResponse.data.filter((obj: any) => {
            return obj.DEVICE_ID == sensor.DEVICE_ID;
          }).map((resp: any) => {
            let VALUE = resp.VALUE;
            resp.newVALUE = '';
            try {
              resp.newVALUE = JSON.parse(VALUE);
            } catch (err) {
              resp.newVALUE = JSON.stringify(VALUE);
            }
            return resp.newVALUE;
          })
          // setup unique object
          let index = this.widgetResponse.data.findIndex((obj: any) => {
            return obj.DEVICE_ID == sensor.DEVICE_ID;
          })
          if (index != -1) {

            let VALUE = this.widgetResponse.data[index].VALUE;
            try {
              VALUE = JSON.parse(VALUE);
              sensor.VALUE = VALUE;
              // for (let a of Object.keys(VALUE)) {
              //   let key: any = a;
              //   if (key != 'location' && key != 'date' && key != 'sensorId') {
              //     var object: any = {};
              //     object.key = key;
              //     object.totalValue = 0;
              //     sensor.unitsArr.push(object);

              //   }
              // }
            } catch (err) {
              VALUE = JSON.stringify(VALUE);
              sensor.VALUE = VALUE;
              // for (let a of Object.keys(VALUE)) {
              //   let key: any = a;
              //   if (key != 'location' && key != 'date' && key != 'sensorId') {
              //     var object: any = {};
              //     object.key = key;
              //     object.totalValue = 0;
              //     sensor.unitsArr.push(object);
              //   }
              // }

            }
            for (let a of Object.keys(VALUE)) {
              // dynamic key wise getting value 
              let key: any = a;
              if (key != 'location' && key != 'date' && key != 'sensorId') {
                var object: any = {};
                object.key = key;
                object.totalValue = 0;
                object.data = [];
                sensor.unitsArr.push(object);

              }
            }
          }

          // get total units value
          for (let unit of sensor.unitsArr) {
            sensor.history.forEach((Item: any) => {
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
        console.log(this.widgetResponse)
        



      } else {
        this.errMessage = 'No Data found..';

      }
      this.loading = false;
      // console.log(this.loading)
      this.ref.detectChanges();
    })

  }

  getKEYS(result: any) {
    if (result) {

      try {
        const VALUE = JSON.parse(result.VALUE);
        // console.log('parse', VALUE);
        let index = this.deviceList.findIndex((item: any) => {

          return item.DEVICE_ID == result.DEVICE_ID;
        })
        if (index == -1) {
          this.deviceList.push({
            DEVICE_ID: result.DEVICE_ID
          })
        }

      } catch (err) {
        const VALUE = JSON.parse(JSON.stringify(result.VALUE));
        let index = this.deviceList.findIndex((item: _device) => {

          return item.DEVICE_ID == result.DEVICE_ID;
        })
        if (index == -1) {
          this.deviceList.push({
            DEVICE_ID: result.DEVICE_ID
          })
        }


      }



      // console.log(VALUE.activePower)


    }
  }
  xAndYaxesChart(result: any) {

    let plotArray: any = [];
    if (this.newForm.value.PLOT_XAXES == 'DEVICE') {
      for (let a of result.totalDevice) {
        a.key = `D${a.DEVICE_ID}`;
        a.totalSpeed = 0;
        a.totalKM = 0;
        result.data.filter((x: any) => {
          return x.DEVICE_ID == a.DEVICE_ID;
        }).map((resp: any) => {
          const value = JSON.parse(resp.VALUE);
          a.totalSpeed = a.totalSpeed + value.speed;
          a.totalKM = a.totalKM + value.odometer;
        })
        plotArray.push(a)
      }
    } else {
      // loc axes
      for (let a of result.Locations) {
        a.key = a.LOCATION;
        a.totalSpeed = 0;
        a.totalKM = 0;
        result.data.filter((x: any) => {
          return x.LOCATION == a.LOCATION;
        }).map((resp: any) => {
          const value = JSON.parse(resp.VALUE);
          a.totalSpeed = a.totalSpeed + value.speed;
          a.totalKM = a.totalKM + value.odometer;

        })
        plotArray.push(a)
      }
    }

    // 
    let newArr: any = [];
    for (let el of plotArray) {
      let xData;

      if (this.newForm.value.PLOT_TYPE == 'SPEED') {
        xData = el.totalSpeed;
      } else if (this.newForm.value.PLOT_TYPE == 'KM') {
        xData = el.totalKM
      }
      let item: any = {
        x: [el.key], y: [`Total ${this.newForm.value.PLOT_TYPE} ${xData}`], type: this.WIDGET_REQUEST && this.WIDGET_REQUEST.CHART_NAME ? this.WIDGET_REQUEST.CHART_NAME.toLowerCase() : ''
      }
      newArr.push(item)

    }

    this.graph1.data = newArr;
    this.graph1.layout.height = 340;
    this.graph1.responsive = true;

    this.graph1.layout.title = this.WIDGET_REQUEST && this.WIDGET_REQUEST ? `${this.WIDGET_REQUEST.CONFIG_NAME} - Plot by ${this.newForm.value.PLOT_TYPE.toUpperCase()}` : '';
    // console.log(this.graph1)
  }

  pieChart(result: any) {

    let itemValue = result.totalDevice.map((z: any) => z.totalSpeed);
    let itemID = result.totalDevice.map((z: any) => `D${z.DEVICE_ID}`)
    var traceA = {
      type: "pie",
      values: itemValue,
      labels: itemID,
      hole: 0.25,
      pull: [0.1, 0, 0, 0, 0],
      direction: 'clockwise',
      marker: {
        colors: ['#CDDC39', '#673AB7', '#F44336', '#00BCD4', '#607D8B'],
        line: {
          color: 'black',
          width: 1
        }
      },
      textfont: {
        family: 'Lato',
        color: 'white',
        size: 18
      },
      hoverlabel: {
        bgcolor: 'black',
        bordercolor: 'black',
        font: {
          family: 'Lato',
          color: 'white',
          size: 18
        }
      }
    };

    this.data = [traceA];

    var layout = {
      title: ""
    };
    this.graph1.data = this.data;
    this.graph1.layout.title = this.WIDGET_REQUEST && this.WIDGET_REQUEST ? `${this.WIDGET_REQUEST.CONFIG_NAME} - Plot by ${this.WIDGET_REQUEST.WIDGET_DATA}` : '';

  }

  // We'll bind the hover event from plotly
  hover(event: any): void {
    // The hover event has a lot of information about cursor location.
    // The bar the user is hovering over is in "pointIndex"
    // console.log(event)
    this.interactivePlotSubject$.next(
      [this.graph2.data[event.points[0].pointIndex]]
    );
  }
  // Reset to default when hovering stops
  mouseLeave(event: Event): void {
    this.interactivePlotSubject$.next(this.graph2.data);
  }

  onFilterChange() {
    this.xAndYaxesChart(this.widgetResponse)


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
          this.newDevice.UNITS = JSON.stringify(value);
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
