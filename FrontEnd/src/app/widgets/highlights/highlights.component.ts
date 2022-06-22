import { Component, DoCheck, ViewChild, ViewContainerRef, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
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
  @ViewChild('Item', { read: ViewContainerRef }) Item: any;

  constructor(private dataService: AuthService) { }
  ngDoCheck(): void {
    console.log('dochk', this.widgetIndex);
    // this.getWidgetdetails();
    const id = this.widgetIndex.toString();
    let that = this;
    // if (this.Item.element)
    let doc=`#${{id}}`;
    let x=document.getElementById(id);
    console.log(id,doc,document.getElementById(id))
      $(x).resizable({
        stop: function (event: Event, ui: any) {
          console.log(ui)
          that.height = $(ui.size.height)[0];
          that.width = $(ui.size.width)[0];
          const params: any = {
            width: that.width, height: that.height
          }
          that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(params);
        }
      });
  }
  ngOnInit(): void {
    let that = this;
    $(".resizable").resizable({
      stop: function (event: Event, ui: any) {
        console.log(ui)
        that.height = $(ui.size.height)[0];
        that.width = $(ui.size.width)[0];
        const params: any = {
          width: that.width, height: that.height
        }
        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(params);
      }
    });
    console.log(that.WIDGET_REQUEST)
    // 
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
    console.log(that.WIDGET_REQUEST)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('highlights:', this.WIDGET_REQUEST)
    this.getWidgetdetails();
    if (this.WIDGET_REQUEST) {
      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      console.log('highlights:', this.WIDGET_REQUEST)

      this.getAllMACAddress();
      this.getWidgetdetails();

    }
  }

  getAllMACAddress() {
    this.dataService.getMACByConfigID({ PID: this.WIDGET_REQUEST.ASSET_CONFIG_ID }).subscribe(res => {
      console.log('highlights', res)
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
  getProp(type: string) {
    const prop = JSON.parse(this.WIDGET_REQUEST.WIDGET_SIZE)
    if (type == 'W') {
      return prop.width
    }
    if (type == 'H') {
      return prop.height
    }
  }
}
