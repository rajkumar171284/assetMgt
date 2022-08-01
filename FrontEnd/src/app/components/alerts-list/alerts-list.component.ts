import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import{AddAlertComponent} from '../dialogs/add-alert/add-alert.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-alerts-list',
  templateUrl: './alerts-list.component.html',
  styleUrls: ['./alerts-list.component.scss']
})
export class AlertsListComponent implements OnInit {
  loading = false;
  dataSource = [];
  // assetTypes=[];
  allAssetConfigTypes:any=[];
  newForm: FormGroup;
  displayedColumns: string[] = [
    "PID", "ALERT_NAME","THRESHOLD_MIN","THRESHOLD_MAX","THRESHOLD_AVG","PARAMETER","ALERT_TYPE","CREATED_DATE", "actions"];

  constructor(private fb: FormBuilder,private dataService: AuthService, public dialog: MatDialog) { 
    this.newForm = this.fb.group({
      ASSET_CONFIG_ID: [''],

    });
  }

  ngOnInit(): void {
    //get all asset config types
    this.getAllAssetConfigs()
  }
  getAssetID(){
    const pid = this.Values.ASSET_CONFIG_ID;
    if(pid){
    this.loading=true;
    // console.log(pid)
    this.getAlertsByAssetConfigID()
    }
  }
  get Values() {
    return this.newForm.value;
  }
  getAllAssetConfigs() {
    const session = this.dataService.getSessionData();
    let params = {}
    if (session.COMPANY_TYPE == 'CORP') {
      // get all
      params = { COMPANY_ID: 0 };
    } else {
      params = { COMPANY_ID: session.COMPANY_ID };
    }
    this.dataService.getAssetConfig(params).subscribe(res => {
      this.allAssetConfigTypes = res.data;
      if(this.Values.ASSET_CONFIG_ID){
        this.getAlertsByAssetConfigID();
      }


    });
  }
  getAlertsByAssetConfigID() {
    
    let params = {}
      params = { ASSET_CONFIG_ID: this.Values.ASSET_CONFIG_ID };
    this.dataService.getThresholdAlertByAssetConfigID(params).subscribe(res => {
      this.dataSource = res.data;
      this.loading = false;

    });
  }
  editItem(item: any) {
    
    const ref=this.dialog.open(AddAlertComponent, {
      width: '800px',
      data: item
    });
    ref.afterClosed().subscribe(result => {
    this.getAllAssetConfigs();
    });
  }
  removeItem(item: any) {
    // this.dataService.deleteCompanyByID(item).subscribe(res => {
    //   this.getAllAssetConfigs();
    // });

  }
}
