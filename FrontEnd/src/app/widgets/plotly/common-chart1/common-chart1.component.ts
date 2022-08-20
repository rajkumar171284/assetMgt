import { Component, DoCheck, Output, EventEmitter, OnInit, Input, ViewChild, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription, Observable, of, map } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice, plotly_small_layout,plotlyColors } from '../../../myclass';
import { interval } from 'rxjs';
import * as moment from 'moment'
// import { XAxisComponent } from '../../components/x-axis/x-axis.component';
// import { WidgetComponent } from '../../components/widget/widget.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { XAxisService } from '../../../services/x-axis.service';
import { forEach } from '@angular-devkit/schematics';


declare let $: any;
const colors = plotlyColors;


// interface _totalDevice {
//   history: any[],
//   unitsArr: any[], DEVICE_ID: string;
// }
// interface _units {
//   key: string;
//   totalValue: number;
//   data: any[];
//   selected: boolean;
// }

@Component({
  selector: 'app-common-chart1',
  templateUrl: './common-chart1.component.html',
  styleUrls: ['./common-chart1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonChart1Component implements OnInit, OnChanges {
  @Input('chartWidth') chartWidth!: number;
  @Input('chartHeight') chartHeight!: number;
  @Input('totalDevice') totalDevice: any[] = [];
  @Input() chartData!: any;

  @Input() WIDGET_REQUEST: any;
  @Input() isThreshold: any;

  @Output() _sendToParent = new EventEmitter();
  result: any = [];
  totalDevice$!: Observable<any[]>;
  public data: any;

  constructor(public behavSubject: XAxisService, private ref: ChangeDetectorRef) { }
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
  ngOnInit(): void {
    this.behavSubject.currWidgetRequest.subscribe((message: any) => {
      // 
      if (message.PID == this.WIDGET_REQUEST.PID) {
        // console.log(message)
        this.WIDGET_REQUEST = message;
        const newSize = JSON.parse(this.WIDGET_REQUEST.WIDGET_SIZE);
        this.chartWidth = newSize.width;
        this.chartHeight = newSize.height;
        this.loadChart();

      }

    })
    this.behavSubject.currentWidthHeight.subscribe((message: any) => {
      // console.log(message)
      if (message.PID == this.WIDGET_REQUEST.PID) {
        this.chartWidth = message.width;
        this.chartHeight = message.height;

        this._sendToParent.emit({
          width: this.chartWidth, heigth: this.chartHeight, PID: message.PID
        })
      }

    });

    this.behavSubject.currentDevice.subscribe((message: any) => {
      // console.log('currentDevice',message)
      this.result = message;
      this.loadChart();

    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes,this.chartData)

    this.totalDevice$ = of(this.totalDevice);
    this.loadChart()
  }
  loadChart() {

    if (this.totalDevice && this.totalDevice.length > 0) {
      this.totalDevice.forEach((item, index) => {
        if (item.history.length > 0) {
          item.unitsArr.forEach((obj: any, j: number) => {
            obj.color = `rgb${colors[j]}`

          })
          console.log(item.unitsArr)
        }

      })
      if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'gauge') {
        this.guageChart();
      }
      else if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'line') {
        this.lineChart();
      }
      else if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'pie') {
        this.pieChart(this.totalDevice)
      } else if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'bar') {


        this.barChart(this.totalDevice)
      } else if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'donut') {

        this.donutPlots()

      } else if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'scatter') {

        this.scatterPlots()

      }
    }
  }
  lineChart() {
    if (this.totalDevice && this.totalDevice.length > 0) {
      let layout: any = {};
      let linedata: any = [];
      let xArray: any = [];
      let index = 0;
      for (let a of this.totalDevice) {
        if (a.history.length > 0) {

          xArray = a.history.map((z: any) => {
            let dt = new Date(z.LAST_UPDATE_TIME);
            return dt;
          });
          // const unique = [...new Set(xArray.map((uniq: any) => uniq))];//collect unique dates

          let j = 0;
          for (let units of a.unitsArr) {
            // format VALUE json as key & value
            if (units.selected == true) {
              let trace = {
                x: xArray,
                y: units.data,
                mode: 'scatter+points',
                type: this.WIDGET_REQUEST.CHART_NAME.toLowerCase(),
                name: units.key,
                line: {
                  color: units.colors,
                  width: 2
                },

              };
              linedata.push(trace);
            }
            j++;
          }
        }
        index++;

      }
      // // Define Layout
      layout = {
        yaxis: { autorange: true, title: "" },
        showlegend: false,
        autosize: true,
        // width: this.chartWidth,
        height: this.chartHeight,
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
      if (this.isThreshold) {
        console.log('this.isThreshold', this.isThreshold)
        layout.shapes = [
          {
            type: 'line',
            xref: 'paper',
            x0: 0,
            y0: 12.0,
            x1: 1,
            y1: this.isThreshold.THRESHOLD_AVG,
            line: {
              color: 'rgb(255, 0, 0)',
              width: 4,
              dash: 'dot'
            }
          }
        ]
      }


      // Display using Plotly
      this.graph1.data = linedata;
      this.graph1.layout = layout;
      // console.log(linedata)

      this.ref.detectChanges();

    }
  }


  pieChart(result: any) {

    let data: any = [];
    let labelArr: any = [];

    let linedata: any = [];
    let xArray: any = [];
    for (let a of this.totalDevice) {
      if (a.history.length > 0) {
        for (let units of a.unitsArr) {
          // format VALUE json as key & value
          labelArr.push(units.key)
          data.push(units.totalValue)

          let trace = {
            x: xArray,
            y: units.data,
            mode: 'scatter+points',
            type: this.WIDGET_REQUEST.CHART_NAME.toLowerCase(),
            name: units.key
          };
          linedata.push(trace);


        }
      }


    }


    var traceA = {
      type: "pie",
      values: data,
      labels: labelArr,
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
        size: 14
      },
      hoverlabel: {
        bgcolor: 'black',
        bordercolor: 'black',
        font: {
          family: 'Lato',
          color: 'white',
          size: 14
        }
      }
    };

    this.data = [traceA];
    this.graph1.data = this.data;
    this.graph1.layout.width = this.chartWidth;
    this.graph1.layout.height = this.chartHeight;
    this.graph1.layout.title = this.WIDGET_REQUEST.CONFIG_NAME;

  }
  barChart(result: any) {
    // console.log('bar', result)

    let data: any = [];
    let xArray: any = [];
    for (let a of this.totalDevice) {
      if (a.history.length > 0) {
        xArray = a.history.map((z: any) => {
          let dt = new Date(z.LAST_UPDATE_TIME);
          return dt;
        });
        let index = 0;
        for (let units of a.unitsArr) {
          if (units.selected == true) {
            const newData = {
              x: xArray,
              y: units.data,
              type: "bar",
              name: units.key,
              line: {
                color: units.colors,
                width: 3
              },
            }

            data.push(newData);
          }

          index++;
        }
      }
      // 

    }


    if (this.isThreshold) {
      // console.log('this.isThreshold',this.isThreshold)
      // layout.shapes = [
      //   {
      //     type: 'line',
      //     xref: 'paper',
      //     x0: 0,
      //     y0: 12.0,
      //     x1: 1,
      //     y1: this.isThreshold.THRESHOLD_AVG,
      //     line: {
      //       color: 'rgb(255, 0, 0)',
      //       width: 4,
      //       dash: 'dot'
      //     }
      //   }
      // ]
    }
    this.graph1.data = data;
    this.graph1.layout.width = '100%';
    this.graph1.layout.height = this.chartHeight;
    this.graph1.layout.showlegend = false;

    this.graph1.responsive = true;

    this.graph1.layout.title = this.WIDGET_REQUEST.CONFIG_NAME;
    // console.log(this.graph1)

  }


  scatterPlots() {
    // var xArray = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    // var yArray = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];
    let xArray: any = [];
    let yArray: any = [];
    // let unique: any = [];
    // // let data: any = [];
    // let labelArr: any = [];

    // let linedata: any = [];
    // let xArray: any = [];
    for (let a of this.totalDevice) {
      if (a.history.length > 0) {

        // xArray = a.history.map((z: any) => {
        //   let dt = new Date(z.LAST_UPDATE_TIME);
        //   return dt;
        // });

        // y value
        for (let units of a.unitsArr) {
          // format VALUE json as key & value
          xArray.push(units.key)
          yArray.push(units.totalValue)

        }
      }


    }
    // Define Data
    var data = [{
      x: xArray,
      y: yArray,
      mode: "markers",
      type: "scatter"
    }];

    // Define Layout
    // var layout = {
    //   xaxis: { range: [40, 160], title: "Square Meters" },
    //   yaxis: { range: [5, 16], title: "Price in Millions" },
    //   title: "House Prices vs. Size"
    // };
    this.graph1.data = data;
    this.graph1.layout.width = this.chartWidth;
    this.graph1.layout.height = this.chartHeight;

    this.graph1.responsive = true;

    this.graph1.layout.title = this.WIDGET_REQUEST.CONFIG_NAME;
    // Plotly.newPlot("myPlot", data, layout);
  }


  donutPlots() {
    let xArray: any = [];
    let yArray: any = [];
    // let unique: any = [];
    // // let data: any = [];
    // let labelArr: any = [];

    // let linedata: any = [];
    // let xArray: any = [];
    for (let a of this.totalDevice) {
      if (a.history.length > 0) {

        // xArray = a.history.map((z: any) => {
        //   let dt = new Date(z.LAST_UPDATE_TIME);
        //   return dt;
        // });

        // y value
        for (let units of a.unitsArr) {
          // format VALUE json as key & value
          xArray.push(units.key)
          yArray.push(units.totalValue)

        }
      }


    }



    // let data: any = [{ labels: xArray, values: yArray, hole: .4, type: "pie" }];

    // Plotly.newPlot("myPlot", data, layout);
    //     xArray = ["Italy", "France", "Spain", "USA", "Argentina"];
    // yArray = [55, 49, 44, 24, 15];

    var layout = { title: "World Wide Wine Production" };

    var data: any = [{ labels: xArray, values: yArray, hole: .4, type: "pie" }];
    this.graph1.data = data;
    this.graph1.layout.width = this.chartWidth;
    this.graph1.layout.height = this.chartHeight;

    this.graph1.responsive = true;

    this.graph1.layout.title = this.WIDGET_REQUEST.CONFIG_NAME;
    // console.log('donut')
  }


  guageChart() {
    let myGraph = [];
    let xArray: any = [];
    let yArray: any = [];
    for (let arr of this.totalDevice) {
      let newObj: any = {};
      newObj.DEVICE_ID = arr.DEVICE_ID;
      newObj.units = [];
      if (arr.history.length > 0) {
        for (let item of arr.unitsArr) {


          xArray.push(item.key)
          yArray.push(item.totalValue)

          var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: item.totalValue,
              title: { text: item.key },
              type: "indicator",
              mode: "gauge+number"
            },

          ];
          let newItem: any = {}
          newItem.data = data;
          newItem.layout = { width: 300, height: 230, margin: { t: 0, b: 10 } };
          newObj.units.push(newItem)
        }
      }
      myGraph.push(newObj)
      // console.log(this.myGraph)

    }
    if (this.isThreshold) {
      console.log('this.isThreshold', this.isThreshold)
      // layout.shapes = [
      //   {
      //     type: 'line',
      //     xref: 'paper',
      //     x0: 0,
      //     y0: 12.0,
      //     x1: 1,
      //     y1: this.isThreshold.THRESHOLD_AVG,
      //     line: {
      //       color: 'rgb(255, 0, 0)',
      //       width: 4,
      //       dash: 'dot'
      //     }
      //   }
      // ]
    }
    this.graph1.data = [
      {
        domain: { x: xArray, y: yArray },
        value: 200,
        title: { text: 'test' },
        type: "indicator",
        mode: "gauge+number"
      },

    ];
    this.graph1.layout.width = this.chartWidth;
    this.graph1.layout.height = this.chartHeight;

    this.graph1.responsive = true;

    this.graph1.layout.title = this.WIDGET_REQUEST.CONFIG_NAME;
  }
}
