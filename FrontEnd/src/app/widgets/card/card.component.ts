import { Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, Input, DoCheck, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice } from '../../myclass';
import { interval } from 'rxjs';
import * as moment from 'moment';
import { XAxisService } from '../../services/x-axis.service';
declare let $: any;

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
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnChanges, OnDestroy, DoCheck, AfterViewInit {
  loading = true;
  @ViewChild("divBoard") divBoard!: ElementRef;

  @Input() WIDGET_REQUEST: any;
  errMessage: any;
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
  @Input() selectedDevice: any;
  isDataFound: boolean = false;
  @Input() widgetIndex: any;

  todayStartDate: any = moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss").toString();
  todayEndDate: any = moment().endOf('day').toString();
  deviceList: _device[] = [];
  @Output() _widgetData = new EventEmitter();
  divElement!: any;
  constructor(private fb: FormBuilder, public service: XAxisService, public dataService: AuthService, private ref: ChangeDetectorRef) {

    // console.log(moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss").toString())
    this.newForm = this.fb.group({
      PLOT_XAXES: [''],
      PLOT_TYPE: [''],
      LOCATION: ['', this.filterShow2 ? Validators.required : ''],
      START_DATE: ['', this.filterShow2 ? Validators.required : ''],
      END_DATE: ['', this.filterShow2 ? Validators.required : ''],
      DEVICE_ID: []
    })



  }
  ngAfterViewInit(): void {
    this.divElement = this.divBoard.nativeElement;
  }
  ngOnInit(): void {
    // const status = this.dataService.getAccess();
    // if (status) {
    //   this.watchSize();
    // }

  }
  ngDoCheck(): void {
    const status = this.dataService.getAccess();
    if (status) {
      this.watchSize();
    }
  }


  watchSize() {
    // const id = this.widgetIndex.toString();
    let that = this;
    let x = that.divElement;
    $(x).resizable({
      stop: function (event: Event, ui: any) {
        // console.log(ui)
        let height: number = $(ui.size.height)[0];
        let width: number = $(ui.size.width)[0];
        let top: number = $(ui.position.top)[0];
        let left: number = $(ui.position.left)[0];
        const newSize: any = {
          width: width, height: height, top: top,
          left: left
        }

        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(newSize);
        // that.service.updateWidgetReq(that.WIDGET_REQUEST);

        // sending/emitting data to parent-dashboard.ts for saving into api
        that._widgetData.emit(that.WIDGET_REQUEST)
        
      }
    });


    $(x).draggable({
      stop: function (event: Event, ui: any) {
        // console.log(ui)
        let top: number = $(ui.position.top)[0];
        let left: number = $(ui.position.left)[0];
        const orgSize = JSON.parse(that.WIDGET_REQUEST.WIDGET_SIZE);
        const newSize = {
          width: orgSize.width,
          height: orgSize.height,
          top: top, left: left
        }
        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(newSize);
        // that.service.updateWidgetReq(that.WIDGET_REQUEST);

        // sending/emitting data to parent-dashboard.ts for saving into api
        that._widgetData.emit(that.WIDGET_REQUEST)
      }
    })

  }
  watchSizeOld() {
    const id = this.widgetIndex.toString();
    let that = this;
    // let x = document.getElementById(id);
    let x = this.divElement;
    // console.log(x)
    $(x).resizable({
      stop: function (event: Event, ui: any) {
        console.log(ui)
        let height: number = $(ui.size.height)[0];
        let width: number = $(ui.size.width)[0];
        let top: number = $(ui.position.top)[0];
        let left: number = $(ui.position.left)[0];
        const newSize: any = {
          width: width, height: height, top: top,
          left: left
        }
        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(newSize);

        // sending/emitting data to parent-dashboard.ts for saving into api
        that._widgetData.emit(that.WIDGET_REQUEST)
      }
    });
    $(x).draggable({
      stop: function (event: Event, ui: any) {
        console.log(ui)
        let top: number = $(ui.position.top)[0];
        let left: number = $(ui.position.left)[0];
        const orgSize = JSON.parse(that.WIDGET_REQUEST.WIDGET_SIZE);
        const newSize = {
          width: orgSize.width,
          height: orgSize.height,
          top: top, left: left
        }
        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(newSize);

        // sending/emitting data to parent-dashboard.ts for saving into api
        that._widgetData.emit(that.WIDGET_REQUEST)
      }
    })

  }
  ngOnDestroy(): void {
    this.myInterval?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    // 
    if (this.WIDGET_REQUEST) {
      this.widgetResponse = new widgetResponse();

      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      const size = JSON.parse(this.WIDGET_REQUEST.WIDGET_SIZE);
      // console.log('size', size, this.WIDGET_REQUEST.CHART_NAME)


    }

  }

  get VALUES() {
    return this.newForm.value;
  }
  filterSrc() {
    this.errMessage = '';
    this.WIDGET_REQUEST.LOCATION = this.VALUES.LOCATION;
    this.WIDGET_REQUEST.START_DATE = moment(this.VALUES.START_DATE).format("YYYY-MM-DD 00:00:00").toString();
    this.WIDGET_REQUEST.END_DATE = moment(this.VALUES.END_DATE).format("YYYY-MM-DD 23:59:00").toString();
    this.WIDGET_REQUEST.DEVICE_ID = this.VALUES.DEVICE_ID;

    console.log('this.WIDGET_REQUEST-charts', this.WIDGET_REQUEST)
    // this.getDeviceLog();
  }
  getLoader(data: boolean) {
    this.loading = data;
  }
  async getDeviceLog(result: any) {
    // loader
    this.errMessage = '';
    // console.log(result)
    const set = false;
    if (result && result.data.length > 0 && !set) {

      this.widgetResponse.data = result.data;
      this.widgetResponse.protocol = result.protocol;
      this.widgetResponse.totalDevice = result.totalDevice
      const protocol = result.protocol;
      // console.log('MQTT',protocol)

      // const objectKeys = await result.data.map(this.getKEYS)
      for (let sensor of this.widgetResponse.totalDevice) {
        sensor.history = [];
        sensor.unitsArr = [];
        sensor.units = [];
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
            let aIndex = 0;
            for (let a of Object.keys(VALUE)) {
              let key: any = a;
              var object: any = {};
              object.key = key;
              object.totalValue = 0;
              sensor.unitsArr.push(object);
              // latest value      
              if (key != 'location' && key != 'date' && key != 'sensorId') {
                var object2: any = {};
                object2.key = key;
                object2.value = Object.values(VALUE)[aIndex];
                sensor.units.push(object2);
              }
              aIndex++;
            }
          } catch (err) {
            VALUE = JSON.stringify(VALUE);
            sensor.VALUE = VALUE;
            let aIndex = 0;
            for (let a of Object.keys(VALUE)) {
              let key: any = a;
              var object: any = {};
              object.key = key;
              object.totalValue = 0;
              sensor.unitsArr.push(object);


              // latest value      
              if (key != 'location' && key != 'date' && key != 'sensorId') {
                var object2: any = {};
                object2.key = key;
                object2.value = Object.values(VALUE)[aIndex];
                sensor.units.push(object2);
              }

              aIndex++;
            }

          }
        }

        // get total units value- later calc
        // for (let unit of sensor.unitsArr) {
        //   sensor.history.forEach((Item: any) => {
        //     let vIndex = 0;
        //     for (let v of Object.keys(Item)) {
        //       if (v === unit.key) {
        //         // console.log(Object.keys(Item)[vIndex])
        //         unit.totalValue = unit.totalValue + Object.values(Item)[vIndex]
        //       }
        //       vIndex++;
        //     }
        //   })
        // }

      }

      // console.log(this.widgetResponse)
      this.loading = false;//loader
      this.ref.detectChanges();

    } else {
      this.errMessage = 'No data found.';
      this.loading = false;//loader
      this.ref.detectChanges();
    }


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
        console.log(this.deviceList)
        // for (let a of Object.keys(VALUE)) {
        //   console.log(arr)
        // }
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
        console.log(this.deviceList)
        // console.log('stringify',VALUE); 
        // console.log('stringify',VALUE.activePower); 
        for (let a of Object.keys(VALUE)) {
          // console.log(a)
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
    // this.graph1.layout.width = 820;
    this.graph1.layout.height = 340;
    this.graph1.responsive = true;

    this.graph1.layout.title = this.WIDGET_REQUEST && this.WIDGET_REQUEST ? `${this.WIDGET_REQUEST.CONFIG_NAME} - Plot by ${this.newForm.value.PLOT_TYPE.toUpperCase()}` : '';
    console.log(this.graph1)
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
      title: "Area Under Forest for Different Countries"
    };
    this.graph1.data = this.data;
    this.graph1.layout.title = this.WIDGET_REQUEST && this.WIDGET_REQUEST ? `${this.WIDGET_REQUEST.CONFIG_NAME} - Plot by ${this.WIDGET_REQUEST.WIDGET_DATA}` : '';

  }

  // We'll bind the hover event from plotly
  hover(event: any): void {
    // The hover event has a lot of information about cursor location.
    // The bar the user is hovering over is in "pointIndex"
    console.log(event)
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
          // console.log(value.activePower)

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
      // for (let a of Object.keys(VALUE)) {
      //   console.log(arr)
      // }
    } catch (err) {
      VALUE = JSON.parse(VALUE);
      data.VALUE = VALUE;
      return data;
      // console.log('stringify',VALUE); 
      // console.log('stringify',VALUE.activePower); 
      // for (let a of Object.keys(VALUE)) {
      //   // console.log(a)
      // }
    }

  }

  getFromChild(data: any) {
    // this.loading = false;
    this.widgetResponse = new widgetResponse();
    console.log('getFromChild', data)
    if (data && data.totalDevice.length > 0) {
      this.errMessage = '';

      this.isDataFound = true;
      this.widgetResponse.totalDevice = data.totalDevice;

      // this.service.sendTotalDevice(data.totalDevice)
      this.getDeviceLog(data);
      this.loading = false;
      // this.ref.detectChanges();

    } else {
      this.widgetResponse.totalDevice = [];
      this.isDataFound = false;
      // no record- data empty array      
      this.errMessage = 'No data found..Please try other dates.';
      this.loading = false;
      this.ref.detectChanges();
    }
    console.log(this.loading, this.errMessage)
  }
  saveWidget(status: boolean) {
    // save widget only
    this.WIDGET_REQUEST.LOADED = status;//
    this._widgetData.emit(this.WIDGET_REQUEST)
  }


}
