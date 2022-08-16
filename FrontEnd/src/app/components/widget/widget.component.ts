import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddAssetComponent } from '../../components/dialogs/add-asset/add-asset.component';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipComponent } from '../../components/tooltip/tooltip.component';
import { _mapTypes, _alertTYPE, _cardTYPE, _chartTYPE, _widgetSIZE, _xAxes } from '../../myclass';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  providers: [AuthService]
})
export class WidgetComponent implements OnInit {
  widgetSize = _widgetSIZE;

  // widgetType = _widgetTYPE;
  chartTypes = _chartTYPE;
  cardTypes = _cardTYPE;
  alertTypes = _alertTYPE;
  mapTypes = _mapTypes;
  xAxesOPTION = _xAxes;
  widgetState = true;
  panelOpenState = true;
  panelOpenState2 = true;
  panelOpenState3 = true;
  panelOpenState4 = true;
  dataSource: any = [];
  isSelected = false;
  chartChoosen = false;

  options: any[] = [];
  options2: any[] = ['STATUS', 'LOCATION', 'COUNT'];
  newForm: FormGroup = this.fb.group({
    PID: [''], COMPANY_ID: ['', Validators.required],
    WIDGET_TYPE: ['', Validators.required],
    isChartSelected: false,
    CHART_NAME: [this.chartChoosen ? Validators.required : null],
    CHART_TYPE: [],
    WIDGET_DATA: ['', Validators.required], WIDGET_SIZE: [''],
    ASSET_CONFIG_ID: ['', Validators.required],
    XAXES: [''],
    WIDGET_IMG: '',
    SQL_QUERY: [],
    IS_DRAGGED: 0,
    LOADED: true
  });
  tabIndex: any = 0;
  constructor(private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) {

    console.log('widget', data)
    if (data && data.PID) {

      if (data.CHART_NAME) {
        // if chart choosen then make selected by color
       const arr= this.chartTypes.filter(x => {
          return x.name.toLowerCase() === data.CHART_NAME.toLowerCase();
        }).map(result => {
          result.isSelected = true;
          this.newForm.patchValue({ isChartSelected: result.isSelected })
          this.chartChoosen = result.isSelected;
          return result;
        })
        console.log(arr)
        this.chartTypes
      }
      // set widget selection also by color
      // this.chartTypes.filter(x => {
      //   return x.name.toLowerCase() === data.WIDGET_TYPE.toLowerCase();
      // }).map(result => {
      //   result.isSelected = true;
      //   return result;
      // })
      // this.cardTypes.filter(x => {
      //   return x.name.toLowerCase() === data.WIDGET_TYPE.toLowerCase();
      // }).map(result => {
      //   result.isSelected = true;
      //   return result;
      // })
      // this.alertTypes.filter(x => {
      //   return x.name.toLowerCase() === data.WIDGET_TYPE.toLowerCase();
      // }).map(result => {
      //   result.isSelected = true;
      //   return result;
      // })
      // // set size by color
      // if (data.WIDGET_SIZE) {
      //   const size = this.widgetSize.filter(x => {
      //     return x.name.toLowerCase() === data.WIDGET_SIZE.toLowerCase();
      //   }).map(result => {
      //     result.isSelected = true;
      //     return result;
      //   })
      // }

      this.newForm.patchValue(data);


    } else {
      // new entry
      this.newForm.patchValue({ IS_DRAGGED: 0 })

    }
    this.getAllComp();
  }

  ngOnInit(): void {
    this.getAllAssets();
  }
  tabChanged(e: any) {
    // console.log(e)
    this.tabIndex = e.index;//active tab
    // this.newForm.patchValue({
    //   WIDGET_TYPE: e.tab.textLabel,

    // })
    // console.log(this.Values)
    this.resetWidgetSelection();
  }
  resetWidgetSelection() {
    const set = false;
    this.chartTypes.forEach(item => {
      item.isSelected = set;
    })
    this.alertTypes.forEach(item => {
      item.isSelected = set;
    })
    this.mapTypes.forEach(item => {
      item.isSelected = set;
    })
    this.cardTypes.forEach(item => {
      item.isSelected = set;
    })
    this.chartChoosen = false;
  }
  async getAllAssets() {
    const session = await this.dataService.getSessionData();
    let params = {}
    if (session.COMPANY_TYPE == 'CORP') {
      // get all
      params = { COMPANY_ID: 0 };
    } else {
      params = { COMPANY_ID: session.COMPANY_ID };
    }

    this.dataService.getAssetConfig(params).subscribe(res => {
      this.options = res.data;
    })
  }

  selectMap(a: any) {
    this.isSelected = true;
    this.mapTypes.forEach(item => {
      item.isSelected = false;
    })
    a.isSelected = this.isSelected;
    this.newForm.patchValue({
      WIDGET_TYPE: a.name.toUpperCase(),
      WIDGET_IMG: a.file, CHART_NAME: null,
      isChartSelected:false
    })

    // console.log(this.Values)
    this.chartChoosen = false;
  }
  selectChart(a: any) {
    this.isSelected = true;
    this.chartTypes.forEach(item => {
      item.isSelected = false;
    })
    a.isSelected = this.isSelected;
    this.newForm.patchValue({
      CHART_NAME: a.name.toLowerCase(),
      WIDGET_IMG: a.file,
      WIDGET_TYPE: 'CHARTS',
      isChartSelected:true
    })
    this.chartChoosen = true;
    console.log(this.Values)

  }
  selectAlert(a: any) {
    const isSelected = true;
    this.alertTypes.forEach(item => {
      item.isSelected = false;
    })
    a.isSelected = isSelected;

    this.newForm.patchValue({
      WIDGET_TYPE: a.name.toUpperCase(),
      WIDGET_IMG: a.file, CHART_NAME: null,
      isChartSelected:false
    })
    this.chartChoosen = false;

  }
  selectCard(a: any) {
    const isSelected = true;
    this.cardTypes.forEach(item => {
      item.isSelected = false;
    })
    a.isSelected = isSelected;

    this.newForm.patchValue({
      WIDGET_TYPE: a.name.toUpperCase(),
      WIDGET_IMG: a.file, CHART_NAME: null,
      isChartSelected:false

    })
    this.chartChoosen = false;
    // to check only maps
    // const isChartSelected = this.cardTypes.filter((item: any, index) => {
    //   return item.isSelected === true && index == 0;
    // })
    // if (isChartSelected.length > 0) {
    //   this.chartChoosen = true;
    // } else {
    //   this.chartChoosen = false;
    // }
    // this.newForm.patchValue({
    //   isChartSelected: this.chartChoosen
    // })
    // console.log(this.Values)
  }
  async confirmData() {
    // console.log(this.newForm)
    if (this.newForm.valid) {
      const session = await this.dataService.getSessionData();
      // this.Values.COMPANY_ID = session.COMPANY_ID;
      this.Values.CREATED_BY = session.PID;
      // const query = `SELECT * FROM ${this.Values.CHART_TYPE} WHERE PID=${this.Values.CHART_DATA}`;
      // this.Values.SQL_QUERY = JSON.stringify(query);
      this.Values.SQL_QUERY = 'sql';
      if (!this.Values.PID) {
        // if  add
        const params: any = {
          width: 330, height: 320, left: 0, top: 0
        }
        this.Values.WIDGET_SIZE = JSON.stringify(params);

      } if (this.chartChoosen) {
        // by default x axis as date wise        
        this.Values.XAXES = this.xAxesOPTION[0].key
      }
      this.Values.LOADED = true;
      this.dataService.addChartRequest(this.Values).subscribe(res => {
        // console.log(res)
        this.confirmClose();
        this.openSnackBar()
      })
    }
  }
  get Values() {
    return this.newForm.value;
  }
  openSnackBar() {
    this._snackBar.openFromComponent(TooltipComponent, {
      duration: 5 * 1000,
    });
  }
  confirmClose() {
    this.dialog.closeAll()
    this.chartChoosen = false;
    this.resetWidgetSelection();

  }

  getChartStatus() {
    return this.newForm.get('isChartSelected')?.value;
  }

  get chartStatus() {
    const status = this.newForm.controls['isChartSelected'];
    // console.log(status)
    return status;
  }
  optionSelected(event: any) {

    // console.log('this.Values.ASSET_CONFIG_ID', this.Values.ASSET_CONFIG_ID)


  }
  companiesList: any = [];
  getAllComp() {
   
    const session = this.dataService.getSessionData();
    this.newForm.patchValue({
      COMPANY_ID: session.COMPANY_ID
    })
  }
}
