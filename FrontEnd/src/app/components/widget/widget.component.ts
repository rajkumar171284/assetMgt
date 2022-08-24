import { Component, OnInit, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddAssetComponent } from '../../components/dialogs/add-asset/add-asset.component';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { from, Observable, of } from 'rxjs';
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
export class WidgetComponent implements OnInit, AfterViewInit {
  widgetSize = _widgetSIZE;

  // widgetType = _widgetTYPE;
  chartTypes = _chartTYPE;
  chartTypes$!: Observable<any[]>;
  cardTypes$!: Observable<any[]>;
  mapTypes$!: Observable<any[]>;
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
  options2: any[] = ['STATUS', 'COUNT'];
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
  constructor(private cdr: ChangeDetectorRef, private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) {

    console.log('widget', data)
    if (data && data.PID) {

      this.data = data;

      this.newForm.patchValue(data);


    } else {
      // new entry
      this.newForm.patchValue({ IS_DRAGGED: 0 })

    }
    this.getAllComp();
  }
  ngAfterViewInit(): void {
    this.reformAllWidgetTypes();
  }
  ngOnInit(): void {
    this.chartTypes$ = of(this.chartTypes);
    this.cardTypes$ = of(this.cardTypes);
    this.mapTypes$ = of(this.mapTypes);

    this.reformAllWidgetTypes();
    this.getAllAssets();
  }

  reformAllWidgetTypes() {
    this.widgetState = true;
    if (this.data) {

      if (this.data.CHART_NAME) {
        // if chart choosen then make selected by color
        const index = _chartTYPE.findIndex(x => {
          return x.name.toLowerCase() === this.data.CHART_NAME.toLowerCase();
        });
        if (index != -1) {
          // found
          this.chartTypes[index].isSelected = true;
          this.newForm.patchValue({ isChartSelected: true })
          this.chartChoosen = true;
          this.tabIndex = 1;
          this.cdr.detectChanges();
        }

      } else {
        // card widget might selected earlier
        // find out the match one
        const index = _cardTYPE.findIndex(x => {
          return x.name.toLowerCase() === this.data.WIDGET_TYPE.toLowerCase();
        });
        if (index != -1) {
          // found
          this.cardTypes[index].isSelected = true;
          this.newForm.patchValue({ isChartSelected: false })
          this.chartChoosen = false;
          this.tabIndex = 2;//tab -card
          this.cdr.detectChanges();
        } else {
          // not found check map array
          const index = _mapTypes.findIndex(x => {
            return x.name.toLowerCase() === this.data.WIDGET_TYPE.toLowerCase();
          });
          if (index != -1) {
            // found
            this.mapTypes[index].isSelected = true;
            this.newForm.patchValue({ isChartSelected: false })
            this.chartChoosen = false;
            this.tabIndex = 0;//tab -card
            this.cdr.detectChanges();
          }
        }
      }
    } else {
      // fresh entry

    }



  }
  tabChanged(e: any) {
    // console.log(e)
    this.tabIndex = e.index;//active tab    
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
      isChartSelected: false
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
      isChartSelected: true
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
      isChartSelected: false
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
      isChartSelected: false

    })
    this.chartChoosen = false;
  }
  async confirmData() {
    // console.log(this.newForm)
    if (this.newForm.valid) {
      const session = await this.dataService.getSessionData();
      this.Values.CREATED_BY = session.PID;

      this.Values.SQL_QUERY = '';
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
