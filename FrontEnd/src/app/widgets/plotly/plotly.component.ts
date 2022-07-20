import { Component, DoCheck, Output, EventEmitter, OnInit, Input, ViewChild, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice, plotly_small_layout } from '../../myclass';
import { interval } from 'rxjs';
import * as moment from 'moment'
import { XAxisComponent } from '../../components/x-axis/x-axis.component';
import { WidgetComponent } from '../../components/widget/widget.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { XAxisService } from '../../services/x-axis.service';

declare let $: any;
const colors = ["(255,165,0)", "(255,105,180)", "(124,252,0)", "(0,128,0)", "(100,149,237)", "(64,224,208)", "(0,255,127)",
  "(138,43,226)", "(153,50,204)", "(255,105,180)", "(0,191,255)", "(255,105,180)", "(210,105,30)", "(148,0,211)", "(65,105,225)", "(100,149,237)", "(255,105,180)", "(72,209,204)", "(0,128,128)"]
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
export class PlotlyComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  @ViewChild('xAxis', { static: true }) xAxis!: XAxisComponent;
  @Input() WIDGET_REQUEST: any;
  @Input() widgetIndex: any;

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
  expandFilter: boolean = false;
  @Output() _widgetData = new EventEmitter();
  @Output() _widgetRemoved = new EventEmitter();

  leftPos: number = 0;


  todayStartDate: any = moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss").toString();
  todayEndDate: any = moment().endOf('day').toString();
  deviceList: _device[] = [];
  showGuage = false;
  plotlyIndex: number = 0;
  singleView: any = [];
  toEditRequest: any;
  constructor(public service: XAxisService, public dialog: MatDialog, private fb: FormBuilder, private dataService: AuthService, private ref: ChangeDetectorRef) {

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
  ngDoCheck(): void {
    this.watchSize();
  }
  watchSize() {
    const id = this.widgetIndex.toString();
    let that = this;
    let x = document.getElementById(id);
    $(x).resizable({
      stop: function (event: Event, ui: any) {
        // console.log(ui)
        let height: number = $(ui.size.height)[0];
        let width: number = $(ui.size.width)[0];
        const params: any = {
          width: width, height: height
        }

        that.chartWidth = width;
        that.chartHeight = height;
        // console.log('chartWidth',that.chartWidth,that.chartHeight)
        const orgSize = JSON.parse(that.WIDGET_REQUEST.WIDGET_SIZE)
        // 
        console.log('orgSize', orgSize)
        orgSize.width = width;
        orgSize.height = height;
        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(orgSize);

        // 
        that.service.changeMessage(orgSize)
      }
    });

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
  updateRequest(message: any) {
    const req = JSON.parse(this.WIDGET_REQUEST.WIDGET_SIZE);
    req.top = message.top;
    req.left = message.left;
    this.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(req);
    // console.log(this.WIDGET_REQUEST)

  }
  ngOnInit(): void {


    this.service.currentPosition.subscribe((message: any) => {
      console.log('currentPosition', message)
      if (message.PID == this.WIDGET_REQUEST.PID) {
        this.updateRequest(message);
      }

    });
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
    console.log(changes, this.positionLeft, this.positionTop)
    // 
    if (this.WIDGET_REQUEST) {
      this.widgetResponse = new widgetResponse();

      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      const size = JSON.parse(this.WIDGET_REQUEST.WIDGET_SIZE);
      // console.log('size', size, this.WIDGET_REQUEST.CHART_NAME)
      this.chartWidth = size.width;
      this.chartHeight = size.height;

    }

  }

  get VALUES() {
    return this.newForm.value;
  }






  getLoader(data: boolean) {
    this.loading = data;
  }
  getFromChild(data: any) {
    // this.loading = false;
    this.widgetResponse = new widgetResponse();
    // console.log('getFromChild', data)
    if (data && data.totalDevice.length > 0) {
      this.errMessage = '';

      this.isDataFound = true;
      this.widgetResponse.totalDevice = data.totalDevice;

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
    console.log(this.loading, this.errMessage)
  }
  saveWidget() {

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
    console.log(item)
    this.dataService.deleteChartRequests(item).subscribe(res => {
      this.ngOnInit();

      this._widgetRemoved.emit(true)


    })
  }
  getFromChild2(e: any) {
    if (e) {
      console.log(e, JSON.parse(this.WIDGET_REQUEST.WIDGET_SIZE))
      // console.
    }
  }
}
