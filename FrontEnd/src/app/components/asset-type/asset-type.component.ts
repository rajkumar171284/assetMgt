import { Component, OnInit,Input,OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddAssetComponent } from '../../components/dialogs/add-asset/add-asset.component';

@Component({
  selector: 'app-asset-type',
  templateUrl: './asset-type.component.html',
  styleUrls: ['./asset-type.component.scss']
})
export class AssetTypeComponent implements  OnChanges{
  @Input('tabIndex')tabIndex:any;

  dataSource = [];
  displayedColumns: string[] = [
    "PID", "NAME", "ASSET_TYPE", "COMPONENTS", "actions"]
  constructor(private dataService: AuthService, public dialog: MatDialog) { }
ngOnChanges(changes: SimpleChanges): void {
  console.log('changes')
  this.getAllAssets();
}

  async getAllAssets() {
    const session = await this.dataService.getSessionData();
    let params = { COMPANY_ID: session.COMPANY_ID };
    this.dataService.getAllAssets(params).subscribe(res => {
      this.dataSource = res.data;
    })
  }

  editItem(item: any) {
    const ref=this.dialog.open(AddAssetComponent, {
      width: '800px',
      data: item
    });
    ref.afterClosed().subscribe(res=>{
      this.getAllAssets();
    })
    
  }
  removeItem(item: any) {
    this.dataService.deleteAsset(item).subscribe(res=>{
      this.getAllAssets();
    })

  }

}
