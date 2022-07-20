import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { AddAssetConfigComponent } from '../dialogs/add-asset-config/add-asset-config.component';
import { AddSensorComponent } from '../../components/dialogs/add-sensor/add-sensor.component';
import { AddConnectionComponent } from '../../components/dialogs/add-connection/add-connection.component';
import { AddAssetComponent } from '../../components/dialogs/add-asset/add-asset.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AddUsersComponent } from '../../components/dialogs/add-users/add-users.component';
import { AddCompanyComponent } from '../../components/dialogs/add-company/add-company.component';
import { AuthService } from '../../services/auth.service';
import {AddAlertComponent} from '../dialogs/add-alert/add-alert.component';
enum tabLabel {
  'Alerts' = 0,
 
  'Create' = 1,
 
  
}

@Component({
  selector: 'app-alert-panel',
  templateUrl: './alert-panel.component.html',
  styleUrls: ['./alert-panel.component.scss']
})
export class AlertPanelComponent implements OnInit {
  @ViewChild('tabG6roup') tabGroup: any;

  tabIndex: any = 0;
  constructor(public dialog: MatDialog,private dataService: AuthService) { 
    
    // const tabLabel={...enum1,...enum2};
    // type tabLabel = typeof tabLabel;
  }
  updateUser = true;

  updateConn = false;
  updateConfig = false;
  updateAsset = false;
  updateSensor = false;
  updateComp = 'init';
  companiesList:any=[];
  // tabLabel:enum1|undefined;
  ngOnInit(): void {
  
    // const session =  this.dataService.getSessionData();
  
   
  }
  async getAllComp() {
    const session = await this.dataService.getSessionData();
  
    this.dataService.getAllCompanies().subscribe(res => {
      this.companiesList = res.data;
    })
  }
  tabChanged(e: any) {
    // console.log(e)
    this.tabIndex = e.index;//active tab
  }
  openDialog() {
    // this.updateConn = false;
     if (this.tabIndex === tabLabel.Alerts) {
      const dialogRef = this.dialog.open(AddAlertComponent, {
        width: '800px',
        data: null
      });

      dialogRef.afterClosed().subscribe(result => {
        this.updateUser = true;
      });
    } 
    // else if (this.tabIndex === tabLabel.Clients) {
    //   this.updateComp = 'init';
    //   const dialogRef = this.dialog.open(AddCompanyComponent, {
    //     width: '800px',
    //     data: null
    //   });

    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('afterClosed')
    //     this.updateComp = 'afterClosed';
    //     this.tabIndex=4;
       
    //   });
    // }


  }
  dialogClose(e: any) {
    console.log(e)

  }


}
