import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { AddAssetConfigComponent } from '../dialogs/add-asset-config/add-asset-config.component';
import { AddSensorComponent } from '../../components/dialogs/add-sensor/add-sensor.component';
import { AddConnectionComponent } from '../../components/dialogs/add-connection/add-connection.component';
import { AddAssetComponent } from '../../components/dialogs/add-asset/add-asset.component';
// import { MatTabChangeEvent } from '@angular/material/tabs';
// import { AddUsersComponent } from '../../components/dialogs/add-users/add-users.component';
// import { AddCompanyComponent } from '../../components/dialogs/add-company/add-company.component';
import { AuthService } from '../../services/auth.service';

enum tabLabel {
 
  'Connections' = 0,
  'Sensors' = 0,
  'Asset' = 2,
 
  'Configuration' = 3,
  
}
enum enum2 {
  'Clients' = 5
}
// enum tabLabel {enum1,enum2};
@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
  @ViewChild('tabG6roup') tabGroup: any;

  tabIndex: any = 0;
  constructor(public dialog: MatDialog,private dataService: AuthService) { 
    
    
  }
  updateUser = true;

  updateConn = false;
  updateConfig = false;
  updateAsset = false;
  updateSensor = false;
  updateComp = 'init';
  companiesList:any=[];
  ngOnInit(): void {
  
    // const session =  this.dataService.getSessionData();
    // if(session){
     
    // }
  
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
    this.updateConn = false;
    // console.log(this.tabIndex, tabLabel.Connections, tabLabel.Sensors)
    if (this.tabIndex === tabLabel.Connections) {
      let dialogRef = this.dialog.open(AddConnectionComponent, {
        width: '500px',
        data: null
      });
      dialogRef.afterClosed().subscribe(result => {

        this.updateConn = true;
      });
    } else if (this.tabIndex === tabLabel.Sensors) {
      let dialogRef = this.dialog.open(AddSensorComponent, {
        width: '800px',
        data: null
      });
      dialogRef.afterClosed().subscribe(result => {

        this.updateSensor = true;
      });
    } else if (this.tabIndex === tabLabel.Configuration) {
      const dialogRef = this.dialog.open(AddAssetConfigComponent, {
        maxWidth: '90vw',
        maxHeight: '90vh',
        height: '90%',
        width: '90%',
        panelClass: 'full-screen-modal',
        data: null
      });
      dialogRef.afterClosed().subscribe(result => {

        this.updateConfig = true;
      });
    } else if (this.tabIndex === tabLabel.Asset) {
      const dialogRef = this.dialog.open(AddAssetComponent, {
        width: '800px',
        data: null
      });

      dialogRef.afterClosed().subscribe(result => {
        this.updateAsset = true;
      });
    }
   


  }
  dialogClose(e: any) {
    console.log(e)

  }

}
