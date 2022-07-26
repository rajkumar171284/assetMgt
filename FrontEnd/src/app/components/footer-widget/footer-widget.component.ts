import { Component, DoCheck, Output, EventEmitter, OnInit, Input, ViewChild, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// import * as Plotly from 'plotly.js-dist-min';
// import { Config, Data, Layout } from 'plotly.js';
// import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice, plotly_small_layout } from '../../myclass';
// import { interval } from 'rxjs';
// import * as moment from 'moment'
// import { XAxisComponent } from '../../components/x-axis/x-axis.component';
import { WidgetComponent } from '../../components/widget/widget.component';
import { MatDialog } from '@angular/material/dialog';
import { XAxisService } from '../../services/x-axis.service';

@Component({
  selector: 'app-footer-widget',
  templateUrl: './footer-widget.component.html',
  styleUrls: ['./footer-widget.component.scss']
})
export class FooterWidgetComponent  {
  @Input('REQUEST')WIDGET_REQUEST:any='';
  toEditRequest:any;
  @Output() _widgetRemoved = new EventEmitter();
  @Output() _widgetData = new EventEmitter();
  constructor(public dialog: MatDialog,public dataService: AuthService,private transferData:XAxisService) { }


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
    
    this.dataService.deleteChartRequests(item).subscribe(res => {
      this._widgetRemoved.emit(true)
    })
  }

  saveWidget(status:boolean) {
    // save widget only
    // console.log(status)
    const req= JSON.parse(JSON.stringify(this.WIDGET_REQUEST));
    req.LOADED = status;//
    // since we are sibling-
    this.transferData.updateWidgetReq(req)
  }

}
