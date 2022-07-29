import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { config } from '../../myclass';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddAssetConfigComponent } from '../dialogs/add-asset-config/add-asset-config.component';
import { TooltipComponent } from '../../components/tooltip/tooltip.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AddMacDetailsComponent } from '../../components/dialogs/add-mac-details/add-mac-details.component';

enum tabs {
  config = 0,
  tab2 = 1,

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  providers: [AuthService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ConfigComponent implements OnInit, OnChanges {
  @Input('tabIndex') tabClose: any;
  tabIndex = 0;
  configData: config[] = [];
  displayedColumns: string[] = [
    "COMPANY_NAME",
    "CONFIG_NAME",
    "Asset_Name",

    // "Industrial_Type",
    // "CONN_NAME",
    // "Tracking_Device_Type",
    'NAME',
    // "Sub_Category_Sensor_Type",
    // "Sensor_Data_Type",
    "MAC_Address", "actions"
  ];
  dataSource: config[] = [];
  constructor(private dataService: AuthService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }
  expandedElement: PeriodicElement | null | undefined;

  ngOnInit(): void {
    // console.log(tabs.config)
    this.getAllAssetConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getAllAssetConfig();
  }
  async getAllAssetConfig() {
    const session = await this.dataService.getSessionData();
    // if admin -inspirisys then show all asset config records by passing company id empty

    let params: any = {}
    if (session.COMPANY_TYPE == 'CORP' && session.ROLE === 'ADMIN') {
      params = { COMPANY_ID: 0 };
    } else if (session.COMPANY_TYPE != 'CORP') {
      // client then pass comp id
      params = { COMPANY_ID: session.COMPANY_ID };

    }

    this.dataService.getAssetConfig(params).subscribe(res => {
      this.dataSource = res.data.map((element: any) => {
      
        return element;

      });
      console.log(this.dataSource)
    })
  }

  editItem(item: any) {
    const dialogRef = this.dialog.open(AddAssetConfigComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
      data: item,

    });
    dialogRef.afterClosed().subscribe(result => {

      this.getAllAssetConfig();
    });
  }
  removeItem(item: any) {

    this.dataService.deleteAssetConfigByID(item).subscribe(res => {

      this.openSnackBar(res);
      this.getAllAssetConfig();
    })
  }
  openSnackBar(data: any) {
    this._snackBar.openFromComponent(TooltipComponent, {
      duration: 5 * 1000,
      data: data.msg
    });
  }

  expandItem(element: any) {
    // console.log(element.stopPropagation())
    if (element) {
      this.dataService.getMACByConfigID(element).subscribe(res => {
        console.log(res)
        if (res && res.data.length > 0) {
          element.macArray = res.data;

        }
        this.expandedElement = this.expandedElement === element ? null : element
      })
    }

  }


  addMAC(item: any) {
    const dialogRef = this.dialog.open(AddMacDetailsComponent, {
      width: '800px',
      data: item,

    });
    dialogRef.afterClosed().subscribe(result => {

      this.expandItem(item);
    });
  }
  editDeviceItem(e: Event, item: any) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(AddMacDetailsComponent, {
      width: '800px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {

      this.expandItem(item);
    });

  }

}
