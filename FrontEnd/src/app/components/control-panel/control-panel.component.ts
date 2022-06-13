import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { AddAssetConfigComponent } from '../dialogs/add-asset-config/add-asset-config.component';
import { AddSensorComponent } from '../../components/dialogs/add-sensor/add-sensor.component';
import { AddConnectionComponent } from '../../components/dialogs/add-connection/add-connection.component';
import { AddAssetComponent } from '../../components/dialogs/add-asset/add-asset.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AddUsersComponent } from '../../components/dialogs/add-users/add-users.component';
enum tabLabel {
  'Users' = 0,
  'Connections' = 1,
  'Sensors' = 1,
  'Asset' = 2,
  'Configuration' = 3,

}
@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
  @ViewChild('tabGroup') tabGroup: any;

  tabIndex: any = 0;
  constructor(public dialog: MatDialog) { }
  updateUser = true;

  updateConn = false;
  updateConfig = false;
  updateAsset = false;
  updateSensor = false;
  ngOnInit(): void {
  }
  tabChanged(e: any) {
    console.log(e)
    this.tabIndex = e.index;//active tab
  }
  openDialog() {
    this.updateConn = false;
    console.log(this.tabIndex, tabLabel.Connections, tabLabel.Sensors)
    if (this.tabIndex === tabLabel.Connections) {
      let dialogRef = this.dialog.open(AddConnectionComponent, {
        width: '800px',
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
        // width: '1000px',
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
    else if (this.tabIndex === tabLabel.Users) {
      const dialogRef = this.dialog.open(AddUsersComponent, {
        width: '800px',
        data: null
      });

      dialogRef.afterClosed().subscribe(result => {
        this.updateUser = true;
      });
    }


  }
  dialogClose(e: any) {
    console.log(e)

  }

}
