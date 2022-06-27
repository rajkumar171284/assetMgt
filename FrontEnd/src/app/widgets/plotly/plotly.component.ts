import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice } from '../../myclass';
import { interval } from 'rxjs';
import * as moment from 'moment'
interface xcol {
  MAC_ADDRESS_ID: number
}


interface _device {
  DEVICE_ID: any
}

@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PlotlyComponent implements OnInit, OnChanges, OnDestroy {
  newForm: FormGroup = this.fb.group({

    // SENSOR_TYPE_ID: ['', Validators.required],
    PLOT_XAXES: [''],
    PLOT_TYPE: [''],
  })
  @Input() WIDGET_REQUEST: any;
  labelMessage: any;
  labelMessage2: any;
  deviceType: string = '';
  chartName: any;
  @Input('pMap') pMap: any;
  @Input() name: any;
  filterBy: any[] = ['KM', 'SPEED'];

  filterXaxes: any[] = ['DEVICE', 'LOCATION'];
  // @Input() xAxes: any;
  public data: any;
  public layOut: any;
  // graph = {
  //   data: [],
  //   layout: { width: 520, height: 340, title: 'Sample Plot' },
  //   pointIndex: 1
  // };

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
  widgetResponse: any = {
    locations: [],
    protocol: {},
    data: [],
    status: '',
    totalDevice: [],
  };

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
  deviceList: _device[] = []
  constructor(private fb: FormBuilder, private dataService: AuthService, private ref: ChangeDetectorRef) {

    console.log(moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss").toString())
    //  console.log(moment().subtract(1,'days').endOf('day').toString())

  }

  ngOnInit(): void {


  }
  ngOnDestroy(): void {
    this.myInterval?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes, this.pMap)
    this.filterSrc()
    if (this.WIDGET_REQUEST) {

      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();

      console.log('chart reqs:', this.WIDGET_REQUEST.CHART_NAME, this.WIDGET_REQUEST.ASSET_CONFIG_ID, this.WIDGET_REQUEST.WIDGET_DATA)
      if (this.WIDGET_REQUEST.WIDGET_TYPE == 'CHARTS') {
        this.getDeviceLog()
        // this.labelMessage = `Total Count`;
        if (this.WIDGET_REQUEST.CHART_NAME == "gauge") {
          this.filterShow2 = true;
          this.filterShow1 = false;

          this.newForm = this.fb.group({

            // SENSOR_TYPE_ID: ['', Validators.required],
            PLOT_XAXES: [''],
            PLOT_TYPE: [''],
            LOCATION: [''],
            START_DATE: [''],
            END_DATE: ['']
          })
          // run tatapower api to get random data those to be saved in db
          this.newForm.patchValue({
            START_DATE: new Date(this.todayStartDate),
            END_DATE: new Date(this.todayEndDate)
          })


        } else {
          this.filterShow1 = true;
          this.filterShow2 = false;
          this.getDeviceLog()

        }
      }

    }

  }

  get VALUES() {
    return this.newForm.value;
  }
  filterSrc() {
    // console.log(this.todayStartDate)

    // console.log(moment(this.VALUES.START_DATE).startOf('day').format("YYYY-MM-DD HH:mm:ss").toString())

    this.WIDGET_REQUEST.START_DATE = moment(this.VALUES.START_DATE).format("YYYY-MM-DD 00:00:00").toString();
    this.WIDGET_REQUEST.END_DATE = moment(this.VALUES.END_DATE).format("YYYY-MM-DD 23:59:00").toString();
    console.log('this.WIDGET_REQUEST-charts', this.WIDGET_REQUEST)
  }

  async getDeviceLog() {
    let arr: any = []

    const params: any = {
      ASSET_CONFIG_ID: this.WIDGET_REQUEST.ASSET_CONFIG_ID,
      START_DATE: moment(this.VALUES.START_DATE).format("YYYY-MM-DD 00:00:00").toString(),
      END_DATE: moment(this.VALUES.END_DATE).format("YYYY-MM-DD 23:59:00").toString()

    }
    // console.log(params)
    this.dataService.getDeviceHistoryByFilter(params).subscribe(async result => {
      console.log(result)
      const set = false;
      if (result && result.data.length > 0 && !set) {
        this.widgetResponse = result;
        // this.widgetResponse.totalDevice.history=[];
        const protocol = result.protocol;
        // console.log('MQTT',protocol)
        if (protocol && protocol[0].CONN_NAME == 'MQTT') {
          // console.log('MQTT')
          this.getMQTTdata()
        }
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
              // console.log(Object.keys(VALUE))
              // const newObject = Object.keys(VALUE);
              // console.log('newObject', newObject)
              // let oIndex = 0;
              for (let a of Object.keys(VALUE)) {
                // console.log(Object.keys(VALUE)[oIndex])
                let key: any = a;
                var object: any = {};
                object[key] = 0;
                sensor.unitsArr.push(object)
                // console.log(object);
                // oIndex++;
              }
            } catch (err) {
              VALUE = JSON.stringify(VALUE);
              sensor.VALUE = VALUE;
              for (let a of Object.keys(VALUE)) {
                // console.log(Object.keys(VALUE)[oIndex])
                let key: any = a;
                var object: any = {};
                object[key] = 0;
                sensor.unitsArr.push(object)
                // console.log(object);
                // oIndex++;
              }

            }
          }

          // get total units value
          for (let unit of sensor.unitsArr) {
            // console.log('unit', Object.keys(unit))
            for (let u of Object.keys(unit)) {
              console.log('unit', u)
              // let mp=sensor.history.map((hItem: any) => {
              //   console.log('hItem', Object.keys(hItem))
              //   return  Object.keys(hItem).map(z => u)
              //   //  hItem
              // })
              // console.log(mp)
            }


            let uIndex = sensor.history.findIndex((x: any) => {
              console.log(Object.keys(x))
              for (let key of Object.keys(x)) {
                console.log(key)
              }
              return x
            });

          }
        }
        console.log(this.widgetResponse)
        if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'gauge') {

          var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: 270,
              title: { text: "Speed" },
              type: "indicator",
              mode: "gauge+number"
            }
          ];
          this.graph1.data = data;
          this.graph1.layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

        }
        // result.data.forEach((ele: any) => {
        //   ele.DATA_VALUE=ele.VALUE?JSON.parse(ele.VALUE):''
        //   arr.push(ele)
        // });

        // this.widgetResponse = result.data.map((ele: any) => {
        //   // if(ele.VALUE){
        //   //   try {
        //   //     ele.DATA_VALUE=JSON.parse(ele.VALUE)
        //   //   }
        //   //   catch(e){
        //   //     return false;
        //   //   }
        //   // }

        //   // ele.DATA_VALUE=ele.VALUE?JSON.parse(ele.VALUE):''
        //   return ele;
        // });
        // get x axes as  
        this.ref.detectChanges();
        return;
        for (let a of result.totalDevice) {
          a.totalSpeed = 0;
          a.totalKM = 0;
          result.data.filter((x: any) => {
            return x.DEVICE_ID == a.DEVICE_ID;
          }).map((resp: any) => {
            const value = JSON.parse(resp.VALUE);
            a.totalSpeed = a.totalSpeed + value.speed;
            a.totalKM = a.totalKM + value.odometer;
          })
        }
        // console.log(result)
        if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'pie') {
          this.pieChart(result)
        } else {

          // default
          this.newForm.patchValue({
            PLOT_TYPE: this.filterBy[0],
            PLOT_XAXES: this.filterXaxes[0]
          })
          // console.log(this.newForm.value)


          this.xAndYaxesChart(result)
        }



      }
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
}
