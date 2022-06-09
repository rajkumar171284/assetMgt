import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss']
})
export class HighlightsComponent implements OnChanges {
  @Input() WIDGET_REQUEST: any;
  labelMessage: any;
  labelMessage2: any;
  deviceType:string='';
  constructor(private dataService: AuthService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.WIDGET_REQUEST) {
      this.WIDGET_REQUEST.WIDGET_DATA=this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      console.log('highlights:', this.WIDGET_REQUEST)

      this.getAllMACAddress();
    }
  }

  getAllMACAddress() {
    this.dataService.getMACByConfigID({ PID: this.WIDGET_REQUEST.ASSET_CONFIG_ID }).subscribe(res => {
      console.log('highlights', res)
      if (res && res.data) {
        this.WIDGET_REQUEST.MAC_COUNT = res.data.length;
        if (res.data.length > 0) {
          this.deviceType=res.data[0].MAC_NAME;

          if (this.WIDGET_REQUEST.WIDGET_DATA == "COUNT") {
            this.labelMessage = `Total Count`

          } else if (this.WIDGET_REQUEST.WIDGET_DATA == "STATUS") {
            this.labelMessage = `Active`;
            this.labelMessage2 = `In-Active`;
            const active =res.data.filter((a:any)=>{
              return a.MAC_STATUS===1
            })
            this.WIDGET_REQUEST.activeCount=active.length>0?active.length:0;
            const inactive =res.data.filter((a:any)=>{
              return a.MAC_STATUS===0
            })
            this.WIDGET_REQUEST.inactiveCount=inactive.length>0?inactive.length:0;

          }
        }
      }

    })
  }

}
