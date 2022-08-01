import {  _chartTYPE, _widgetSIZE, _xAxes } from '../../myclass';
import { Component, EventEmitter, OnInit, Input,ViewChild, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, Output } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __addAssetDevice, _dateFilters } from '../../myclass';
import { interval } from 'rxjs';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { XAxisService } from '../../services/x-axis.service';
import {HistoryFilterComponent} from '../history-filter/history-filter.component';
@Component({
  selector: 'app-x-axis',
  templateUrl: './x-axis.component.html',
  styleUrls: ['./x-axis.component.scss'],
  providers: [XAxisService]
})
export class XAxisComponent implements OnInit {
  xAxesOPTION = _xAxes;
  @Input() WIDGET_REQUEST: any;
  @Output() xaxis: any=new EventEmitter();

  newForm: FormGroup = this.fb.group({

    XAXES: ['']

  });
  constructor(private dataService: AuthService, private fb: FormBuilder,
    private _snackBar: MatSnackBar, public xaxisService: XAxisService) {


  }

  ngOnInit(): void {
  }
  getXaxis(key:any){
    this.xaxisService.sendValue(key)
    this.WIDGET_REQUEST.XAXES=key;
    this.xaxis.emit(key);
    
  }
  // getData(){
  //   return 'hi'
  // }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.WIDGET_REQUEST)
    let xvalue = 'DATE-WISE';
    if (this.WIDGET_REQUEST.XAXES) {
      xvalue = this.WIDGET_REQUEST.XAXES;
    }
    const arr = this.xAxesOPTION.filter((z: any) => {
      console.log(z.key, this.WIDGET_REQUEST.XAXES)
      return z.key == xvalue;
    });
    // console.log(arr)
    this.newForm.patchValue({
      XAXES: arr[0].key
    })

  }
}
