import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface xcol {
  MAC_ADDRESS_ID: number
}
@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PlotlyComponent implements OnInit, OnChanges {
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
  filterBy: any[] = ['SPEED', 'KM'];

  filterXaxes: any[]=['DEVICE','LOCATION'];
  // @Input() xAxes: any;
  public data: any;
  public layOut: any;
  graph = {
    data: [],
    layout: { width: 520, height: 340, title: 'Sample Plot' },
    pointIndex: 1
  };

  graph1 = {
    data: [
      { x: [], y: [], type: '' },
    ],
    layout: {
      width: 420, height: 300, marginLeft: -20,
      title: ''
    }
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
  widgetResponse: any;
  constructor(private fb: FormBuilder, private dataService: AuthService, private ref: ChangeDetectorRef) { }
  monthsData: any = [
    '9:00:00',
    '9:30:00',
    '10:00:00',
    '10:30:00',
    '11:00:00',
    '11:30:00',
    '12:00:00',

    '12:30:00',
    '13:00:00',
    '13:30:00',
    '14:30:00', '15:00:00',
    '15:30:00',
    '16:00:00',
    '16:30:00', '17:00:00',
    '17:30:00',
    '18:00:00',

  ];
  chartCatg: any = 'scatter';
  ngOnInit(): void {
  }


  getData() {
    let xDate: any = [];
    let value: any = []
    let value2: any = []

    let value3: any = []
    let value4: any = []
    let xCol: any = [];

    this.dataService.getAllMACstatus().subscribe(res => {
      // console.log(res)
      this.ref.detectChanges();
      if (res && res.data.length > 0) {
        const unique = [...new Set(res.data.map((item: any) => item.MAC_ADDRESS))]; // [ 'A', 'B']
        // console.log(unique)
        res.data.forEach((item: any) => {

          xDate.push(item.CREATED_DATE);
          if (item.MAC_ADDRESS_ID == 1) {
            value.push(item.VALUE)
          }
          if (item.MAC_ADDRESS_ID == 2) {
            value2.push(item.VALUE)
          }
          if (item.MAC_ADDRESS_ID == 3) {
            value3.push(item.VALUE)
          }


          if (item.MAC_ADDRESS_ID == 4) {
            value4.push(item.VALUE)
          }

        })
        let item: any = [{ x: unique, y: value, type: this.chartCatg },
        { x: unique, y: value2, type: this.chartCatg },
        { x: unique, y: value3, type: this.chartCatg },
        { x: unique, y: value4, type: this.chartCatg }]
        this.graph1.data = item;
        this.graph1.layout.title = this.pMap;

        // this.graph1.data=res.data.map((item:any)=>{
        //   return { x: this.monthsData, y: [item.VALUE], type: 'line' }
        // })
      }
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes, this.pMap)
    if (this.WIDGET_REQUEST) {
      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      console.log('chart req:', this.WIDGET_REQUEST)
      if (this.WIDGET_REQUEST.WIDGET_TYPE == 'CHARTS' && this.WIDGET_REQUEST.WIDGET_DATA == "COUNT") {
        this.labelMessage = `Total Count`;

        this.getCurrDeviceByLabel()


      }
    }

  }

  async getCurrDeviceByLabel() {
    console.log('this.WIDGET_REQUEST-charts-count', this.WIDGET_REQUEST)
    this.dataService.getDeviceCurrStatusByConfigID(this.WIDGET_REQUEST).subscribe(result => {
      // console.log(result)
      if (result && result.data.length > 0) {
        this.widgetResponse = result;
        // get x axes as  
        this.ref.detectChanges();
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
        console.log(result)
        if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'pie') {
          this.pieChart(result)
        } else {

          // default
          this.newForm.patchValue({
            PLOT_TYPE: this.filterBy[0],
            PLOT_XAXES:this.filterXaxes[0]
          })
          console.log(this.newForm.value)


          this.xAndYaxesChart(result)
        }



      }
    })

  }

  xAndYaxesChart(result: any) {

    let plotArray:any=[];
    if (this.newForm.value.PLOT_XAXES == 'DEVICE') {
      for (let a of result.totalDevice) {
        a.key=`D${a.DEVICE_ID}`;
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
        a.key=a.LOCATION;
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
      console.log(xData, this.newForm.value.PLOT_TYPE)
      let item: any = {
        x: [el.key], y: [`Total ${this.newForm.value.PLOT_TYPE} ${xData}`], type: this.WIDGET_REQUEST && this.WIDGET_REQUEST.CHART_NAME ? this.WIDGET_REQUEST.CHART_NAME.toLowerCase() : ''
      }
      newArr.push(item)

    }

    this.graph1.data = newArr;

    // let item: any = [{ x: deviceIDs, y: value, type: this.chartCatg },
    // { x: unique, y: value2, type: this.chartCatg},
    // { x: unique, y: value3, type: this.chartCatg },
    // { x: unique, y: value4, type: this.chartCatg }
    // ]
    // this.graph1.data = item;
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
  oldCall() {
    if (this.pMap == 'line' || this.pMap) {
      this.chartCatg = 'scatter';
      this.getData()

    } else {
      this.chartCatg = this.pMap
      this.getData()

    }
    console.log(this.chartCatg)

    if (this.pMap === 'scatter2') {
      this.data = [
        { x: [1, 2, 3, 4, 5, 6, 7, 8, 9,], y: [2, 5, 3, 4, 7, 2, 44, 11, 1], type: 'bar', marker: { color: '#6666ff' }, backgroundColor: 'red' }

      ]

      this.layOut = {
        width: 520, height: 340, title: 'Bar chart',
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
      }
      this.graph.data = this.data;

    } else
      if (this.pMap === 'line') {
        //   this.graph = {
        //     data: [
        //         { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
        //         { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
        //     ],
        //     layout: {width: 520, height: 340, title: 'Sample Plot'}
        // };
        this.data = [
          { x: [1, 2, 3, 4, 5, 6, 7, 8, 9], y: [2, 7, 6, 3], type: 'scatter', mode: 'lines+points', marker: { color: '#6666ff' } },

          { x: [1, 2, 3, 4, 5, 6, 7, 8, 9], y: [4, 12, 6, 9], type: 'scatter', mode: 'lines+points', marker: { color: 'orange' } },

          { x: [1, 2, 3, 4, 5, 6, 7, 8, 9], y: [8, 2, 7, 9], type: 'scatter', mode: 'lines+points', marker: { color: 'green' } },
        ]
        // Plotly.newPlot('myDiv', data);
        this.layOut = {
          width: 520, height: 340, title: 'Line',
          plot_bgcolor: "rgba(0,0,0,0)",
          paper_bgcolor: "rgba(0,0,0,0)",

        }
        this.graph.data = this.data;

      } else {
        this.data = [
          {
            z: [[1, 20, 30], [20, 1, 60], [30, 60, 1],

            [11, 210, 130], [200, 111, 160], [130, 60, 11]
            ],
            type: 'heatmap'
          }
        ];
        this.graph.data = this.data;
        this.layOut = {
          width: 820, height: 390, title: this.pMap,
          plot_bgcolor: "rgba(0,0,0,0)",
          paper_bgcolor: "rgba(0,0,0,0)",
        }

      }
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

}
