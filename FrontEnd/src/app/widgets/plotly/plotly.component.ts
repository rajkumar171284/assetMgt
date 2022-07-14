import { Component, OnInit, Input, ViewChild, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice, plotly_small_layout } from '../../myclass';
import { interval } from 'rxjs';
import * as moment from 'moment'
import { XAxisComponent } from '../../components/x-axis/x-axis.component';

const colors = ["(255,165,0)", "(255,105,180)", "(124,252,0)", "(0,128,0)", "(100,149,237)", "(64,224,208)", "(0,255,127)",
  "(138,43,226)", "(153,50,204)", "(255,105,180)", "(0,191,255)", "(255,105,180)", "(210,105,30)", "(148,0,211)", "(65,105,225)", "(100,149,237)","(255,105,180)","(72,209,204)","(0,128,128)"]
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
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PlotlyComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('xAxis', { static: true }) xAxis!: XAxisComponent;
  @Input() WIDGET_REQUEST: any;
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
  loading = true;
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
  isDataFound: boolean = false;

  todayStartDate: any = moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss").toString();
  todayEndDate: any = moment().endOf('day').toString();
  deviceList: _device[] = [];
  showGuage = false;
  plotlyIndex: number = 0;
  singleView: any = [];
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

  getXaxis(data: any) {
    // console.log(data)
    this.WIDGET_REQUEST.XAXES = data;
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
    // console.log(changes, this.pMap)
    // 
    if (this.WIDGET_REQUEST) {
      this.widgetResponse = new widgetResponse();

      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
    }

  }

  get VALUES() {
    return this.newForm.value;
  }

  getDeviceLog(result: any) {
    // console.log(result)


    if (result && result.data.length > 0) {

      this.widgetResponse.data = result.data;
      this.widgetResponse.protocol = result.protocol;
      this.widgetResponse.totalDevice = result.totalDevice;


      // console.log(this.widgetResponse)
      if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'gauge') {
        this.showGuage = true;
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

      // get x axes as  
      // this.ref.detectChanges();
      // return;
      // for (let a of result.totalDevice) {
      //   a.totalSpeed = 0;
      //   a.totalKM = 0;
      //   result.data.filter((x: any) => {
      //     return x.DEVICE_ID == a.DEVICE_ID;
      //   }).map((resp: any) => {
      //     const value = JSON.parse(resp.VALUE);
      //     a.totalSpeed = a.totalSpeed + value.speed;
      //     a.totalKM = a.totalKM + value.odometer;
      //   })
      // }
      // console.log(result)


      else if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'line') {
        this.plotlyIndex = 0;
        console.log(this.WIDGET_REQUEST.CHART_NAME.toLowerCase(), this.WIDGET_REQUEST.CONFIG_NAME)
        let linedata: any = [];
        let newVALUE: any = [], xArray: any = [];
        let index = 0;
        this.singleView = []
        for (let a of this.widgetResponse.totalDevice) {
          if (a.history.length > 0) {

            xArray = a.history.map((z: any) => {
              let dt = new Date(z.LAST_UPDATE_TIME);
              return dt;
            });
            // const unique = [...new Set(xArray.map((uniq: any) => uniq))];//collect unique dates

            // y value
            for (let units of a.unitsArr) {
              // format VALUE json as key & value

              let trace = {
                x: xArray,
                // y: yArray, 
                y: units.data,
                mode: 'scatter+points',
                type: this.WIDGET_REQUEST.CHART_NAME.toLowerCase(),
                // name: a.DEVICE_ID,
                name: units.key
              };
              linedata.push(trace);
              // loop view
              this.singleView.push({
                data: [trace],
                layout: new plotly_small_layout(),
                useResize: true

              })
            }
          }



          index++;

        }
        // // Define Layout
        var layout = {
          yaxis: { autorange: true, title: "" },
          showlegend: true,
          autosize: true,
          width: 900,
          height: 500,
          margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
          },
          // paper_bgcolor: '#7f7f7f',
          // plot_bgcolor: '#c7c7c7'
        };


        // Display using Plotly
        this.graph1.data = linedata;
        this.graph1.layout = layout;
        console.log(linedata)


      }
      else if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'pie') {
        this.pieChart(result)
      } else if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'bar') {

        // default
        // this.newForm.patchValue({
        //   PLOT_TYPE: this.filterBy[0],
        //   PLOT_XAXES: this.filterXaxes[0]
        // })
        // console.log(this.newForm.value)


        this.barChart(result)
      } else {
        this.newForm.patchValue({
          PLOT_TYPE: this.filterBy[0],
          PLOT_XAXES: this.filterXaxes[0]
        })
        // console.log(this.newForm.value)


        this.xAndYaxesChart(result)
      }



    }
    this.loading = false;
    this.ref.detectChanges();
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

  barChart(result: any) {
    // console.log('bar', result)
    let unique: any = [];
    let data: any = [];

    // let xArray: any = [];
    let xArray: any = [];
    for (let a of this.widgetResponse.totalDevice) {
      if (a.history.length > 0) {
        xArray = a.history.map((z: any) => {
          let dt = new Date(z.LAST_UPDATE_TIME);
          return dt;
        });
        let index = 0;
        for (let units of a.unitsArr) {
          const newData = {
            x: xArray,
            y: units.data,
            type: "bar",
            name: units.key,
           
          }
          const newData2 = {
            x: xArray,
            y: units.data,
            type: "bar",
            name: units.key,
            marker: {
              color: `rgb${colors[index]}`
            }
          }
          data.push(newData);
          // loop view
          this.singleView.push({
            data: [newData2],
            layout: new plotly_small_layout(),
            useResize: true

          })
          index++;
        }
      }
      // 

    }


    this.graph1.data = data;
    this.graph1.layout.width = 800;
    this.graph1.layout.height = 340;
    this.graph1.responsive = true;

    this.graph1.layout.title = this.WIDGET_REQUEST && this.WIDGET_REQUEST ? `${this.WIDGET_REQUEST.CONFIG_NAME} ${this.newForm.value.PLOT_TYPE.toUpperCase()}` : '';
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

  getLoader(data: boolean) {
    this.loading = data;
  }
  getFromChild(data: any) {
    // this.loading = false;
    this.widgetResponse = new widgetResponse();
    console.log('getFromChild', data)
    if (data) {
      this.errMessage = '';

      this.isDataFound = true;
      this.getDeviceLog(data)

    } else {
      this.isDataFound = false;
      // no record- data empty array      
      this.errMessage = 'No data found..Please try other dates.'
    }
    console.log(this.loading, this.errMessage)
  }
}
