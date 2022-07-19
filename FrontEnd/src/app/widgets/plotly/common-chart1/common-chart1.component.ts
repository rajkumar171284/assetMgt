import { Component, DoCheck, Output, EventEmitter, OnInit, Input, ViewChild, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice, plotly_small_layout } from '../../../myclass';
import { interval } from 'rxjs';
import * as moment from 'moment'
// import { XAxisComponent } from '../../components/x-axis/x-axis.component';
// import { WidgetComponent } from '../../components/widget/widget.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { XAxisService } from '../../../services/x-axis.service';


declare let $: any;
const colors = ["(255,165,0)", "(255,105,180)", "(124,252,0)", "(0,128,0)", "(100,149,237)", "(64,224,208)", "(0,255,127)",
  "(138,43,226)", "(153,50,204)", "(255,105,180)", "(0,191,255)", "(255,105,180)", "(210,105,30)", "(148,0,211)", "(65,105,225)", "(100,149,237)", "(255,105,180)", "(72,209,204)", "(0,128,128)"]


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
  @Input() WIDGET_REQUEST: any;
  @Output() _sendToParent = new EventEmitter();
  result: any = [];
  singleView: any = [];
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
    this.behavSubject.currentMessage.subscribe((message: any) => {
      // console.log(message)
      this.chartWidth = message.width ? message.width : this.behavSubject.getProp('W', this.WIDGET_REQUEST);
      this.chartHeight = message.height ? message.height : this.behavSubject.getProp('H', this.WIDGET_REQUEST);

      this._sendToParent.emit({
        width: this.chartWidth, heigth: this.chartHeight
      })

      this.behavSubject.currentDevice.subscribe((message: any) => {
        // console.log('currentDevice',message)
        this.result = message;
        this.loadChart();

      });
    })

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.chartWidth, this.chartHeight, this.WIDGET_REQUEST.CHART_NAME)
    this.loadChart()
  }
  loadChart() {
    console.log('this.totalDevice', this.totalDevice)
    if (this.totalDevice && this.totalDevice.length > 0) {
      // console.log('this.totalDevice',this.totalDevice)
      if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'line') {
        this.lineChart();
      }
      else if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'pie') {
        this.pieChart(this.totalDevice)
      } else if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'bar') {
        // console.log(this.chartWidth,this.chartHeight,this.WIDGET_REQUEST.CHART_NAME)
        // default
        // this.newForm.patchValue({
        //   PLOT_TYPE: this.filterBy[0],
        //   PLOT_XAXES: this.filterXaxes[0]
        // })
        // console.log(this.newForm.value)


        this.barChart(this.totalDevice)
      } else if (this.WIDGET_REQUEST.CHART_NAME.toLowerCase() == 'donut') {

        this.donutPlots()

      }
    }
  }
  lineChart() {
    if (this.totalDevice && this.totalDevice.length > 0) {

      // this.plotlyIndex = 0;
      console.log(this.WIDGET_REQUEST.CHART_NAME.toLowerCase(), this.WIDGET_REQUEST.CONFIG_NAME)
      let linedata: any = [];
      let newVALUE: any = [], xArray: any = [];
      let index = 0;
      this.singleView = []
      for (let a of this.totalDevice) {
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
              useResize: true,
              autosize: true
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
        width: this.chartWidth,
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


      // Display using Plotly
      this.graph1.data = linedata;
      this.graph1.layout = layout;
      console.log(linedata)
      // Plotly.newPlot('myDiv', linedata, layout);
      //   window.onresize = function() {
      //     Plotly.relayout('myDiv', {
      //         'xaxis.autorange': true,
      //         'yaxis.autorange': true
      //     });
      // };
      this.ref.detectChanges();

    }
  }

  // getProp(type: string) {
  //   const prop = JSON.parse(this.WIDGET_REQUEST.WIDGET_SIZE)
  //   if (type == 'W') {
  //     return prop.width
  //   }
  //   if (type == 'H') {
  //     return prop.height
  //   } else if (type == 't') {
  //     return prop.top ? prop.top : 0
  //   } else if (type == 'l') {
  //     return prop.left ? prop.left : 0
  //   }
  // }

  pieChart(result: any) {
    let unique: any = [];
    let data: any = [];
    let labelArr: any = [];

    let linedata: any = [];
    let xArray: any = [];
    for (let a of this.totalDevice) {
      if (a.history.length > 0) {

        // xArray = a.history.map((z: any) => {
        //   let dt = new Date(z.LAST_UPDATE_TIME);
        //   return dt;
        // });

        // y value
        for (let units of a.unitsArr) {
          // format VALUE json as key & value
          labelArr.push(units.key)
          data.push(units.totalValue)

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


        }
      }


    }

    console.log('data', data)
    console.log('labelArr', labelArr)
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
    this.graph1.layout.width = this.chartWidth;
    this.graph1.layout.height = this.chartHeight;
    this.graph1.layout.title = this.WIDGET_REQUEST.CONFIG_NAME;

  }
  barChart(result: any) {
    // console.log('bar', result)
    let unique: any = [];
    let data: any = [];

    // let xArray: any = [];
    let xArray: any = [];
    for (let a of this.totalDevice) {
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
    this.graph1.layout.width = this.chartWidth;
    this.graph1.layout.height = this.chartHeight;

    this.graph1.responsive = true;

    this.graph1.layout.title = this.WIDGET_REQUEST.CONFIG_NAME;
    console.log(this.graph1)
    // Plotly.newPlot('myDiv', data, this.graph1.layout);
  }


  scatterPlots() {
    var xArray = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    var yArray = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];

    // Define Data
    var data = [{
      x: xArray,
      y: yArray,
      mode: "markers",
      type: "scatter"
    }];

    // Define Layout
    var layout = {
      xaxis: { range: [40, 160], title: "Square Meters" },
      yaxis: { range: [5, 16], title: "Price in Millions" },
      title: "House Prices vs. Size"
    };

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

var layout = {title:"World Wide Wine Production"};

var data:any = [{labels:xArray, values:yArray, hole:.4, type:"pie"}];
    this.graph1.data = data;
    this.graph1.layout.width = this.chartWidth;
    this.graph1.layout.height = this.chartHeight;

    this.graph1.responsive = true;

    this.graph1.layout.title = this.WIDGET_REQUEST.CONFIG_NAME;
    console.log('donut')
  }
}
