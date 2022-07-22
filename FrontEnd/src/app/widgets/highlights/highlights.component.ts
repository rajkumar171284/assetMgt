import { Component, AfterViewInit, DoCheck, ViewChild, ElementRef, ViewContainerRef, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { XAxisService } from '../../services/x-axis.service';
import { WidgetComponent } from '../../components/widget/widget.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare let $: any;
@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighlightsComponent implements OnInit, OnChanges, DoCheck {
  @Input() WIDGET_REQUEST: any;
  @Input() widgetIndex: any;

  @Output() _widgetData = new EventEmitter();
  labelMessage: any;
  labelMessage2: any;
  deviceType: string = '';
  public height: any;
  public width: any;
  // @ViewChild('Item', { read: ViewContainerRef }) Item: any;
  @ViewChild("divBoard") divBoard!: ElementRef;
  chartWidth: number = 0;
  chartHeight: number = 0;
  widgetDiv: any;
  constructor(public service: XAxisService, private dataService: AuthService) { }
  ngDoCheck(): void {

    this.watchSize();
  }

  watchSize() {
    const id = this.widgetIndex.toString();
    let that = this;
    let x = document.getElementById(id);
    // console.log(x)
    $(x).resizable({
      stop: function (event: Event, ui: any) {
        console.log(ui)
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
        // that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(orgSize);
        const newSize = {
          width: width,
          height: height,
          PID: that.WIDGET_REQUEST.PID
        }
        // 
        that.service.changeWidthHeight(newSize)
      }
    });

  }
  getElement() {
    // if (this.divBoard)
    return this.divBoard.nativeElement;
  }
  ngOnInit(): void {

  }
  getWidgetdetails() {
    let that = this;
    $(".resizable").resizable({
      stop: function (event: Event, ui: any) {
        that.height = $(ui.size.height)[0];
        that.width = $(ui.size.width)[0];
        const params: any = {
          width: that.width, height: that.height
        }
        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(params);
      }
    });
    // console.log(that.WIDGET_REQUEST)
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('highlights:', this.WIDGET_REQUEST)
    this.getWidgetdetails();
    if (this.WIDGET_REQUEST) {
      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      // console.log('highlights:', this.WIDGET_REQUEST)

      this.getAllMACAddress();
      this.getWidgetdetails();

    }
  }

  getAllMACAddress() {
    this.dataService.getMACByConfigID({ PID: this.WIDGET_REQUEST.ASSET_CONFIG_ID }).subscribe(res => {
      // console.log('highlights', res)
      // this.ref.detectChanges();
      if (res && res.data) {
        this.WIDGET_REQUEST.MAC_COUNT = res.data.length;
        if (res.data.length > 0) {
          this.deviceType = res.data[0].MAC_NAME;

          if (this.WIDGET_REQUEST.WIDGET_DATA == "COUNT") {
            this.labelMessage = `Total Count`

          } else if (this.WIDGET_REQUEST.WIDGET_DATA == "STATUS") {
            this.labelMessage = `Active`;
            this.labelMessage2 = `In-Active`;
            const active = res.data.filter((a: any) => {
              return a.MAC_STATUS === 1
            })
            this.WIDGET_REQUEST.activeCount = active.length > 0 ? active.length : 0;
            const inactive = res.data.filter((a: any) => {
              return a.MAC_STATUS === 0
            })
            this.WIDGET_REQUEST.inactiveCount = inactive.length > 0 ? inactive.length : 0;

          }
        }
      }

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
