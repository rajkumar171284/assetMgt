import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {AddConnectionComponent} from '../dialogs/add-connection/add-connection.component';
@Component({
  selector: 'app-asset-connections-type',
  templateUrl: './asset-connections-type.component.html',
  styleUrls: ['./asset-connections-type.component.scss']
})
export class AssetConnectionsTypeComponent implements OnInit {
  dataSource = [];
  displayedColumns: string[] = [
    "PID", "CONN_NAME","IP" ,"actions"]
  constructor(private dataService: AuthService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllAssetConn();

  }

  async getAllAssetConn() {
    const session = await this.dataService.getSessionData();
    let params = { COMPANY_ID: session.COMPANY_ID };
    this.dataService.getAssetConn(params).subscribe(res => {
      this.dataSource = res.data;
    })
  }

  editItem(item: any) {
    const ref=this.dialog.open(AddConnectionComponent, {
      width: '800px',
      data: item
    });
    ref.afterClosed().subscribe(result => {

    this.getAllAssetConn();
    })
  }
  removeItem(item: any) {
    this.dataService.deleteConn(item).subscribe(res => {
      this.getAllAssetConn();
    });

  }

}
