import { Component, AfterViewInit, DoCheck, ViewChild, ElementRef, ViewContainerRef, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { XAxisService } from '../../services/x-axis.service';
import { ResizedEvent } from 'angular-resize-event';
import { filter, from, map, of, tap } from 'rxjs';
import { delay } from "rxjs/operators";


declare let $: any;
@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighlightsComponent implements OnInit, OnChanges, DoCheck, AfterViewInit {
  @Input() WIDGET_REQUEST: any;
  @Input() widgetIndex: any;

  @Output() _widgetData = new EventEmitter();
  labelMessage: any;
  labelMessage2: any;
  deviceType: string = '';
  public height: any;
  public width: any;
  loading = true;

  // @ViewChild('Item', { read: ViewContainerRef }) Item: any;
  @ViewChild("highlights") divBoard!: ElementRef;
  chartWidth: number = 0;
  chartHeight: number = 0;
  widgetDiv: any;
  divElement!: any;

  constructor(public service: XAxisService, public dataService: AuthService) { }
  ngDoCheck(): void {

    const status = this.dataService.getAccess();
    if (status) {
      this.watchSize();
    }
  }
  ngAfterViewInit(): void {
    this.divElement = this.divBoard.nativeElement;
  }
  onResized(event: ResizedEvent) {
    // console.log(event.newRect)
    // this.width = event.newRect.width;
    // this.height = event.newRect.height;
  }
  watchSize() {
    // const id = this.widgetIndex.toString();
    let that = this;
    let x = that.divElement;
    // console.log(x)
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

        that.chartWidth = width;
        that.chartHeight = height;

        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(newSize);

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

        // sending/emitting data to parent-dashboard.ts for saving into api
        that._widgetData.emit(that.WIDGET_REQUEST)
      }
    })

  }
  getElement() {
    // if (this.divBoard)
    return this.divBoard.nativeElement;
  }
  ngOnInit(): void {

  }


  ngOnChanges(changes: SimpleChanges): void {
    // console.log('highlights:', this.WIDGET_REQUEST)

    if (this.WIDGET_REQUEST) {
      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      // console.log('highlights:', this.WIDGET_REQUEST)
      this.getAllMACAddress();

    }
  }

  getAllMACAddress() {
    this.dataService.getMACByConfigID({ PID: this.WIDGET_REQUEST.ASSET_CONFIG_ID }).subscribe(res => {
      // console.log('highlights', res)
      // this.ref.detectChanges();
      if (res && res.data) {

        if (res.data.length > 0) {
          this.deviceType = res.data[0].MAC_NAME;

          if (this.WIDGET_REQUEST.WIDGET_DATA == "COUNT") {
            this.labelMessage = `Total Count`
            // get total device count
            this.WIDGET_REQUEST.MAC_COUNT = 0;
            this.getTotalDeviceCount(res.data)

          } else if (this.WIDGET_REQUEST.WIDGET_DATA == "STATUS") {
            this.labelMessage = `Active`;
            this.labelMessage2 = `InActive`;
            this.WIDGET_REQUEST.activeCount = 0;
            this.WIDGET_REQUEST.inactiveCount = 0;
            // get total active
            this.getTotalActive(res.data);

            // get total inactive
            this.getTotalInActive(res.data);
          }
        }
        this.loading=false;
      }

    })
  }

  getTotalDeviceCount(data: any) {
    from(data).pipe(delay(1000), map((a: any) => a)).subscribe((response) => {
      this.WIDGET_REQUEST.MAC_COUNT++;
    })
  }
  getTotalActive(data: any) {
    from(data).pipe(delay(1000), map((a: any) => a), filter((item) => {
      return item.MAC_STATUS === 1;
    })).subscribe((response) => {
      this.WIDGET_REQUEST.activeCount++;
    })
  }
  getTotalInActive(data: any) {
    from(data).pipe(delay(1000), map((a: any) => a), filter((item) => {
      return item.MAC_STATUS === 0;
    })).subscribe((response) => {
      this.WIDGET_REQUEST.inactiveCount++;
    })
  }
  saveWidget() {

    this._widgetData.emit(this.WIDGET_REQUEST)
  }


  async editRequest(pid: any) {
    // const data = await this.getRequestDetails(pid, 'json');

    // this.toEditRequest = data;
    // this.openDialog();
  }
  removeRequest(item: any) {
    this.dataService.deleteChartRequests({ PID: item }).subscribe(res => {
      this.ngOnInit();
    })
  }
}
