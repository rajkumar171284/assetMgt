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
import {_widgetTYPE,_chartTYPE} from '../../myclass';

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
  widgetType = _widgetTYPE;
  chartTypes = _chartTYPE;

  widgetState = false;
  panelOpenState = true;
  panelOpenState2 = true;
  panelOpenState3 = true;

  dataSource: any = [];
  isSelected = false;

  // isMAPSelected: any = [];
  // auto
  // myControl = new FormControl();
  // myControlType = new FormControl();
  chartChoosen=false;

  options: any[] = [];
  options2: any[] = ['Status', 'Location','COUNT','Trend'];
  newForm: FormGroup = this.fb.group({
    PID: [''],
    WIDGET_TYPE: ['', Validators.required],
    isChartSelected: false,
    CHART_NAME: [this.chartChoosen?Validators.required:null],
    CHART_TYPE: [this.chartChoosen?Validators.required:null],
    WIDGET_DATA: ['', Validators.required],
    ASSET_CONFIG_ID: ['', Validators.required],
    WIDGET_IMG:'',
    SQL_QUERY: [],
    IS_DRAGGED: 0

  });

  constructor(private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) {
    
    console.log(data)
    if (data && data.PID) {
      const type = this.chartTypes.filter(x => {
        return x.name.toLowerCase() === data.NAME.toLowerCase();
      }).map(result => {
        result.isSelected = true;
        return result;
      })
      console.log(type)
      this.newForm.patchValue(data);

    }
  }

  ngOnInit(): void {
    this.getAllAssets();
  }

  async getAllAssets() {
    const session = await this.dataService.getSessionData();
    let params = { COMPANY_ID: session.COMPANY_ID };
    this.dataService.getAssetConfig(params).subscribe(res => {
      this.options = res.data;
    })
  }
  selectType(a: any) {
    this.isSelected = true;
    this.chartTypes.forEach(item => {
      item.isSelected = false;
    })
    a.isSelected = this.isSelected;
    this.newForm.patchValue({
      CHART_NAME: a.name.toLowerCase(),
      WIDGET_IMG:a.file
    })


  }
  selectWidgetType(a: any) {
    const isSelected = true;
    this.widgetType.forEach(item => {
      item.isSelected = false;
    })
    a.isSelected = isSelected;

    this.newForm.patchValue({
      WIDGET_TYPE: a.name.toUpperCase(),
      WIDGET_IMG:a.file

    })

    // to check only maps
    const isChartSelected = this.widgetType.filter((item: any, index) => {
      return item.isSelected === true && index == 0;
    })
    if (isChartSelected.length > 0) {
      this.chartChoosen = true;
    } else {
      this.chartChoosen = false;
    }
    this.newForm.patchValue({
      isChartSelected: this.chartChoosen
    })

  }
  async confirmData() {

    // const msg = await this.findInvalidControls();
    // console.log(msg)

    if (this.newForm.valid) {
      const session = await this.dataService.getSessionData();
      this.Values.COMPANY_ID = session.COMPANY_ID;
      this.Values.CREATED_BY = session.PID;
      const query = `SELECT * FROM ${this.Values.CHART_TYPE} WHERE PID=${this.Values.CHART_DATA}`;
      this.Values.SQL_QUERY = JSON.stringify(query);
      this.Values.IS_DRAGGED = 0;
      console.log(this.Values)
      this.dataService.addChartRequest(this.Values).subscribe(res => {
        console.log(res)
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
    this.chartChoosen=false;
    this.chartTypes.forEach(item => {
      item.isSelected = false;
    })
    this.widgetType.forEach(item => {
      item.isSelected = false;
    })
  }

  getChartStatus() {
    return this.newForm.get('isChartSelected')?.value;
  }

  get chartStatus() {
    const status = this.newForm.controls['isChartSelected'];
    console.log(status)
    return status;
  }
}
