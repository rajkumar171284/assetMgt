import { Component, ElementRef, DoCheck, AfterViewInit, Output, EventEmitter, OnInit, Input, ViewChild, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription, Observable, of, map, filter, from } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice, plotly_small_layout, plotlyColors } from '../../myclass';
import { interval } from 'rxjs';
import * as moment from 'moment'
import { XAxisComponent } from '../../components/x-axis/x-axis.component';
import { WidgetComponent } from '../../components/widget/widget.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { XAxisService } from '../../services/x-axis.service';
import { ResizedEvent } from 'angular-resize-event';

declare let $: any;
const colors = plotlyColors;
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
export class PlotlyComponent implements OnInit, OnChanges, OnDestroy, DoCheck, AfterViewInit {
  @ViewChild('xAxis', { static: true }) xAxis!: XAxisComponent;
  @Input() WIDGET_REQUEST: any;
  @Input() widgetIndex: any;
  @ViewChild("plotly") divBoard!: ElementRef;

  errMessage: string = '';
  labelMessage2: any;
  deviceType: string = '';
  chartName: any;
  @Input('pMap') pMap: any;
  @Input() name: any;
  filterBy: any[] = ['KM', 'SPEED'];
  @Input('positionTop') positionTop!: number;
  @Input('positionLeft') positionLeft!: number;
  chartWidth: number = 0;
  chartHeight: number = 0;
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
    layout: { title: '' }
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
  expandFilter: boolean = false;
  @Output() _widgetData = new EventEmitter();
  @Output() _widgetRemoved = new EventEmitter();
  isThreshold: any;
  leftPos: number = 0;
  totalDevice$!: Observable<any[]>;
  chartData$!: Observable<any[]>;

  todayStartDate: any = moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss").toString();
  todayEndDate: any = moment().endOf('day').toString();
  deviceList: _device[] = [];
  showGuage = false;
  plotlyIndex: number = 0;
  singleView: any = [];
  toEditRequest: any;
  divElement!: any;
  chartData: any = [];
  constructor(public service: XAxisService, public dialog: MatDialog, private fb: FormBuilder, public dataService: AuthService, private ref: ChangeDetectorRef) {

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
  onResized(event: ResizedEvent) {
    console.log(event.newRect)
    // this.width = event.newRect.width;
    // this.height = event.newRect.height;
  }
  ngAfterViewInit(): void {

    this.divElement = this.divBoard.nativeElement;

  }
  ngDoCheck(): void {
    const status = this.dataService.getAccess();
    // console.log(status)
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
        console.log(ui)
        let height: number = $(ui.size.height)[0];
        let width: number = $(ui.size.width)[0];
        let top: number = $(ui.position.top)[0];
        let left: number = $(ui.position.left)[0];
        const newSize: any = {
          width: width, height: height, top: top,
          left: left
        }

        that.chartWidth = width;
        that.chartHeight = height;
        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(newSize);
        that.service.updateWidgetReq(that.WIDGET_REQUEST);

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
        that.service.updateWidgetReq(that.WIDGET_REQUEST);

        // sending/emitting data to parent-dashboard.ts for saving into api
        // that._widgetData.emit(that.WIDGET_REQUEST)
      }
    })

  }
  updateRequest(message: any) {
    const req = JSON.parse(this.WIDGET_REQUEST.WIDGET_SIZE);
    req.top = message.top;
    req.left = message.left;
    this.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(req);
    // console.log(this.WIDGET_REQUEST)

    this._widgetData.emit(this.WIDGET_REQUEST);

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
    // console.log(changes, this.positionLeft, this.positionTop)
    // 
    if (this.WIDGET_REQUEST) {
      this.widgetResponse = new widgetResponse();

      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      const size = JSON.parse(this.WIDGET_REQUEST.WIDGET_SIZE);
      this.chartWidth = size.width;
      this.chartHeight = size.height;
      this.getAlertsByAssetConfigID()
    }

  }

  get VALUES() {
    return this.newForm.value;
  }






  getLoader(data: boolean) {
    this.loading = data;
  }
  getFromChild(data: any) {
    this.widgetResponse = new widgetResponse();
    if (data && data.totalDevice.length > 0) {
      console.log(data)
      this.errMessage = '';
      this.isDataFound = true;
      this.widgetResponse.totalDevice = data.totalDevice;
      this.widgetResponse.totalParameters = data.totalParameters;
      this.totalDevice$ = of(this.widgetResponse.totalDevice);
      this.getFilteredData();
      this.chartData$ = of(this.chartData);
      this.service.sendTotalDevice(data.totalDevice)
      this.loading = false;
      this.ref.detectChanges();

    } else {
      this.widgetResponse.totalDevice = [];
      this.isDataFound = false;
      // no record- data empty array      
      this.errMessage = 'No data found..Please try other dates.';
      this.loading = false;
      this.ref.detectChanges();
    }
    // console.log(this.loading, this.errMessage)
  }
  saveWidget(status: boolean) {
    // save widget only
    this.WIDGET_REQUEST.LOADED = status;//
    this._widgetData.emit(this.WIDGET_REQUEST)
  }
  async editRequest(req: any) {

    this.toEditRequest = req;
    this.openDialog();
  }


  openDialog() {
    const dialogRef = this.dialog.open(WidgetComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
      data: this.toEditRequest ? this.toEditRequest : null
    });
    dialogRef.afterClosed().subscribe(result => {
      // call all charts      
    });
  }
  removeRequest(item: any) {
    // console.log(item)
    this.dataService.deleteChartRequests(item).subscribe(res => {
      this.ngOnInit();

      this._widgetRemoved.emit(true)


    })
  }
  getFromChild2(e: any) {
    if (e) {
      // console.log(e, this.WIDGET_REQUEST)
      // console.
    }
  }

  getAlertsByAssetConfigID() {

    let params = {}
    params = { ASSET_CONFIG_ID: this.WIDGET_REQUEST.ASSET_CONFIG_ID };
    this.dataService.getThresholdAlertByAssetConfigID(params).subscribe(res => {
      this.isThreshold = res.data ? res.data : [];
      // console.log('this.isThreshold', this.isThreshold)
      this.loading = false;

    });
  }
  getFilteredData() {
    this.chartData = [];
    this.totalDevice$.pipe(map((x: any) => {
      x.filter((list: any) => {
        return list.history.length > 0;
      }).map((resp: any) => {

        return resp.unitsArr.filter((obj: any) => {
          // get only the isusable key or tags
          // if (this.widgetResponse.totalParameters.length > 0){
          //   // if parameter onboarded
          //   this.widgetResponse.totalParameters.find((p: any) => {
          //     if (p.tag == obj.key) {
          //       obj.status = true;//is usable flag then
          //     }
          //   });
          // }


          return obj.selected == true;
        }).map((data: any) => {
          this.chartData.push(data)
          return data;
        })
      })


    })).subscribe(res => {
      // console.log(res)
    })
  }
  selectLegend(i: number, j: number) {
    if (this.widgetResponse.totalDevice[i].history.length > 0) {
      this.widgetResponse.totalDevice[i].unitsArr[j].selected = !this.widgetResponse.totalDevice[i].unitsArr[j].selected;
      this.getFilteredData();
    }
  }
}
